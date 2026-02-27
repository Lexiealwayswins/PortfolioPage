import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import visitorRoutes from './routes/visitor.routes';
import contactRoutes from './routes/contact.routes';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// const PORT = process.env.PORT || 5001;

// Database connection - PostgreSQL only (using Prisma)
(async () => {
  try {
    await connectDatabase();
    console.log('💡 Using PostgreSQL database (Prisma ORM)');
  } catch (err: any) {
    console.error('❌ Database connection failed:', err.message);
    console.log('💡 Please ensure DATABASE_URL is set correctly in .env file');
    console.log('   Example: postgresql://user:password@localhost:5432/dbname?schema=public');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️  Running in development mode without database (UI testing only)');
    }
  }
})();

app.use(express.json()); // Built-in body parser for JSON
app.use(express.urlencoded({ extended: true }));  // Optional, to parse form-urlencoded

// CORS configuration
app.use(cors({
  // origin: [
  //   'http://localhost:5173',     // Vite default port
  //   'http://127.0.0.1:5173',     // Sometimes the browser uses this
  //   'http://localhost:3000',     // If you've used the React default port
  //   // Add production domain here, e.g. 'https://yourdomain.com'
  // ],
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Routes (must come before static files)
app.use('/visitors', visitorRoutes);
app.use('/contact', contactRoutes);
app.use('/auth', authRoutes);

// Security Middleware
app.use(helmet({
  // Strong CSP. Adjusted to allow required third-party resources.
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      frameAncestors: ["'self'"],
      objectSrc: ["'none'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        // Allow Tailwind CDN for runtime styles in current setup
        "https://cdn.tailwindcss.com",
        // Allow any scripts bundled to call out to aistudiocdn if referenced
        "https://aistudiocdn.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      connectSrc: ["'self'", "http://localhost:5001", "https:"],
      upgradeInsecureRequests: []
    }
  },
  // Opt out of COEP for now to avoid breaking cross-origin embeds
  crossOriginEmbedderPolicy: false,
  // Enforce X-Content-Type-Options, X-Frame-Options, CORP, COOP, etc.
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  // Ensure HSTS is enabled with stronger settings (Render terminates TLS at proxy)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
}));

// Additional security headers not covered directly by helmet
app.use((req, res, next) => {
  // Modern Permissions-Policy (replace deprecated Feature-Policy)
  res.setHeader(
    'Permissions-Policy',
    [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'accelerometer=()',
      'autoplay=()',
      'clipboard-read=()',
      'clipboard-write=()',
      'fullscreen=(self)',
      'payment=()',
      'usb=()'
    ].join(', ')
  );
  // Reduce XSS risk from inline event handlers (kept 'unsafe-inline' in CSP for now due to setup)
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  next();
});

// Trust proxy (for Render/Heroku)
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit contact submissions to 5 per hour
  message: 'Too many contact form submissions, please try again later.',
});

// Apply rate limiting
app.use('/', limiter);
app.use('/contact', contactLimiter);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Request logging (in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Serve static files from React build (in production)
if (process.env.NODE_ENV === 'production') {
  // Serve static assets
  app.use(express.static(path.join(__dirname, '../../dist')));

  // Serve main index.html for all non-API routes
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    // Serve main index.html for all other routes
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   if (process.env.NODE_ENV === 'production') {
//     console.log(`📦 Serving frontend from dist/`);
//   }
// });

export default app;