const puppeteer = require("puppeteer");

async function getCurpData(dataObj) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const { nombre, paterno, materno, dia, mes, anio, sexo, estado } = dataObj;

  await page.goto("https://www.gob.mx/curp/", { waitUntil: "networkidle2" });
  await page.waitForSelector("#datos");
  await page.click("#datos");
  await page.waitForSelector("#nombre");
  await page.type("#nombre", nombre);
  await page.waitForSelector("#primerApellido");
  await page.type("#primerApellido", paterno);
  await page.waitForSelector("#segundoApellido");
  await page.type("#segundoApellido", materno);
  await page.select("#diaNacimiento", dia);
  await page.select("#mesNacimiento", mes);
  await page.waitForSelector("#selectedYear");
  await page.type("#selectedYear", anio);
  await page.select("#sexo", sexo);
  await page.select("#claveEntidad", estado);

  await page.click("#searchButton");

  let data = null;

  try {
    await page.waitForSelector("table tr", { timeout: 10000 });

    data = await page.evaluate(() => {
      const rows = document.querySelectorAll("table tr");
      let result = {};

      const normalizeKey = (str) => {
        return str
          .trim()
          .replace(":", "")
          .replace(/\(.*?\)/g, "")
          .replace(/[()]/g, "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/ñ/g, "n")
          .replace(/Ñ/g, "N")
          .replace(/\s+/g, "_")
          .toLowerCase();
      };

      rows.forEach((row) => {
        const cols = row.querySelectorAll("td");
        if (cols.length === 2) {
          let key = normalizeKey(cols[0].innerText);
          let value = cols[1].innerText.trim();
          result[key] = value;
        }
      });

      return result;
    });
  } catch (err) {
    const warningExists = await page.$("#warningMenssage");
    if (warningExists) {
      const warningText = await page.$eval(
        "#warningMenssage .dont-break-out",
        (el) => el.innerText.trim()
      );

      await browser.close();
      return {
        success: false,
        error: "Datos incorrectos",
        message: warningText,
      };
    } else {
      await browser.close();
      return {
        success: false,
        error: "Timeout",
        message:
          "No se encontró la tabla de datos ni el mensaje de advertencia.",
      };
    }
  }

  await browser.close();

  if (data.fecha_de_nacimiento) {
    const [dia, mes, anio] = data.fecha_de_nacimiento.split("/");
    data.fecha_de_nacimiento = `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2,"0")}`;
  }

  return data;
}

module.exports = getCurpData;
