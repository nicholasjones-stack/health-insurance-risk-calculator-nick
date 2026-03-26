const express = require('express')
app = express()

const cors = require("cors")

var url = require('url');
var dt = require('./date-time');

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/static'))
app.use(cors({ origin: '*' }))

console.log("Hello world");