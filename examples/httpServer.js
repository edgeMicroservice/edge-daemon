const express = require('express')
const bodyParser = require('body-parser');
const uuid = require('uuid')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const port = 3000

app.all('*', (req, res) => {
  const { route, connection, socket, originalUrl, params, query, url, method, headers, body } = req;
  const requestId = uuid.v4();

  const requestOptions = { originalUrl, params, query, url, method, headers, body };

  console.log('\n\n\n\n')
  console.log(`Request Id: ${requestId}`)
  console.log('\n')

  console.log(requestOptions);

  console.log('\n')
  console.log(`ending request: ${requestId}`)
  console.log('\n\n\n\n')
  res.send('Hello World!')
  res.end()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
