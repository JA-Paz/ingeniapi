# IngeniAPI

IngeniAPI es una API RESTful desarrollada en Node.js y Express que permite:

# Obtener y validar información de CURP.
# Generar RFC utilizando datos personales.
# Automatizar consultas en servicios oficiales mediante Puppeteer.
# Devuelve resultados estructurados y seguros listos para integrarse en sistemas de recursos humanos, validación de identidad y trámites administrativos.

## Arquitectura y Estructura de Proyecto

- *Backend:* Node.js + Express
- *Automatización:* Puppeteer


├── Dockerfile                  # Configuración para construir la imagen Docker
├── README.md                   # Documentación del proyecto
├── index.js                    # Punto de entrada principal y configuración de rutas
├── package.json                # Metadatos del proyecto y dependencias (npm/yarn)
├── node_modules/               # Dependencias instaladas automáticamente (no versionadas)
├── functions/                  # Lógica principal con Puppeteer
│   ├── getCurpByData.js        # Obtiene CURP a partir de datos personales
│   ├── getDataByCurp.js        # Obtiene información usando la CURP
│   └── getRFCByData.js         # Genera RFC desde datos personales
└── routes/                     # Definición de endpoints en Express
    ├── getCurpByData.js        # Endpoint para CURP y RFC
    ├── getDataByCurp.js        # Endpoint para datos desde CURP
    └── getRFCByData.js         # Endpoint para RFC desde datos


## Archivos clave

#package.json
Contiene la configuración del proyecto:
##Nombre, versión, autor.
##Scripts (ej. start, test, etc.).
##Dependencias (express, puppeteer, etc.).

#node_modules/
Carpeta generada automáticamente al instalar dependencias con npm install.
# No se versiona en GitHub (está ignorada por .gitignore).

## Requisitos Previos
Antes de instalar el proyecto asegúrate de tener:

Node.js v18+

npm (v9+)

Docker (opcional, si deseas correr en contenedor)

## Instalación y Ejecución

sh
npm install
npm start

Por defecto expuesto en http://localhost:3000/.

## Endpoints

### 1. POST /ingeniapi/scrfcd (CURP por Datos y RFC)
- *Body JSON:*
  - nombre, paterno, materno, dia ("01"), mes ("07"), anio ("1990"), sexo ("H"/"M"/"X"), estado (clave estatal, e.g., "DF")
- *Respuesta:*
json
{
  "success": true,
  "curp": {...},
  "rfc": {...}
}

- *Validaciones:*
  - Lógica de validación estricta de campos, estados, fechas y sexo.

### 2. POST /ingeniapi/sdrfcc (Consulta datos por CURP)
- *Body JSON:*
  - curp (18 caracteres alfanuméricos)
- *Respuesta:*
json
{
  "success": true,
  "curp": {...},
  "rfc": {...}
}

- *Validaciones:*
  - Verifica formato, longitud y existencia.
  - Si el CURP es válido, genera automáticamente el RFC asociado.

### 3. POST /ingeniapi/srfcd (Obtener RFC solo por datos)
- *Body JSON:*
  - Igual que /scrfcd, sin sexo ni estado obligatorios

## Detalles Técnicos Relevantes

- *Automatización:*
  - Puppeteer ejecuta scraping/automatización para obtener datos de fuentes oficiales usando sesiones headless.
  - Manejo fino de errores (datos inválidos/adverencias html/timeouts).
- *Funciones:*
  - modules en /functions permiten fácil escalabilidad
  - Normalización y transformación de nombres y fechas
- *Seguridad:*
  - Validaciones rigurosas de entrada en cada endpoint
  - Respuesta inmediata con mensaje de error si los datos no cumplen criterios

## Ejemplo de peticiones

### Generar CURP y RFC
sh
curl -X POST http://localhost:3000/ingeniapi/scrfcd \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan", "paterno": "Pérez", "materno": "López", "dia": "20", "mes": "07", "anio": "1991", "sexo": "H", "estado": "DF"}'

*success*: (boolean) *true o false dependiendo de si fue exitoso o no*
*curp*:
  curp: (string) "*Curp de respuesta*"
  nombre: (string) "*nombre(s)*"
  primer_apellido: (string) "*apellido paterno*"
  segundo_apellido: (string) "*apellido materno*"
  sexo: (string) "*genero HOMBRE o MUJER*"
  fecha_de_nacimiento: (string) "*fecha en formato Y-m-d*"
  nacionalidad: (string) "MEXICO"
  entidad_de_nacimiento: (string) "*estado natal*"
  documento_probatorio: (string) "*documento con el cual se obtuvo la información para el curp*"
  ano_registro: (string) "*año de nacimiento*"
  numero_de_acta: (string) "*número de acta de nacimiento*"
  entidad_de_registro: (string) "*número y nombre del estado de registró la persona*"
  municipio_de_registro: (string) "*número y nombre del municipio de registro*"
*rfc*: 
  success: (boolean) *true o false dependiendo de si fue exitoso o no*
  response: (string) "*Rfc de respuesta*"


### Consultar datos por CURP
sh
curl -X POST http://localhost:3000/ingeniapi/sdrfcc \
  -H "Content-Type: application/json" \
  -d '{"curp": "SOME_CURP_18CHARS"}'


## Dependencias
- express (v5+): Framework de servidor
- puppeteer (v24+): Navegación y scraping headless

## Autor y Licencia
- Autor: Juan Antonio Paz Zuñiga (<antoniopazzuniga@gmail.com>)
- Licencia: ISC