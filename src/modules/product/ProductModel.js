import Product from "./ProductSchema.js"
import mongoose from 'mongoose'

export const insertProduct = (productObj) => {
    return Product(productObj).save()
}

export const updateProduct = (filter, update) => {
    return Product.findOneAndUpdate(filter, update, { new: true })
}

export const updateProductById = ({ _id, ...rest }) => {
    return Product.findOneAndUpdate({ _id }, rest, { new: true })
}

export const getManyProductByCatId = (parentCatId) => {
    var id = new mongoose.Types.ObjectId(parentCatId);
    console.log("This is parentID", parentCatId)
    return Product.find({ parentCatId: id })
}

export const getProducts = (number) => {
    return Product.find().limit(5).skip(number)
}

export const getProductsNumber = () => {
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