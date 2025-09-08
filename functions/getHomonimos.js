const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function getHomonimos(dataObj) {
  const { nombre, paterno, materno } = dataObj;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1366, height: 768 });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  );

  await page.setExtraHTTPHeaders({
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
  });

  try {
    await page.goto("https://www.buholegal.com/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await new Promise((resolve) => setTimeout(resolve, 8000));

    await page.waitForSelector(
      'button.btn.btn-outline-light.margin5px[data-target="#exampleModal"]',
      { timeout: 40000 }
    );

    await page.click(
      'button.btn.btn-outline-light.margin5px[data-target="#exampleModal"]'
    );
    console.log("Click en Acceder");

    await page.waitForSelector(
      'input[type="text"][name="txtEmail"][id="txtEmail"][placeholder="Correo electrónico"].form-control',
      { visible: true, timeout: 40000 }
    );
    console.log("Input de correo encontrado");

    await page.type(
      'input[type="text"][name="txtEmail"][id="txtEmail"][placeholder="Correo electrónico"].form-control',
      "RRHHINGENIA2019"
    );

    await page.waitForSelector("#accesoTxtPassword", {
      visible: true,
      timeout: 40000,
    });

    await page.type("#accesoTxtPassword", "Rhi123456789");

    await page.waitForSelector(
      'input[type="submit"][value="Acceder"].btn.btn-primary.btn-block',
      { timeout: 40000 }
    );

    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 60000 }),
      page.click(
        'input[type="submit"][value="Acceder"].btn.btn-primary.btn-block'
      ),
    ]);
    console.log("Click en botón Acceder");

    await page.waitForSelector("a.menu_item", { timeout: 30000 });

    await page.goto("https://www.buholegal.com/homonimia/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    console.log("Navegación a Homonimia directa");

    await page.waitForFunction(
      () => {
        return (
          document.querySelectorAll('.controlBusqueda input[type="radio"]')
            .length >= 2
        );
      },
      { timeout: 120000 }
    );

    console.log("Formulario real detectado");

    await page.waitForFunction(
      () => {
        return (
          document.querySelectorAll(".input_control input.form-control")
            .length === 3
        );
      },
      { timeout: 4000 }
    );

    await page.waitForSelector("button.btn.formButton.mt-auto", {
      timeout: 40000,
    });

    const inputs = await page.$$(".input_control input.form-control");

    await inputs[0].type(nombre);
    await inputs[1].type(paterno);
    await inputs[2].type(materno);

    console.log("Texto escrito en los inputs definitivos");

    await page.waitForSelector("button.btn.formButton.mt-auto", {
      timeout: 40000,
    });

    await page.click("button.btn.formButton.mt-auto");

    await page.waitForFunction(
      () => {
        const rows = document.querySelectorAll("table tbody tr");
        if (rows.length < 2) return false;
        const cells = rows[1].querySelectorAll("td");
        return cells.length >= 2 && cells[1].textContent.trim().length > 0;
      },
      { timeout: 40000 }
    );

    const text = await page.evaluate(() => {
      const tr = document.querySelectorAll("table tbody tr")[1];
      return tr ? tr.querySelectorAll("td")[1].textContent.trim() : null;
    });
    console.log("Segundo td del segundo tr:", text);

    let num = 0;

    if (text !== null) {
      num = parseInt(text, 10);
      if (num > 0) {
        num--;
      }
    }

    await browser.close();

    return {
      success: true,
      homonimos: num,
    };
  } catch (err) {
    console.error("Error en navegación:", err.message);
    await browser.close();
    return {
      success: false,
      error: err.message,
    };
  }
}

module.exports = getHomonimos;
