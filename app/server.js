const https = require('https')

const { APP_NAME, PORT } = require('./config')
const app = require('./app')

app.listen(PORT, () => {
  console.log(`${APP_NAME} is listening on port ${PORT}...`)
  const data = JSON.stringify({
    email: 'admin@admin.net',
    password: 'admin',
    admin: true
  })

  const options = {
    hostname: 'flaviocopes.com',
    port: 443,
    path: '/todos',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)
  })

  req.write(data)
  req.end()
})
