import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    status: {
        type: String,
        default: "inactive",
    },
    role: {
        type: String,
        default: 'user'
    },
    fName: {
        type: String,
        required: true,
    },
    lName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        index: 1,
        required: true,
    },
    phone: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        required: true,
    },
    refreshJWT: {
        type: String,
        default: "",
    }
}, {
    timestamps: true,
})

export default mongoose.model("User", userSchema)