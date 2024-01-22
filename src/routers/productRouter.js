import express from 'express'
import { responder } from '../middlewares/response.js'
import slugify from 'slugify'
import { newProductValidate } from '../middlewares/joiValidation.js'
import { insertProduct } from '../modules/product/ProductModel.js'
// import { deleteACategory, getCategories, insertCategory, updateCategory } from '../modules/category/CategoryModel.js'
const router = express.Router()

//create new category
router.post("/", newProductValidate, async (req, res, next) => {
    try {
        req.body.slug = slugify(req.body.name, { lower: true, trim: true, })

        const product = await insertProduct(req.body)
        product?._id ?
        responder.SUCCESS({
            res, message: "New Product has been added successfully"
        }) :
        responder.ERROR({
            res, message: "Unable to add product, please try again!"
        })


    } catch (error) {
        if (error.message.includes("E1100 dublicate key error")) {
            error.message = "Slug already exist, try changing the title"
            error.errorCode = 200
        }
        next(error)
    }
})

//get category
// router.get("/", async (req, res, next) => {
//     try {
//         const categories = await getCategories()
//         responder.SUCCESS({
//             res, message: "TO do get", categories
//         })
//     } catch (error) {
//         next(error)
//     }
// })

//update the category
// router.put("/", async (req, res, next) => {
//     try {
//         const { _id, title, status } = req.body
//         if (_id && title && status) {
//             const cat = await updateCategory({ _id }, { title, status })
//             if(cat?._id){
//                 return responder.SUCCESS({
//                     res, message: "The Category has been updated successfully"
//                 })
//             }
//         }
//         responder.ERROR({
//             res, message: "Invalid data"
//         })
//     } catch (error) {
//         next(error)
//     }
// })

//delete category
// router.delete("/:_id", async(req, res, next) => {
//     try {
//         const {_id} = req.params
//         const cat = await deleteACategory(_id)

//         cat?._id ?
//         responder.SUCCESS({
//             res, message: "The category has been deleted"
//         }) :
//         responder.ERROR({
//             res, message: "Error deleting category, try again later!"
//         })
//     } catch (error) {
//         next(error)
//     }
// })


export default router