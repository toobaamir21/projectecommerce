
const express =require( 'express')

const router = express.Router()


const validate = require('../middleware/validate')

const verifyJWT = require('../middleware/verifyJWT')
const { createReviewSchema } = require('../validations/review')
const { createReview } = require('../controllers/REVIEW.JS')


router.post('/create-review',verifyJWT,validate(createReviewSchema) ,createReview)


module.exports = router
