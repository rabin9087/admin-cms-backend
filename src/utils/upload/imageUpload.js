import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { S3Client } from '@aws-sdk/client-s3'
import multerS3 from 'multer-s3'

const imgFolderPath = "public/img/product"

export const multerUpload = () => {

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
    return multer({ storage })
}

export const cloudinaryUpload = async (image) => {
    cloudinary.config({
        cloude_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    const upload = await cloudinary.uploader.upload(image, { upload_preset: 'dev_setups' }, function (error, result) {
        error ? console.log(error) : console.log(result)
    })
    return upload
}

export const s3bucketUpload = () => {

    const BUCKET_NAME = process.env.BUCKET_NAME
    const REGION = process.env.REGION
    const ACCESS_KEY = process.env.ACCESS_KEY
    const SECRET_KEY = process.env.SECRET_KEY

    // s3 bucket upload config
    const client = new S3Client({
        region: REGION, credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY }
    });


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

    return upload
}