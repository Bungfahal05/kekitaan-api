const express = require('express')
const { byArtist } = require('../controllers/chord')

const router = express.Router()

router.post('/', byArtist)

module.exports = router