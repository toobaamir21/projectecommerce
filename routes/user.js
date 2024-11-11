
const express =require( 'express')

const router = express.Router()

const {createUser} = require("../controllers/user")
const {login} = require("../controllers/user")

router.post('/signup',createUser)
router.post('/login',login)

module.exports = router
