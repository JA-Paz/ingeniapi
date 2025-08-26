const express = require('express');
const router = express.Router();
const getRfcData = require('../functions/getRFCByData');

router.post('/', async (req, res) => {
  try {
    const { nombre, paterno, materno, dia, mes, anio} = req.body;

    if (!nombre || !paterno || !materno || !dia || !mes || !anio) {
      return res.status(400).json({ error: "Error en los parametros enviados, revisa que se envian todos los parametros necesarios" });
    }

    function validarNombreCampo(campo, valor) {
      const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
      if (!regex.test(valor)) return { valido: false, error: `El campo '${campo}' solo permite letras y espacios.` };
      return { valido: true };
    }

    function validarDia(dia) {
      const regex = /^(0[1-9]|[12][0-9]|3[01])$/;
      if (!regex.test(dia)) return { valido: false, error: "El campo 'dia' debe estar entre 01 y 31 (2 dígitos)." };
      return { valido: true };
    }

    function validarMes(mes) {
      const regex = /^(0[1-9]|1[0-2])$/;
      if (!regex.test(mes)) return { valido: false, error: "El campo 'mes' debe estar entre 01 y 12 (2 dígitos)." };
      return { valido: true };
    }

    function validarAnio(anio) {
      const regex = /^[0-9]{4}$/;
      if (!regex.test(anio)) return { valido: false, error: "El campo 'anio' debe tener 4 dígitos numéricos." };
      return { valido: true };
    }

    const validaciones = [
      validarNombreCampo("nombre", nombre),
      validarNombreCampo("apellidoPaterno", paterno),
      validarNombreCampo("apellidoMaterno", materno),
      validarDia(dia),
      validarMes(mes),
      validarAnio(anio)
    ];

    for (const v of validaciones) {
      if (!v.valido) {
        return res.status(400).json({ error: v.error });
      }
    }

    const rfcByData = await getRfcData({nombre, paterno, materno, dia, mes, anio});
    res.json(rfcByData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo datos '.error });
  }
});

module.exports = router;
