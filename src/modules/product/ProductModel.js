import ProductSchema from './ProductSchema.js'

export const insertProduct = (productObj) => {
    return ProductSchema(productObj).save()
}

export const updateProduct = (filter, update) => {
    return ProductSchema.findOneAndUpdate(filter, update, { new: true })
}

export const getProducts = () => {
    return ProductSchema.find()
}

//get product by filter
export const getAProduct = (filter) => {
    return ProductSchema.findOne(filter)
}

//by slug
export const getAProductBySlug = (slug) => {
    return ProductSchema.findOne(slug)
}

export const deleteAProduct = (_id) => {
    return ProductSchema.findByIdAndDelete(_id)
}