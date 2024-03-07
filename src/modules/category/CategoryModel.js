import CategorySchema from './CategorySchema.js'

export const insertCategory = (obj) => {
    return CategorySchema(obj).save()
}

export const updateCategory = (filter, update) => {
    return CategorySchema.findOneAndUpdate(filter, update, { new: true })
}

export const getCategories = () => {
    return CategorySchema.find()
}



export const getACategory = (filter) => {
    return CategorySchema.findOne(filter)
}

export const deleteACategory = (_id) => {
    return CategorySchema.findByIdAndDelete(_id)
}