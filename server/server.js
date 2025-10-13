import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: [
            "https://finalimagify.netlify.app",
            /\.netlify\.app$/,  // allows all Netlify preview URLs
            "http://localhost:5173" // for local development
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ['Content-Type', 'Authorization', 'token'],
        credentials: true
    })
);
app.options("*", cors());

await connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.get('/', (req, res) => {
    res.send("API working")
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))



// user - suraj@gmail.com, 123456