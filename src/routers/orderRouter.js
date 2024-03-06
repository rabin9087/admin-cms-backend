import express from 'express'
import { getAOrderByID, getAllOrders, updateDeliveryStatusByID, updateOrderByID } from '../modules/order/orderModel.js'
import { responder } from '../middlewares/response.js'
const router = express.Router()

router.get("/:_id?", async (req, res, next) => {
    try {
        const { _id } = req.params
        console.log(_id)
        const orders = _id ? await getAOrderByID(_id) : await getAllOrders();
        if (orders.length > 0) {
            return res.status(200).json({
                status: "success",
                message: "here are all orders",
                orders: orders
            })
        } else if (orders?._id) {
            return res.status(200).json({
                status: "success",
                message: "The orders details is",
                orders
            })
        }
        else {
            return res.status(200).json({
                status: "error",
                message: "Unable to find orders",
                orders
            })
        }

    } catch (error) {
        next(error)
    }
})

router.put("/:_id", async (req, res, next) => {
    try {

        const { _id } = req.params
        const data = await updateOrderByID(_id, req.body)
        if (data?._id) {
            return res.json({ status: "success", data })
        }
        return res.json({ status: "error" })


    } catch (error) {
        next(error)
    }
})


export default router