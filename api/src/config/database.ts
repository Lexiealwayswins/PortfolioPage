// Database configuration - PostgreSQL (using Prisma)
let _PrismaClient: any = null;

let prismaClient: any = null;
let isConnecting = false;

export const getPrismaClient = async (): Promise<any> => {
  if (prismaClient) {
    return prismaClient;
  }

  // If it's connecting, wait
  if (isConnecting) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (prismaClient) {
          clearInterval(interval);
          resolve(prismaClient);
        }
      }, 100);
    });
  }

  // Start connecting
  isConnecting = true;
  try {
    await connectDatabase();
    if (!prismaClient) {
      throw new Error('Prisma still not initialized after connectDatabase()');
    }
    return prismaClient;
  } finally {
    isConnecting = false;
  }
};

export const connectDatabase = async (): Promise<void> => {
  const postgresUrl = process.env.DATABASE_URL;

  if (!postgresUrl) {
    throw new Error('No database connection string found. Please set DATABASE_URL in .env file.');
  }

  if (postgresUrl.startsWith('mongodb')) {
    throw new Error(
      'DATABASE_URL appears to be a MongoDB connection string, but this project now only supports PostgreSQL. ' +
      'Please update DATABASE_URL to a valid PostgreSQL URL (e.g. postgresql://user:pass@localhost:5432/dbname).'
    );
  }

  await connectPostgreSQL(postgresUrl);
};

const connectPostgreSQL = async (url: string): Promise<void> => {
  try {
    // Dynamically import Prisma to avoid errors if not using PostgreSQL
    if (!_PrismaClient) {
      try {
        const prismaModule = await import('@prisma/client');
        _PrismaClient = prismaModule.PrismaClient;
      } catch (importError: any) {
        console.error('Failed to import Prisma client:', importError.message);
        console.error('Tip: Run "npx prisma generate"');
        throw new Error('Prisma client not available. Run "npx prisma generate".');
      }
    }

    prismaClient = new _PrismaClient({
      datasources: {
        db: {
          url: url,
        },
      },
    });

    // Test connection
    await prismaClient.$connect();
    console.log('✅ Connected to PostgreSQL');

    if (url.includes('render.com') || url.includes('onrender.com')) {
      console.log('📌 Using Render PostgreSQL');
    } else {
      console.log('📌 Using custom PostgreSQL connection');
    }
  } catch (err: any) {
    console.error('PostgreSQL connection error:', err.message);
    console.error('Tip: Make sure you have run "npx prisma generate"');
    console.error('Tip: Ensure DATABASE_URL points to a valid PostgreSQL database');
    throw err;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (prismaClient) {
    await prismaClient.$disconnect();
    console.log('Disconnected from PostgreSQL');
  }
};