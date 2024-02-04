import express from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'
import { S3Client } from '@aws-sdk/client-s3'
import { responder } from '../middlewares/response.js'
import slugify from 'slugify'
import { newProductValidate, updateProductValidate } from '../middlewares/joiValidation.js'
import { getAProduct, getProducts, insertProduct, updateProduct, updateProductById } from '../modules/product/ProductModel.js'
// import { deleteACategory, getCategories, insertCategory, updateCategory } from '../modules/category/CategoryModel.js'
const router = express.Router()

const BUCKET_NAME = process.env.BUCKET_NAME
const REGION = process.env.REGION
const ACCESS_KEY = process.env.ACCESS_KEY
const SECRET_KEY = process.env.SECRET_KEY

//s3 client
// const s3 = new AWS.S3({
//     credentials: {
//         accessKeyId: ACCESS_KEY,
//         secretAccessKey: SECRET_KEY
//     },
//     region: REGION
// })

const client = new S3Client({
    region: REGION, credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY }
});


//multer config

const upload = multer({
    storage: multerS3({
        s3: client,
        bucket: BUCKET_NAME,
        metadata: function (req, file, cb) {
            let error = null
            cb(error, { filename: file.fieldname })
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname)
        }
    })
})



const imgFolderPath = "public/img/product"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let error = null
        cb(error, imgFolderPath)
    },
    filename: function (req, file, cb) {
        let error = ""
        const fullFileName = Date.now() + "-" + file.originalname
        cb(error, fullFileName)
    },
})
//end multer config

//const upload = multer({ storage })


//create new category
router.post("/", upload.array("images", 5), newProductValidate, async (req, res, next) => {
    try {
        if (req.files?.length) {
            const newImgs = req.files.map((item) => item.location)
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