import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    associate: {
        type: String,
        default: ''
    },
}, {
    timestamps: true,
})

const SessionSchema = mongoose.model("Session", sessionSchema)

export const createNewSession = (obj) => {
    return SessionSchema(obj).save()
}

export const deleteSession = (filter) => {
    return SessionSchema.findOneAndDelete(filter)
}