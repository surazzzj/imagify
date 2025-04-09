import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json()); // Add this middleware to parse JSON body
app.use(express.urlencoded({ extended: true })); // If you're sending form data
// app.use(cors())
app.use(cors({
    origin: [
        "http://localhost:5173", "https://finalimagify.netlify.app"
    ],
    credentials: true
}));
await connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.get('/', (req, res) => {
    res.send("API working")
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))



// user - suraj@gmail.com, 123456