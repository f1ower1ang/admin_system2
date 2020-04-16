const express = require('express')
const app = express()
const apiRoute = express.Router()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const user = require('./mock/user')
const dashboard = require('./mock/dashboard')
const emailManage = require('./mock/emailManage')
const emailTrace = require('./mock/email-trace')
const ruleManage = require('./mock/rule-manage')
const userManage = require('./mock/user-manage')

const mocks = [
  ...user,
  ...dashboard,
  ...emailManage,
  ...emailTrace,
  ...ruleManage,
  ...userManage
]

mocks.forEach((route) => {
  apiRoute[route.type](route.url, (req, res) => {
    res.json(route.response(req))
  })
})

app.use(apiRoute)

app.use(express.static('./dist'))

const port = 3000

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
