import Joi from 'joi'
import { responder } from './response.js'

const SHORTSTR = Joi.string().max(100).allow(null, "")
const SHORTSTRREQUIRED = SHORTSTR.required()
const LONGSTR = Joi.string().max(500).allow(null, "")
const LONGSTRREQUIRED = LONGSTR.required()
const EMAIL = Joi.string().email({ minDomainSegments: 2 }).max(100)
const EMAILREQUIRED = EMAIL.required()

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