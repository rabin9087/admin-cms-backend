import UserSchema from './UserSchema.js'

export const insertUser = (obj) => {
    return UserSchema(obj).save()
}

export const allUsers = () => {
    return UserSchema.find({ status: "active" })
}

export const allCustomers = () => {
    return UserSchema.find({ status: "active", role: "user" })
}

export const allAdmins = () => {
    return UserSchema.find({ status: "active", role: "admin" })
}

export const updateUser = (filter, update) => {
    return UserSchema.findOneAndUpdate(filter, update, { new: true })
}

export const getUserByEmail = (filter) => {
    return UserSchema.findOne(filter)
}

export const getAUser = (filter) => {
    return UserSchema.findOne(filter)
}

export const getAdminPasswordbyID = (_id) => {
    return UserSchema.findById(_id, { password: 1 })
}