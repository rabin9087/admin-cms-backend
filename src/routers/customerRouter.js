import express from 'express'
import { adminAuth } from '../middlewares/authMiddleware.js'
import { responder } from '../middlewares/response.js'
import { allAdmins, allCustomers, allUsers } from '../modules/user/UserModule.js'
import { getOrderNumberByUser } from '../modules/order/orderModel.js'

const router = express.Router()

router.get("/", adminAuth, async (req, res, next) => {
    try {
        const result = await allUsers()

        if (result?.length > 0) {
            const customers = result.map(({ _id, password, ...rest }) => {
                console.log(password)
                password = undefined
                return rest?._doc
            })
            return responder.SUCCESS({ res, message: "here is the user ", customers })
        } else {
            responder.ERROR({ res, message: "Unable to find Customers" })
        }

    } catch (error) {
        next(error)
    }
})

router.get("/user", adminAuth, async (req, res, next) => {
    try {
        const result = await allCustomers()

        if (result?.length > 0) {
            const customers = result.map(({ _id, password, ...rest }) => {

                password = undefined
                return rest?._doc
            })
            const id = customers.map(({ _id }) => {
                return _id
            })
            console.log("This is id", id)
            const orders = await getOrderNumberByUser({ userId: id })
            return responder.SUCCESS({ res, message: "here is the user ", customers, orders: orders })
        } else {
            responder.ERROR({ res, message: "Unable to find Customers" })
        }

    } catch (error) {
        next(error)
    }
})

router.get("/admin", adminAuth, async (req, res, next) => {
    try {
        const result = await allAdmins()

        if (result?.length > 0) {
            const customers = result.map(({ _id, password, ...rest }) => {

                password = undefined
                return rest?._doc
            })
            const id = customers.map(({ _id }) => {
                return _id
            })
            console.log("This is id", id)
            const orders = await getOrderNumberByUser({ userId: id })
            return responder.SUCCESS({ res, message: "here is the user ", customers, orders })
        } else {
            responder.ERROR({ res, message: "Unable to find Customers" })
        }

    } catch (error) {
        next(error)
    }
})


export default router;