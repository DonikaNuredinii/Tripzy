const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

(async function logoutTest() {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  let driver;

  try {
    driver = await new Builder().forBrowser("chrome").build();
    console.log("🚀 Browser launched");

    // First login since we need to be logged in to test logout
    await driver.get("http://localhost:3000");
    console.log("➡️ Opened homepage");

    // Click login button
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

    // Fill login credentials
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

    // Submit login form
    const submitBtn = await driver.findElement(By.css("button[type='submit']"));
    await driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      submitBtn
    );
    await sleep(500);
    await submitBtn.click();
    console.log("✅ Submitted login form");

    await sleep(5000);

    // Now test logout
    console.log("🔄 Starting logout test");

    // Find and click logout button
    const logoutBtn = await driver.wait(
      until.elementLocated(By.css(".navbar-right .nav-icon[title='Logout']")),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      logoutBtn
    );
    await sleep(500);
    await logoutBtn.click();
    console.log("✅ Clicked logout button");

    // Wait for redirect to login page
    await sleep(2000);

    // Verify we're on the login page by checking for login form
    const loginForm = await driver.wait(
      until.elementLocated(By.css("input[name='Email']")),
      10000
    );
    console.log("✅ Successfully redirected to login page");

    // End of Test
    console.log("✅ Logout test completed");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  } finally {
    if (driver) await driver.quit();
    console.log("🛑 Test ended.");
  }
})();
