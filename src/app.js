/* eslint-disable semi */
'use strict'

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const { NODE_ENV } = require('./config')
const bookmarksRouter = require('./bookmark-router')
const validateBearerToken = require ('./validateBearerToken')
const errorHandler = require('./error-handler')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())
app.use(validateBearerToken)
  
app.use(bookmarksRouter)
  
app.get('/', (req, res) => {
  res.send('Hello, world!')
})

// eslint-disable-next-line no-unused-vars
app.use(errorHandler)
    
module.exports = app