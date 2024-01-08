import express from 'express'
import { insertUser } from '../modules/userModule.js'
const router = express.Router()

router.get("/", async (req, res, next) => {
    try {

        const user = await insertUser(req.body)

        user?._id ? res.json({
            status: "success",
            message: 'New user have been created successfully'
        }) :

            res.json({
                status: "error",
                message: "Unable to create user, Please try again!"
            })
    } catch (error) {
        next(error)
    }
})


export default router;