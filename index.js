const express = require('express')
app = express()

const cors = require("cors")

var url = require('url');

const port = process.env.PORT || 3000

app.use(cors({ origin: '*' }))
app.use(express.static(__dirname + '/static'))


console.log("Hello world");

// Ryan's nodejs test
app.get('/test', (request, response) => {
	console.log('Calling "/test" on the Node.js server.')
	response.type('text/plain')
	response.send('This is the test response.')
})

// Custom 404 page.
app.use((request, response) => {
  response.type('text/plain')
  response.status(404)
  response.send('404 - Not Found')
})

// Custom 500 page.
app.use((err, request, response, next) => {
  console.error(err.message)
  response.type('text/plain')
  response.status(500)
  response.send('500 - Server Error')
})

app.listen(port, () => console.log(
  `Express started at \"http://localhost:${port}\"\n` +
  `press Ctrl-C to terminate.`)
)