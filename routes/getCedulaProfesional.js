const express = require('express');
const router = express.Router();
console.log("1");
const getCedulaProfesional = require('../functions/getCedulaProfesional');

console.log("2");

router.post('/', async (req, res) => {
    try {
      console.log("3");
      const { nombre, paterno, materno} = req.body;
      console.log("4");
      
      if (!nombre || !paterno || !materno) {
          return res.status(400).json({ error: "Error en los parametros enviados, revisa que se envian todos los parametros necesarios" });
        }
        console.log("5");
        
        function validarNombreCampo(campo, valor) {
            const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
            if (!regex.test(valor)) return { valido: false, error: `El campo '${campo}' solo permite letras y espacios.` };
            return { valido: true };
        }
        console.log("6");
        
        const validaciones = [
            validarNombreCampo("nombre", nombre),
            validarNombreCampo("apellidoPaterno", paterno),
            validarNombreCampo("apellidoMaterno", materno)
        ];
        console.log("7");
        
        for (const v of validaciones) {
            if (!v.valido) {
                return res.status(400).json({ error: v.error });
            }
        }
        console.log("8");
        
        const cedula = await getCedulaProfesional({nombre, paterno, materno });
        console.log("9");
        res.json({
            success: true,
            message: "Conexión con IngeniAPI exitosa",
            cedula: cedula || null
        });
        console.log("10");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

module.exports = router;
