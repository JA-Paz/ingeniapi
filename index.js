const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Importar rutas
const curpDataRoute = require('./routes/getDataByCurp');
const dataCurpRoute = require('./routes/getCurpByData');
const dataRfcRoute = require('./routes/getRFCByData');

// Rutas base
app.use('/ingeniapi/sdrfcc', curpDataRoute);
app.use('/ingeniapi/scrfcd', dataCurpRoute);
app.use('/ingeniapi/srfcd', dataRfcRoute);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
