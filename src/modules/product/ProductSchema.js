import mongoose from 'mongoose'
const { models } = mongoose
const productSchema = new mongoose.Schema({
    status: {
        type: String,
        default: "inactive",
    },
    name: {
        type: String,
        required: true,
    },
    parentCatId: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        index: 1,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },

    salesPrice: {
        type: Number,
    },
    qty: {
        type: Number,
        required: true,
    },
    sizes: [
        {
            type: String,
        },
    ],
    salesStartDate: {
        type: Date,
    },
    salesEndDate: {
        type: Date,
    },
    sku: {
        type: String,
        unique: true,
        index: 1,
        required: true
    },

    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    },

    images: [
        {
            type: String,
        },
    ],
}, {
    timestamps: true,
})


const Product = models.Product || mongoose.model("Product", productSchema)
export default Product