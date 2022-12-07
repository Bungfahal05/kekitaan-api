const express = require('express')
const { categoryAZ } = require('../controllers/chord')

const router = express.Router()

router.get('/:id', categoryAZ)

module.exports = router