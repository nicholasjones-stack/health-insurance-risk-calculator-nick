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

//blood pressure category API
app.get('/calculate-bp', (request, response) => {
    
    console.log("calculate-bp called")

    var inputs = url.parse(request.url, true).query
    const systolic = parseInt(inputs.systolic)
    const diastolic = parseInt(inputs.diastolic)

    let category = ""
    if (systolic == 5 || diastolic == 4)
        category = "crisis"
    else if (systolic == 4 || diastolic == 3)
         category = "stage2"
    else if (systolic == 3 || diastolic == 2)
        category = "stage1"
    else if (systolic == 2 && diastolic == 1)
        category = "elevated"
    else if (systolic == 1 && diastolic == 1)
        category = "normal"

    console.log("category: ", category)

    response.send(category)
})

//bmi category API
app.get('/calculate-bmi', (request, response) => {

    console.log("calculate-bmi called")

    var inputs = url.parse(request.url, true).query
    const heightInches = parseInt(inputs.inches) + (parseInt(inputs.feet) * 12)
    const weightPounds = parseInt(inputs.weight)
    
    console.log("inches", heightInches)
    console.log("pounds", weightPounds)

    const heightMeters = heightInches * 0.025
    const weightKG = Math.round(weightPounds / 2.2046)
    const bmi = (weightKG / (heightMeters**2)).toFixed(1)

    console.log("meters", heightMeters)
    console.log("weight", weightKG)

    let bmiCategory = ""
    if (bmi < 24.9)
        bmiCategory = "normal"
    else if (bmi < 29.9)
        bmiCategory = "overweight"
    else
        bmiCategory = "obese"

    console.log("bmi: ", bmi)
    console.log("bmiCategory: ", bmiCategory)

    response.send(bmiCategory)
})

// Risk calculation API
app.get('/risk-category', (request, response) => {

    console.log("Risk API called")

    var inputs = url.parse(request.url, true).query
    const age = parseInt(inputs.age)
    const bmiCategory = parseInt(inputs.bmi)
    const bpCategory = parseInt(inputs.bp)
    const familyHistory = parseInt(inputs.disease)
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
    if (bmiCategory == 1)
        score += 30
    else if (bmiCategory == 2)
        score += 75

    // Blood pressure points
    if (bpCategory === 1)
        score += 15
    else if (bpCategory === 2)
        score += 30
    else if (bpCategory === 3)
        score += 75
    else if (bpCategory === 4)
        score += 100

    //Family history points
    score += familyHistory *10

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

    console.log("Score:", score)
    console.log("Risk:", riskCategory)

    response.send(riskCategory)

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
