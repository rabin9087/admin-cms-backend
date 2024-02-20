import Joi from 'joi'
import { responder } from './response.js'

const SHORTSTR = Joi.string().max(100).allow(null, "")
const SHORTSTRREQUIRED = SHORTSTR.required()
const NUM = Joi.number().allow(null, "")
const NUMREQUIRED = NUM.required()
const LONGSTR = Joi.string().max(500).allow(null, "")
const LONGSTRREQUIRED = LONGSTR.required()
const EMAIL = Joi.string().email({ minDomainSegments: 2 }).max(100)
const EMAILREQUIRED = EMAIL.required()
const FILESREQUIRED = Joi.object().required()

const joiValidator = ({ schema, req, res, next }) => {
    try {
        const { error } = schema.validate(req.body)
        if (error) {
            return responder.ERROR({ res, message: error.message })
        }
        next()
    } catch (error) {
        next(error)
    }
}

export const newAdminValidate = (req, res, next) => {
    const schema = Joi.object({
        fName: SHORTSTRREQUIRED,
        lName: SHORTSTRREQUIRED,
        email: EMAILREQUIRED,
        phone: SHORTSTR,
        address: SHORTSTR,
        password: SHORTSTRREQUIRED,
    })
    joiValidator({ schema, req, res, next })
}

export const resetPasswordValidate = (req, res, next) => {
    const schema = Joi.object({
        email: EMAILREQUIRED,
        otp: SHORTSTRREQUIRED,
        password: SHORTSTRREQUIRED,
    })
    joiValidator({ schema, req, res, next })
}

export const newProductValidate = (req, res, next) => {
    const schema = Joi.object({
        // status: SHORTSTRREQUIRED,
        name: SHORTSTRREQUIRED,
        parentCatId: SHORTSTRREQUIRED,
        sku: SHORTSTRREQUIRED,
        price: NUMREQUIRED,
        qty: NUMREQUIRED,
        sizes: LONGSTRREQUIRED,
        images: LONGSTRREQUIRED,
        salesPrice: NUM,
        description: LONGSTRREQUIRED,
        salesStartDate: SHORTSTR,
        salesEndDate: SHORTSTR,
    })
    joiValidator({ schema, req, res, next })
}

export const updateProductValidate = (req, res, next) => {

    const schema = Joi.object({
        status: SHORTSTRREQUIRED,
        _id: SHORTSTRREQUIRED,
        name: SHORTSTRREQUIRED,
        parentCatId: SHORTSTRREQUIRED,
        price: NUMREQUIRED,
        qty: NUMREQUIRED,
        sizes: LONGSTRREQUIRED,
        salesPrice: NUM,
        description: LONGSTRREQUIRED,
        salesStartDate: SHORTSTR,
        salesEndDate: SHORTSTR,
        images: LONGSTRREQUIRED,
        thumbnail: LONGSTRREQUIRED,
        imgToDelete: LONGSTR
    })
    joiValidator({ schema, req, res, next })
}