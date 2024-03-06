import Product from "./ProductSchema.js"


export const insertProduct = (productObj) => {
    return Product(productObj).save()
}

export const updateProduct = (filter, update) => {
    return Product.findOneAndUpdate(filter, update, { new: true })
}

export const updateProductById = ({ _id, ...rest }) => {
    return Product.findOneAndUpdate({ _id }, rest, { new: true })
}

export const getProducts = () => {
    return Product.find()
}

//get product by filter
export const getAProduct = (filter) => {
    return Product.findOne(filter)
}

//by slug
export const getAProductBySlug = (slug) => {
    return Product.findOne(slug)
}

export const deleteAProduct = (_id) => {
    return Product.findByIdAndDelete(_id)
}