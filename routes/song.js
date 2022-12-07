const express = require('express')
const { bySong } = require('../controllers/chord')

const router = express.Router()

router.post('/', bySong)

module.exports = router