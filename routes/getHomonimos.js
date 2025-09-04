const express = require('express');
const router = express.Router();
const getHomonimos = require('../functions/getHomonimos');

router.post('/', async (req, res) => {
  try {
    const { nombre, paterno, materno} = req.body;

    if (!nombre || !paterno || !materno ) {
      return res.status(400).json({ error: "Error en los parametros enviados, revisa que se envian todos los parametros necesarios" });
    }

    function validarNombreCampo(campo, valor) {
      const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
      if (!regex.test(valor)) return { valido: false, error: `El campo '${campo}' solo permite letras y espacios.` };
      return { valido: true };
    }

    const validaciones = [
      validarNombreCampo("nombre", nombre),
      validarNombreCampo("apellidoPaterno", paterno),
      validarNombreCampo("apellidoMaterno", materno),
    ];

    for (const v of validaciones) {
      if (!v.valido) {
        return res.status(400).json({ error: v.error });
      }
    }

    const homonimos=await getHomonimos({nombre, paterno, materno});
    res.json({
      success: true,
      message: "Conexión con IngeniAPI exitosa",
      homonimos: homonimos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, error: 'Error obteniendo datos' });
  }
});

module.exports = router;
