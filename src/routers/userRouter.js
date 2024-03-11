import express from 'express'
import { comparePassword, hashPassword } from '../utils/bcrypt.js'
import { newAdminValidate, resetPasswordValidate } from '../middlewares/joiValidation.js'
import { responder } from '../middlewares/response.js'
import { v4 as uuidv4 } from 'uuid';
import { sendEmailVerifiedNotificationEmail, sendEmailVerificationLinkEMail, sendOTPEmail, passwordUpdateNotificationEmail } from '../utils/nodemailer.js'
import { getAUser, getAdminPasswordbyID, getUserByEmail, insertUser, updateUser } from '../modules/user/UserModule.js';
import { createNewSession, deleteSession } from '../modules/session/SessionSchema.js';
import { getJwts } from '../utils/jwt.js';
import { adminAuth, refreshAuth } from '../middlewares/authMiddleware.js';
import { OTPGenerator } from '../utils/randomGenerator.js';

const router = express.Router()


//public router
router.post("/signIn", async (req, res, next) => {
    try {

        const { email, password } = req.body
        if (email, password) {
            //get user by email
            const user = await getUserByEmail({ email })

            if (user?.status === "inactive") {
                return responder.ERROR({
                    res,
                    message: "Your account has not been verified, Please check your email and verify it!"
                })
            }

            if (user?._id) {
                //verify password match
                const isPasswordMatch = comparePassword(password, user.password)

                if (isPasswordMatch) {

                    const jwts = await getJwts(email)
                    return responder.SUCCESS({
                        jwts,
                        res,
                        message: "Login success"
                    })
                }
                return responder.ERROR({
                    res,
                    status: "error",
                    message: "Password does not match, Please try again!"
                })
            }

            //create token
            //response token
        }

        responder.ERROR({
            res,
            status: "error",
            message: "Unable to create user, Please try again!"
        })


    } catch (error) {
        if (error.message.includes("E11000 duplicate key error")) {
            error.errorCode = 500;
            error.messsage = "user already exist!"
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

// private router
router.post("/", newAdminValidate, async (req, res, next) => {
    try {
        const { password } = req.body
        req.body.password = hashPassword(password)
        const user = await insertUser(req.body)
        if (user?._id) {
            const c = uuidv4();//this must be store in db
            const token = await createNewSession({ token: c, associate: user.email })
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
            error.messsage = "user already exist!"
        }
        next(error)
    }
})

router.get("/", adminAuth, (req, res, next) => {
    try {
        responder.SUCCESS({ res, message: "here is the user ", user: req.userInfo })
    } catch (error) {
        next(error)
    }
})

router.get("/get-accessjwt", refreshAuth)

//logout user
router.post("/logout", async (req, res, next) => {
    try {
        const { accessJWT, _id } = req.body
        accessJWT && await deleteSession({
            token: accessJWT
        })

        await updateUser({ _id }, { refreshJWT: "" })

        responder.SUCCESS({ res, message: "User is logged out successfully" })
    } catch (error) {
        next(error)
    }
})

//otp request
router.post("/request-otp", async (req, res, next) => {
    try {
        const { email } = req.body
        if (email.includes("@")) {


            //check if user exist
            const user = await getAUser({ email })

            if (user?._id) {
                //create unique OTP
                const otp = OTPGenerator()
                //store otp and email in the session table
                const otpSession = await createNewSession({ token: otp, associate: email })

                if (otpSession?._id) {
                    //send email to user
                    //reqponse user
                    sendOTPEmail({ fName: user.fName, email, otp })
                }
            }
        }
        responder.SUCCESS({
            res,
            message: "OTP has been send, please check your email including junk folder",

        })
    } catch (error) {
        next(error)
    }
})

//password reset
router.patch("/", resetPasswordValidate, async (req, res, next) => {
    try {
        const { email, otp, password } = req.body

        const session = await deleteSession({
            token: otp, associate: email
        })

        if (session?._id) {
            const hashPass = hashPassword(password)
            const user = await updateUser({ email }, { password: hashPass })

            if (user?._id) {
                //send email notification
                passwordUpdateNotificationEmail({ fName: user.fName, email })
                responder.SUCCESS({
                    res,
                    message: "Your Password has been updated",

                })
            }
        }

        responder.ERROR({
            res,
            message: "Invalid otp, unable to update password!",

        })
    } catch (error) {
        next(error)
    }
})

//password update
router.patch("/password", adminAuth, async (req, res, next) => {
    try {
        //get user info, 
        const user = req.userInfo
        const { oldPassword, newPassword } = req.body
        const { password } = await getAdminPasswordbyID(user._id)
        //get password from db by user?._id
        //match the old pass with db pass
        const isMatched = comparePassword(oldPassword, password)
        if (isMatched) {
            const newHashPassword = hashPassword(newPassword)
            const updatedUserPass = await updateUser({ _id: user._id }, { password: newHashPassword })
            if (updatedUserPass?._id) {
                passwordUpdateNotificationEmail({ fName: user.fName, email: user.email })
                return responder.SUCCESS({ res, message: "Your password has been updated" })
            }
        }

        responder.ERROR({ res, message: "Unable to update password, try again!" })

    } catch (error) {
        next(error)
    }
})

export default router;