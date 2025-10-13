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
// app.use(cors())
app.use(
  cors({
    origin: [
      "https://finalimagify.netlify.app", 
      "http://localhost:5173" // for local development
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
await connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.get('/', (req, res) => {
    res.send("API working")
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))



// user - suraj@gmail.com, 123456