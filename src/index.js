import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import middlewares
import { errorHandler, notFound } from './middlewares/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import venueRoutes from './routes/venues.js';
import aiRoutes from './routes/ai.js';
import quoteRoutes from './routes/quotes.js';

// Import database
import db from './models/index.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  allowEIO3: true,
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  upgradeTimeout: 10000
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Test database connection
try {
  await db.sequelize.authenticate();
  console.log('✅ Database connection established successfully.');
} catch (error) {
  console.error('❌ Unable to connect to the database:', error);
  process.exit(1);
}

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Event Planner API is running',
    timestamp: new Date().toISOString(),
    socketIO: 'enabled'
  });
});

// Socket.IO test endpoint
app.get('/socket-test', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Socket.IO server is running',
    connectedClients: io.engine.clientsCount
  });
});

// Serve Socket.IO test page
app.get('/test-socket', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'socket-test.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quotes', quoteRoutes);

// Socket.IO setup
io.engine.on("connection_error", (err) => {
  console.log('🚨 Socket.IO connection error:', err.req);
  console.log('🚨 Error code:', err.code);
  console.log('🚨 Error message:', err.message);
  console.log('🚨 Error context:', err.context);
});

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  console.log('🔌 Transport:', socket.conn.transport.name);
  console.log('🔌 User agent:', socket.handshake.headers['user-agent']);

  socket.conn.on('upgrade', () => {
    console.log('⬆️ Connection upgraded to:', socket.conn.transport.name);
  });

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`👥 User ${socket.id} joined room ${room}`);
    socket.emit('room_joined', { room, message: 'Successfully joined room' });
  });

  socket.on('test_connection', () => {
    console.log(`🧪 Test connection request from ${socket.id}`);
    socket.emit('connection_confirmed', { 
      message: 'Socket.IO connection working',
      timestamp: new Date().toISOString(),
      socketId: socket.id,
      transport: socket.conn.transport.name
    });
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ User disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('🚨 Socket error:', error);
  });

  // Send welcome message
  socket.emit('welcome', {
    message: 'Connected to EventPlanner Socket.IO server',
    socketId: socket.id,
    timestamp: new Date().toISOString(),
    transport: socket.conn.transport.name
  });
});

io.on('error', (error) => {
  console.error('🚨 Socket.IO server error:', error);
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 API Documentation: http://localhost:${PORT}/health`);
});

export default app;
