import express from 'express'
import { responder } from '../middlewares/response.js'
import slugify from 'slugify'
import { newProductValidate, updateProductValidate } from '../middlewares/joiValidation.js'
import { getAProduct, getProducts, insertProduct, updateProduct, updateProductById } from '../modules/product/ProductModel.js'
import { cloudinaryUpload, multerUpload, s3bucketUpload } from '../utils/upload/imageUpload.js'
// import { deleteACategory, getCategories, insertCategory, updateCategory } from '../modules/category/CategoryModel.js'
const router = express.Router()

const upload = multerUpload()
// const upload = s3bucketImage()


//create new category
router.post("/", upload.array("images", 5), newProductValidate, async (req, res, next) => {
    // router.post("/",  newProductValidate, async (req, res, next) => {
    try {

          if (req.files?.length) {
            const newImgs = req.files.map((item) => item.path.slice(6))

            req.body.images = newImgs
            req.body.thumbnail = newImgs[0]
        }
        req.body.slug = slugify(req.body.name, { lower: true, trim: true, })

        //insert into db 

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
router.get("/:_id?", async (req, res, next) => {
    try {
        const { _id } = req.params
        const products = _id ? await getAProduct({ _id }) : await getProducts()
        responder.SUCCESS({
            res, message: "TO do get", products
        })
    } catch (error) {
        next(error)
    }
})

router.put("/", upload.array("newImages", 5), updateProductValidate, async (req, res, next) => {
    try {
        // handel deleting imges
        const { imgToDelete } = req.body
        req.body.images = req.body?.images.split(",")
        if (imgToDelete?.length) {
            req.body.images = req.body?.images.filter((url) => !imgToDelete.includes(url))
        }
        if (req.files?.length) {
            const newImgs = req.files.map((item) => item.path?.slice(6))
            req.body.images = [...req.body.images, ...newImgs]
        }

        //insert into db 
        const product = await updateProductById(req.body)
        product?._id ?
            responder.SUCCESS({
                res, message: "The Product has been updated successfully"
            }) :
            responder.ERROR({
                res, message: "Unable to update product, please try again!"
            })


    } catch (error) {
        if (error.message.includes("E1100 dublicate key error")) {
            error.message = "Slug already exist, try changing the title"
            error.errorCode = 200
        }
        next(error)
    }
})

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