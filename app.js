const express = require('express');
const app = express();
const fetch = require('node-fetch');
const opentelemetry = require('@opentelemetry/api');

const endpoint =
  'https://raw.githubusercontent.com/JamieDanielson/otel-glossary/main/endpoint.json';
const port = 3000;

app.get('/', async (req, res) => {
  const endpointSpan = opentelemetry.trace
    .getTracer('default')
    .startSpan('Fetching endpoint');
  endpointSpan.setAttribute('isFetch?', 'indeed');
  const response = await endpointReponse(endpoint);
  endpointSpan.end();
  const responseSpan = opentelemetry.trace
    .getTracer('default')
    .startSpan('Showing response from endpoint');
  res.send(`word: ${response.word}\ndescription: ${response.description}`);
  responseSpan.end();
});

const endpointReponse = async (url) =>
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      return json;
    })
    .catch((err) => console.error(`problem getting response: ${err}`));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
