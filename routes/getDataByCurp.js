const express = require('express');
const router = express.Router();
const getCurpData = require('../functions/getDataByCurp');
const getRfcData = require('../functions/getRFCByData');

router.post('/', async (req, res) => {
  try {
    const { curp } = req.body;

    if (!curp) {
      return res.status(400).json({ error: "Error en los parametros enviados, revisa que se envian todos los parametros necesarios" });
    }

    const curpRegex = /^[A-Za-z0-9]+$/;

    if (!curpRegex.test(curp)) {
      return res.status(400).json({
        error: "La CURP solo debe contener letras y números, sin espacios ni caracteres especiales"
      });
    }

    if (curp.length !== 18) {
      return res.status(400).json({
        error: "La CURP debe tener exactamente 18 caracteres"
      });
    }

    const dataByCurp = await getCurpData(curp);

    if (!dataByCurp || dataByCurp.success === false) {
      return res.status(400).json(dataByCurp);
    }

    const { nombre, primer_apellido, segundo_apellido, fecha_de_nacimiento } = dataByCurp;

    const [anio, mes, dia] = fecha_de_nacimiento.split('-');

    const rfcByData = await getRfcData({
      nombre,
      paterno: primer_apellido,
      materno: segundo_apellido,
      dia,
      mes,
      anio
    });

    res.json({
      success: true,
      curp: dataByCurp || null,
      rfc: rfcByData || null
    });
    // res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo datos de CURP' });
  }
});

module.exports = router;
