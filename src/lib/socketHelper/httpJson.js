const formatToJson = (http) => {
  const httpLines = http.split('\r\n');

  // console.log(httpLines)

  const method = httpLines[0].split(' ')[0];
  const endpoint = httpLines[0].split(' ')[1];
  const host = httpLines[1].split(' ')[1];

  const headers = {};
  httpLines.forEach((line, index) => {
    if (index > 0 && index < httpLines.length - 1 && line !== '') {
      // eslint-disable-next-line prefer-destructuring
      headers[line.split(': ')[0]] = line.split(': ')[1];
    }
  });

  const body = httpLines[httpLines.length - 1];

  const formattedRequest = {
    method,
    host,
    endpoint,
    headers,
    body,
  };

  return formattedRequest;
};

const formatToHttp = (status, headers = {}, body) => {
  const httpObj = [`HTTP/1.1 ${status.code} ${status.message}`];

  Object.entries(headers).forEach(([key, value]) => {
    httpObj.push(`${key}: ${value}`);
  });

  const httpResponse = `${httpObj.join('\r\n')}\r\n\r\n`;

  if (!body) return httpResponse;

  return `${httpResponse}${body}`;
};

module.exports = {
  formatToJson,
  formatToHttp,
};
