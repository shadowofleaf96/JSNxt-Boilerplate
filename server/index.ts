import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import path from 'path';
import useragent from 'express-useragent';
import hpp from 'hpp';
import userRoutes from './routes/userRoutes';
import { apiLimiter, sensitiveMethodsLimiter } from './middleware/rateLimiting';
import prisma from './models/client';

const app = express();
app.use(useragent.express());

const port = parseInt(process.env.PORT || '5000', 10);
const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL];

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Origin',
    'X-Requested-With',
    'Accept',
    'Authorization',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    frameguard: { action: 'deny' },
    noSniff: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
  })
);

app.use(hpp());

app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    sensitiveMethodsLimiter(req, res, next);
  } else {
    apiLimiter(req, res, next);
  }
});

app.get('/', (req: Request, res: Response) => {
  res.redirect(process.env.FRONTEND_URL);
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed', error);
  }
});

process.on('unhandledRejection', (err: Error) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
