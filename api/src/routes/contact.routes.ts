import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { getPrismaClient } from '../config/database.js';

const router = express.Router();
const prisma = await getPrismaClient();

// Submit contact form (public)
router.post('/submit', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim().isLength({ max: 20 }).withMessage('Phone must be less than 20 characters'),
  body('subject').trim().isLength({ min: 3, max: 200 }).withMessage('Subject must be 3-200 characters'),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be 10-5000 characters'),
  body('turnstileToken').isString().withMessage('Captcha token is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { name, email, phone, subject, message, turnstileToken } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Verify Cloudflare Turnstile
    const secretKey = process.env.VITE_CLOUDFLARE_TURNSTILE_SECRET;
    if (secretKey) {
      try {
        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: JSON.stringify({
            secret: secretKey,
            response: turnstileToken,
            remoteip: req.ip,
          }),
        });
        const outcome = await verifyRes.json() as any;
        if (!outcome.success) {
          return res.status(400).json({ success: false, message: 'Captcha verification failed', errors: outcome['error-codes'], });
        }
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Server Verification Error' });
      }
    }

    // Check for spam (same email/IP submitting multiple times in short period)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);

    const recentSubmission = await prisma.contactMessage.findFirst({
      where: {
        OR: [
          { email, createdAt: { gte: oneHourAgo } },
          { ip: ip.toString(), createdAt: { gte: fifteenMinAgo } }
        ]
      }
    }); 

    if (recentSubmission) {
      return res.status(429).json({ 
        success: false,
        message: 'Please wait before submitting another message' 
      });
    }

    // Create new message
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
        ip: ip.toString(),
        userAgent,
        status: 'new',
      }
    });

    res.status(201).json({ 
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      id: contactMessage._id
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to submit message. Please try again later.' 
    });
  }
});

// Get all messages (admin only)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query: any = {};
    
    if (status && ['new', 'read', 'replied', 'archived'].includes(status as string)) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const messages = await prisma.contactMessage.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip,
    });

    const total = await prisma.contactMessage.count({ where: query });
    const unreadCount = await prisma.contactMessage.count({ where: { status: 'new' } });

    res.json({
      messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      unreadCount,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single message (admin only)
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: req.params.id },
      include: {
        repliedBy: { select: { name: true, email: true } }
      }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Mark as read if it's new
    if (message.status === 'new') {
      await prisma.contactMessage.update({
        where: { id: req.params.id },
        data: { status: 'read' }
      });
    }

    res.json(message);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update message status (admin only)
router.patch('/:id/status', authenticate, [
  body('status').isIn(['new', 'read', 'replied', 'archived']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters'),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id: req.params.id }
    });

    if (!existingMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: {
        status,
        notes: notes || existingMessage.notes,
        repliedAt: status === 'replied' && !existingMessage.repliedAt ? new Date() : existingMessage.repliedAt,
        repliedBy: status === 'replied' && !existingMessage.repliedAt ? req.user?.id : existingMessage.repliedBy,
      }
    });

    res.json({ message: 'Status updated', contactMessage: updatedMessage });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete message (admin only)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const deletedMessage = await prisma.contactMessage.delete({
      where: { id: req.params.id }
    });

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

