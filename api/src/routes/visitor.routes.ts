import express, { Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { getPrismaClient } from '../config/database.js';

const router = express.Router();
const prisma = await getPrismaClient();

// Track visitor (public endpoint)
router.post('/track', async (req: Request, res: Response) => {
  try {
    // get body safely to prevent undefined
    const body = req.body || {};
    const { path, referer, sessionId, duration } = body;    
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Parse user agent (simple parsing)
    const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'Mobile' : 'Desktop';
    const browser = userAgent.includes('Chrome') ? 'Chrome' :
                   userAgent.includes('Firefox') ? 'Firefox' :
                   userAgent.includes('Safari') ? 'Safari' :
                   userAgent.includes('Edge') ? 'Edge' : 'Other';
    const os = userAgent.includes('Windows') ? 'Windows' :
              userAgent.includes('Mac') ? 'macOS' :
              userAgent.includes('Linux') ? 'Linux' :
              userAgent.includes('Android') ? 'Android' :
              userAgent.includes('iOS') ? 'iOS' : 'Other';

    // Check if this is a new visitor (by IP and session)
    const existingVisitor = await prisma.visitor.findFirst({
      where: {
        ip: ip.toString(),
        sessionId,
        visitedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    const visitor = await prisma.visitor.create({
      data: {
        ip: ip.toString(),
        userAgent,
        referer: referer || req.headers.referer || undefined,
        path: path || req.originalUrl || '/',
        device,
        browser,
        os,
        isNewVisitor: !existingVisitor,
        sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        visitedAt: new Date(),
        duration: duration || 0,
      }
    });

    res.json({ 
      success: true, 
      sessionId: visitor.sessionId,
      isNewVisitor: visitor.isNewVisitor 
    });
  } catch (error: any) {
    console.error('Visitor tracking error:', error);
    res.status(500).json({ success: false, message: 'Failed to track visitor' });
  }
});

// Get visitor analytics (admin only)
router.get('/analytics', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Total visitors
    const totalVisitors = await prisma.visitor.count({
      where: { visitedAt: { gte: startDate } }
    });
    
    // New visitors
    const newVisitors = await prisma.visitor.count({
      where: { 
        visitedAt: { gte: startDate },
        isNewVisitor: true 
      }
    });

    // Unique visitors (by IP) - use distinct via raw query or groupBy
    const uniqueIps = await prisma.visitor.groupBy({
      by: ['ip'],
      where: { visitedAt: { gte: startDate } },
      _count: { ip: true }
    });
    const uniqueVisitorsCount = uniqueIps.length;

    // Top pages (group by path + count)
    const topPages = await prisma.visitor.groupBy({
      by: ['path'],
      where: { visitedAt: { gte: startDate } },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10
    });

    // Visitors by device
    const deviceStats = await prisma.visitor.groupBy({
      by: ['device'],
      where: { visitedAt: { gte: startDate } },
      _count: { device: true },
      orderBy: { _count: { device: 'desc' } }
    });

    // Visitors by browser
    const browserStats = await prisma.visitor.groupBy({
      by: ['browser'],
      where: { visitedAt: { gte: startDate } },
      _count: { browser: true },
      orderBy: { _count: { browser: 'desc' } }
    });

    // Hourly visitors (last 24 hours) - group by hour
    const hourlyStats = await prisma.visitor.groupBy({
      by: ['visitedAt'],
      where: { 
        visitedAt: { 
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
        } 
      },
      _count: { visitedAt: true },
      orderBy: { visitedAt: 'asc' }
    });

    const formattedHourly = hourlyStats.map((item: { visitedAt: Date; _count: { visitedAt: number } }) => ({
      _id: item.visitedAt.getHours(),  // extract hour
      count: item._count.visitedAt
    }));

    res.json({
      period,
      totalVisitors,
      newVisitors,
      returningVisitors: totalVisitors - newVisitors,
      uniqueVisitors: uniqueVisitorsCount,
      topPages: topPages.map((p: { path: string; _count: { path: number } }) => ({ _id: p.path, count: p._count.path })),
      deviceStats: deviceStats.map((d: { device: string; _count: { device: number } }) => ({ _id: d.device, count: d._count.device })),
      browserStats: browserStats.map((b: { browser: string; _count: { browser: number } }) => ({ _id: b.browser, count: b._count.browser })),
      hourlyStats: formattedHourly,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent visitors (admin only)
router.get('/recent', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 50 } = req.query;
    const visitors = await prisma.visitor.findMany({
      orderBy: { visitedAt: 'desc' },
      take: Number(limit),
      select: {
        id: true,
        ip: true,
        userAgent: true,
        referer: true,
        path: true,
        country: true,
        city: true,
        device: true,
        browser: true,
        os: true,
        isNewVisitor: true,
        sessionId: true,
        visitedAt: true,
        duration: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json(visitors);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

