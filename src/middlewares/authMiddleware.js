import { getSession } from "../modules/session/SessionSchema.js"
import { getAUser } from "../modules/user/UserModule.js"
import { createAccessJWTTokne, verifyAccessJWTTokne, verifyRefreshJWTTokne } from "../utils/jwt.js"
import { responder } from "./response.js"

export const adminAuth = async (req, res, next) => {
    try {
        //get access jwt and verify
        const { authorization } = req.headers
        const decoded = verifyAccessJWTTokne(authorization)

        if (decoded?.email) {
            //check if the token is in the db
            const token = await getSession({ token: authorization, associate: decoded.email })
            if (token?._id) {
                //get user by email
                const user = await getAUser({ email: decoded.email })
                if (user?.status === "active" && user?.role === "admin") {
                    user.password = undefined
                    req.userInfo = user
                    return next()
                }

            }
        }
        //get the user and check if active 
        //if all good then go ti next middleware
        return responder.ERROR({
            res, message: "Unauthorized user", errorCode: 401
        })
    } catch (error) {

        next(error)
    }
}

export const refreshAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        console.log(authorization, "kjnckjb========")
        const decoded = verifyRefreshJWTTokne(authorization)
        console.log(decoded, "HGHJI++++")
        if (decoded?.email) {
            const user = await getAUser({ email: decoded.email }, { refreshJWT: authorization })
            if (user?._id && user?.status === "active") {
                const accessJWT = await createAccessJWTTokne(decoded.email)
                console.log(accessJWT, "HGHJI++++")
                return responder.SUCCESS({ res, message: "Here is the accessJWT", accessJWT })
            }
        }
        responder.ERROR({ res, errorCode: 401, message: "Unauthorized user" })
    } catch (error) {
        console.log(error.message)
        if(error.message.includes("jwt must be provided")){
           return responder.ERROR({
                res, errorCode: 403,
                message: "jwt expired",
            })
        }
        next(error)
    }
}