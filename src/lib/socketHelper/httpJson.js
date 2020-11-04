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

const capitalize = (text) => {
  const pieces = text.split('-');

  const capitalized = pieces.map((piece) => {
    return piece.charAt(0).toUpperCase() + piece.slice(1);
  });

  return capitalized.join('-');
}

const formatToHttp = (status, headers = {}) => {
  // eslint-disable-next-line no-param-reassign
  // delete headers.connection;
  // eslint-disable-next-line no-param-reassign
  // delete headers['transfer-encoding'];
  // eslint-disable-next-line no-param-reassign
  // headers['Content-Encoding'] = 'UTF-8';
  let isChunked = false;
  if (!headers['transfer-encoding']) {
    console.log('===> response without chunk');
    isChunked= false;
  } else {
    isChunked = true;
    console.log('===> response with chunk');
  }
  const httpObj = [`HTTP/1.1 ${status.code} ${status.message}`];
  // if (headers['content-type']) {
  //   console.log('===> content-type found', headers['content-type']);
  //   headers['content-type'] = `${headers['content-type']}; charset=UTF-8`;
  //   console.log('===> content-type updated', headers['content-type']);
  // } else {
  //   console.log('===> content-type NOT found');
  // }

  Object.entries(headers).forEach(([key, value]) => {
    const capitalizedKey = capitalize(key);
    httpObj.push(`${capitalizedKey}: ${value}`);
  });

  const httpHeaders = `${httpObj.join('\r\n')}\r\n\r\n`;

  return {
    httpHeaders,
    isChunked,
  };
};

module.exports = {
  formatToJson,
  formatToHttp,
};
