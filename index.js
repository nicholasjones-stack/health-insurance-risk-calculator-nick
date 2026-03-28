const express = require('express')
app = express()

const cors = require("cors")

var url = require('url');

const port = process.env.PORT || 3000

app.use(cors({ origin: '*' }))
app.use(express.static(__dirname + '/static'))
app.use(express.json())

console.log("Hello world");

// Ryan's nodejs test
app.get('/test', (request, response) => {
	console.log('Calling "/test" on the Node.js server.')
	response.type('text/plain')
	response.send('This is the test response.')
})

// Risk calculation API
app.post('/risk-category', (request, response) => {

    const age = parseInt(request.body.age)
    const bmiCategory = request.body.bmiCategory
    const bpCategory = request.body.bpCategory
    const familyHistory = request.body.familyHistory || []

    let score = 0

    // Age points
    if (age < 30)
        score += 0
    else if (age < 45)
        score += 10
    else if (age < 60)
        score += 20
    else
        score += 30

    // BMI points
    if (bmiCategory === "overweight")
        score += 30
    else if (bmiCategory === "obese")
        score += 75

    // Blood pressure points
    if (bpCategory === "elevated")
        score += 15
    else if (bpCategory === "stage1")
        score += 30
    else if (bpCategory === "stage2")
        score += 75
    else if (bpCategory === "crisis")
        score += 100

    // Family history points
    familyHistory.forEach(disease => {

        if (disease === "diabetes")
            score += 10

        if (disease === "cancer")
            score += 10

        if (disease === "alzheimers")
            score += 10

    })

    // Determine risk category
    let riskCategory

    if (score <= 20)
        riskCategory = "low risk"
    else if (score <= 50)
        riskCategory = "moderate risk"
    else if (score <= 75)
        riskCategory = "high risk"
    else
        riskCategory = "uninsurable"

    console.log("Risk API called")
    console.log("Score:", score)
    console.log("Risk:", riskCategory)

    response.json({
        score: score,
        riskCategory: riskCategory
    })

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
