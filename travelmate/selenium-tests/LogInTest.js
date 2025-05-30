const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

(async function loginTest() {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  let driver;

  try {
    driver = await new Builder().forBrowser("chrome").build();
    console.log("🚀 Browser launched");

    await driver.get("http://localhost:3000");
    console.log("➡️ Opened homepage");

    // Scroll & click "Log In" in navbar
    const loginBtn = await driver.wait(
      until.elementLocated(By.css(".login-btn")),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      loginBtn
    );
    await sleep(500);
    await loginBtn.click();
    console.log("✅ Clicked 'Log In'");

    await sleep(1500);

    // Wait for login form
    const emailInput = await driver.wait(
      until.elementLocated(By.css("input[name='Email']")),
      10000
    );
    await driver.wait(until.elementIsVisible(emailInput), 10000);

    //Fill Input
    const fillInput = async (selector, value) => {
      const input = await driver.findElement(By.css(selector));
      await driver.executeScript(
        "arguments[0].scrollIntoView({block: 'center'});",
        input
      );
      await input.clear();
      await sleep(300);
      await input.sendKeys(value);
      await sleep(500);
    };

    await fillInput("input[name='Email']", "laida@gmail.com");
    await fillInput("input[name='Password']", "Laida12?");
    console.log("✅ Filled login credentials");

    const submitBtn = await driver.findElement(By.css("button[type='submit']"));
    await driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      submitBtn
    );
    await sleep(500);
    await submitBtn.click();
    console.log("✅ Submitted login form");

    await sleep(5000);
    //End of Test
    console.log("✅ Login test completed");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  } finally {
    if (driver) await driver.quit();
    console.log("🛑 Test ended.");
  }
})();
