const express = require('express')
const { newChord } = require('../controllers/chord')

const router = express.Router()

router.get('/', newChord)

module.exports = router