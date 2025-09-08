const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Importar rutas
const curpDataRoute = require('./routes/getDataByCurp');
const dataCurpRoute = require('./routes/getCurpByData');
const dataRfcRoute = require('./routes/getRFCByData');
const dataHomonimosRoute = require('./routes/getHomonimos');
const dataCedulaRoute = require('./routes/getCedulaProfesional');

// Rutas base
app.use('/ingeniapi/sdrfcc', curpDataRoute);
app.use('/ingeniapi/scrfcd', dataCurpRoute);
app.use('/ingeniapi/srfcd', dataRfcRoute);
app.use('/ingeniapi/shomonimo', dataHomonimosRoute);
app.use('/ingeniapi/scedula', dataCedulaRoute);

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});