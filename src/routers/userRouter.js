import express from 'express'
import { hashPassword } from '../utils/bcrypt.js'
import { newAdminValidate } from '../middlewares/joiValidation.js'
import { responder } from '../middlewares/response.js'
import { v4 as uuidv4 } from 'uuid';
import { sendEmailVerifiedNotificationEmail, sendEmailVerificationLinkEMail } from '../utils/nodemailer.js'
import { insertUser, updateUser } from '../modules/user/UserModule.js';
import { createNewSession, deleteSession } from '../modules/session/SessionSchema.js';

const router = express.Router()

router.post("/", newAdminValidate, async (req, res, next) => {
    try {

        const { password } = req.body
        console.log("Router:::", req.body)
        req.body.password = hashPassword(password)

        const user = await insertUser(req.body)
        console.log("user:bn", user)
        if (user?._id) {
            const c = uuidv4();//this must be store in db
            const token = await createNewSession({ token: c, associate: user.email })
            console.log(token)
            if (token?._id) {
                const url = `${process.env.CLIENT_ROOT_DOMAIN}/verify-email?e=${user.email}&c=${c}`

                //send new email
                sendEmailVerificationLinkEMail({ email: user.email, url, fName: user.fName })
            }
        }

        user?._id ? responder.SUCCESS({
            res,
            status: "success",
            message: "Please check your email to verify your email"
        })
            : responder.ERROR({
                res,
                status: "error",
                message: "Unable to create user, Please try again!"
            })
    } catch (error) {
        if (error.message.includes("E11000 duplicate key error")) {
            error.errorCode = 500;
            error.messsage = "user already exist!!!!!!!!!!!!!"
        }
        next(error)
    }
})


//verify user email

router.post("/verify-email", async (req, res, next) => {
    try {
        const { associate, token } = req.body
        if (associate && token) {
            //delete from session
            const session = await deleteSession({ token, associate })
            //if success, then update user status to active
            console.log(session)
            if (session) {
                //update user table
                const user = await updateUser({ email: associate }, { status: "active" })

                if (user?._id) {
                    //send email notification
                    sendEmailVerifiedNotificationEmail({ email: associate, fName: user.fName })
                    return responder.SUCCESS({ res, message: "Your email verified, You can login now" })
                }
            }
            else {
                return responder.ERROR({ res, message: "Invalid or expired Link" })

            }
        }
    } catch (error) {
        next(error)
    }

})


export default router;