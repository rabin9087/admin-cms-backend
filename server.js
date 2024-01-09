import "dotenv/config"
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import userRouter from './src/routers/userRouter.js'
import { connectDB } from './src/config/mongoConfig.js'

const app = express()
const PORT = process.env.PORT || 8000

//connect Db
connectDB()

//middleware

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))

//local middleware
app.use("/api/v1/users", userRouter)


app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "server is running"
    })
})

app.use((error, req, res, next) => {
    console.log(error, "---------------")
    const errorCode = error.errorCode || 500

    res.status(errorCode).json({
        status: "error",
        code: errorCode,
        message: error.message
    })
})

app.listen(PORT, (error) =>
    error ? console.log(error.messgae) : console.log(`Server is runnint at http://localhost:${PORT}`))