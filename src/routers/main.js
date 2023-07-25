const express = require('express');
const { register, login, jwtAuth } = require('../controllers/AuthController')
const {addProfile, addPost, getMyProfile} = require('../controllers/ProfileController')
const router = express.Router()


router
    .post('/register', register)
    .post('/login',login)
    .post('/post', jwtAuth, addPost)
    .post('/profile',jwtAuth, addProfile)

    .get('/profile',jwtAuth, getMyProfile)

router.get('/', (req, res) => res.status(200).json("Welcome to API admin") )

router.get('*', (req, res) => res.status(400).json({message: "Page Not Found"}));


module.exports = router