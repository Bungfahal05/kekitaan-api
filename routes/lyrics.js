const express = require('express')
const { byLyrics } = require('../controllers/chord')

const router = express.Router()

router.post('/', byLyrics)

module.exports = router