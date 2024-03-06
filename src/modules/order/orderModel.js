import mongoose, { Schema, model } from 'mongoose'
import Product from '../product/ProductSchema.js'
const stringType = {
    type: String,
    required: true,
}
const OrderSchema = model("order", {
    deliveryStatus: stringType,
    address: {
        email: stringType,
        name: stringType,
        phone: stringType,
        address: {
            line1: stringType,
            line2: { type: String, default: null },
            city: stringType,
            country: stringType,
            postal_code: stringType,
            state: stringType
        }
    },
    items: [{
        _id: { type: Schema.Types.ObjectId, ref: "Product" },
        orderQty: { type: Number, required: true },
        size: { type: String, required: true },
        deliveryStatus: stringType,
    }

    ],
})
const PopulateProduct = (query) => {
    return query.populate({ path: 'items._id', select: '', model: Product })

}
export const getAllOrders = () => {
    return PopulateProduct(OrderSchema.find())
}

export const getAOrderByID = (_id) => {
    return PopulateProduct(OrderSchema.findOne({ _id }))
}

export const updateOrderByID = (_id, update) => {
    return PopulateProduct(OrderSchema.findByIdAndUpdate(_id, update, { new: true }))
}


export const updateDeliveryStatusByID = (_id, updateId) => {
    const deliveredStatus = "Delivered"
    const result = OrderSchema.updateOne({ _id, "items._id": updateId }, { $set: { "items._id.$.deliveryStatus": deliveredStatus } }, { new: true })

    return result
}