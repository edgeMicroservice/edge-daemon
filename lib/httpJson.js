const formatToJson = (http) => {

  console.log('===>')
  const httpLines = http.split('\r\n');

  console.log(httpLines)

  const method = httpLines[0].split(' ')[0]
  const endpoint = httpLines[0].split(' ')[1]
  const host = httpLines[1].split(' ')[1]
  
  const headers = {};
  httpLines.forEach((line, index) => {
    if (index > 0 && index < httpLines.length - 1 && line !== '') {
      headers[line.split(': ')[0]] = line.split(': ')[1]
    }
  })

  const body = httpLines[httpLines.length - 1]

  const formattedRequest = {
    method,
    host,
    endpoint,
    headers,
    body
  }

  return formattedRequest;
};

module.exports = {
  formatToJson,
};
