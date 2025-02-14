import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoute.js'
import postRoutes from './routes/postRoutes.js'
import {connectDb} from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()   

dotenv.config()
const PORT = process.env.PORT

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(cors({
    origin: "https://67af1543836d7a1dfda42acc--bespoke-fudge-fb649f.netlify.app",
    credentials: true
}))
app.use('/auth', authRoutes);
app.use('/post', postRoutes);


app.listen(PORT, () => {
    console.log("Server started and listening to PORT:",PORT)
connectDb()
})