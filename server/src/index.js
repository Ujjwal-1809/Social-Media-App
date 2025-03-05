import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoute.js';
import postRoutes from './routes/postRoutes.js';
import chatRoutes from './routes/chatRoutes.js'
import { connectDb } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { setupSocket } from './lib/socket.js';

dotenv.config();
const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

const url = `https://social-media-app-sw7v.onrender.com`;
const interval = 30000;

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("website reloded");
    })
    .catch((error) => {
      console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);

// Attach io to req object for real-time updates
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin: "https://67c8c815ecf7d40008c50e0f--clinquant-daifuku-1623f6.netlify.app",
    credentials: true
}));

// Routes
app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/api', chatRoutes);


connectDb().then(() => {
    server.listen(PORT, () => {
        console.log("Server started and listening on PORT:", PORT);
    });
});
