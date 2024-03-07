import "dotenv/config"
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './src/config/mongoConfig.js'
import { adminAuth } from "./src/middlewares/authMiddleware.js"
import userRouter from './src/routers/userRouter.js'
import categoryRouter from "./src/routers/categoryRouter.js"
import productRouter from "./src/routers/productRouter.js"
import orderRouter from "./src/routers/orderRouter.js"
import path from 'path'
const app = express()
const PORT = process.env.PORT || 8000

//connect Db
connectDB()

//middleware

app.use(cors())
app.use(express.json())
app.use(morgan(""))

//server statice files
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, "/public")))

//local middleware
app.use("/api/v1/users", userRouter)
app.use("/api/v1/categories", adminAuth, categoryRouter)
app.use("/api/v1/products", adminAuth, productRouter)
app.use("/api/v1/orders", adminAuth, orderRouter)


app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "server is running at admin cricket gear"
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