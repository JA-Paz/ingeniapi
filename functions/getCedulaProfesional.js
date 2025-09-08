const puppeteer = require("puppeteer");

async function getCedulaProfesional(dataObj) {

    console.log("H");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const { nombre, paterno, materno } = dataObj;

  await page.goto("https://www.cedulaprofesional.sep.gob.mx/cedula/presidencia/indexAvanzada.action", { waitUntil: "networkidle2" });

  await page.waitForSelector('input[type="text"][name="nombre"]');
  await page.type('input[type="text"][name="nombre"]', nombre);

  await page.waitForSelector('input[type="text"][name="paterno"]');
  await page.type('input[type="text"][name="paterno"]', paterno);

  await page.waitForSelector('input[type="text"][name="materno"]');
  await page.type('input[type="text"][name="materno"]', materno);
  
  await page.waitForSelector("#dijit_form_Button_0");
  await page.click("#dijit_form_Button_0");

  

  /*let data = null;

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

  return data;*/
}

module.exports = getCedulaProfesional;
