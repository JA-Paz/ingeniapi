const express = require('express');
const router = express.Router();
const getCurpData = require('../functions/getCurpByData');
const getRfcData = require('../functions/getRFCByData');

router.post('/', async (req, res) => {
  try {
    const { nombre, paterno, materno, dia, mes, anio, sexo, estado } = req.body;

    if (!nombre || !paterno || !materno || !dia || !mes || !anio || !sexo || !estado) {
      return res.status(400).json({ error: "Error en los parametros enviados, revisa que se envian todos los parametros necesarios" });
    }

    const estadosValidos = ["AS","BC","BS","CC","CL","CM","CS","CH","DF","DG","GT","GR","HG","JC","MC","MN","MS","NT","NL","OC","PL","QT","QR","SP","SL","SR","TC","TS","TL","VZ","YN","ZS","NE"];

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

    function validarEstado(estado) {

      const regex = /^[A-Z]{2}$/;
      if (!regex.test(estado)) {
        return { valido: false, error: "El estado debe tener 2 letras mayúsculas (ej: 'DF')." };
      }

      if (!estadosValidos.includes(estado)) {
        return { valido: false, error: `El estado '${estado}' no es válido.` };
      }

      return { valido: true };
    }

    function validarSexo(sexo) {
      if (!["H","M","X"].includes(sexo)) return { valido: false, error: "El sexo debe ser 'H', 'M' o 'X'." };
      return { valido: true };
    }

    const validaciones = [
      validarNombreCampo("nombre", nombre),
      validarNombreCampo("apellidoPaterno", paterno),
      validarNombreCampo("apellidoMaterno", materno),
      validarDia(dia),
      validarMes(mes),
      validarAnio(anio),
      validarEstado(estado),
      validarSexo(sexo)
    ];

    for (const v of validaciones) {
      if (!v.valido) {
        return res.status(400).json({ error: v.error });
      }
    }

    const dataByCurp = await getCurpData({nombre, paterno, materno, dia, mes, anio, sexo, estado});
    const rfcByData=await getRfcData({nombre, paterno, materno, dia, mes, anio});
    res.json({
      success: true,
      curp: dataByCurp || null,
      rfc: rfcByData || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
});

module.exports = router;
