import {Schema, model} from 'mongoose'

const OrderSchema = model("Order", {})

export const getAllOrders = async() => {
 return OrderSchema.find()
}

export const getAOrderByID = async(_id) => {
    return OrderSchema.findById({_id})
   }