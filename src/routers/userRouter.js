import express from 'express'
import { insertUser } from '../modules/user/UserModule.js'
import { hashPassword } from '../utils/bcrypt.js'
import { newAdminValidate } from '../middlewares/joiValidation.js'
import { responder } from '../middlewares/response.js'
import { v4 as uuidv4 } from 'uuid';
import { createNewSession } from '../modules/session/SessionSchema.js'

const router = express.Router()

router.post("/", newAdminValidate, async (req, res, next) => {
    try {

        const { password } = req.body

        req.body.password = hashPassword(password)

        const user = await insertUser(req.body)

        if (user?._id) {
            const c = uuidv4();//this must be store in db
            const token = await createNewSession({ token: c, associate: user.email })

            if (token?._id) {
                const url = `${process.CLIENT_ROOT_DOMAIN}/verify-email?e= ${user.email}&c=${c}`
            }
        }

        user?._id ? responder.SUCCESS({
            res,
            message: "Please check your email to verify your email"
        })
            : responder.ERROR({
                status: "error",
                message: "Unable to create user, Please try again!"
            })
    } catch (error) {
        if (error.message.includes("E1100 dublicate key error collection")) {
            error.errorCode = 200;
            error.messsage = "user already exist!"
        }
        next(error)
    }
})


export default router;