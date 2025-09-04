const puppeteer = require("puppeteer");

async function getRfcData(dataObj) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const { nombre, paterno, materno, dia, mes, anio } = dataObj;

  try {
    await page.goto("https://taxdown.com.mx/rfc/como-sacar-rfc-homoclave", { waitUntil: "networkidle2" });

    // Llenar formulario
    await page.waitForSelector('input[name="name"]');
    await page.type('input[name="name"]', nombre);

    await page.waitForSelector('input[name="lastNamePaternal"]');
    await page.type('input[name="lastNamePaternal"]', paterno);

    await page.waitForSelector('input[name="lastNameMaternal"]');
    await page.type('input[name="lastNameMaternal"]', materno);


    await page.$eval('input[name="birthdate"]', (el, dia, mes, anio) => {
      if (el.type === "date") {
          el.value = `${anio}-${mes}-${dia}`;
      } else {
          el.value = `${dia}/${mes}/${anio}`;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, dia, mes, anio);


    await page.click("a.btn-continuar-exec");

    await page.waitForSelector("div.resultado-script", { timeout: 10000 });
    let data = await page.$eval("div.resultado-script", el => el.innerText.trim());

    return {
      success: true,
      response: data,
      dia: dia,
      mes: mes,
      anio: anio
    };

  } catch (error) {
    return {
      success: false,
      response: error.message
    };
  } finally {
    await browser.close();
  }
}

module.exports = getRfcData;