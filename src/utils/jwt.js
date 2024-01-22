import jwt from 'jsonwebtoken'
import { createNewSession } from '../modules/session/SessionSchema.js'
import { updateUser } from '../modules/user/UserModule.js'
export const createAccessJWTTokne = async (email) => {
    const token = jwt.sign({ email }, process.env.ACCESSJWT_SECRET, { expiresIn: '1d' })
    await createNewSession({
        token, associate: email
    })
    return token
}

export const createRefreshJWTTokne = async (email) => {
    const token = jwt.sign({ email }, process.env.REFRESHJWT_SECRET, { expiresIn: "30d" })
    await updateUser({ email }, { refreshJWT: token })
    return token
}

export const verifyAccessJWTTokne = (accessJWT) => {
    return jwt.verify(accessJWT, process.env.ACCESSJWT_SECRET)
}

export const verifyRefreshJWTTokne = (refreshJWT) => {
    return jwt.verify(refreshJWT, process.env.REFRESHJWT_SECRET)
}

export const getJwts = async (email) => {
    return {
        accessJWT: await createAccessJWTTokne(email),
        refreshJWT: await createRefreshJWTTokne(email)
    }
}