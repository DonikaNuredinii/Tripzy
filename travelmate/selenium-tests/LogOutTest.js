const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

// Function to wait for element
async function waitForElement(driver, locator, timeout = 10000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return element;
}

// Function to fill Log in Field
async function fillInput(driver, locator, value) {
  console.log(`🔍 Looking for input: ${locator}`);
  const input = await waitForElement(driver, locator);
  console.log(`✅ Found input: ${locator}`);

  try {
    await input.click();
  } catch (clickErr) {
    console.log(`⚠️ Regular click failed, trying JavaScript click`);
    await driver.executeScript("arguments[0].click();", input);
  }
  await new Promise((resolve) => setTimeout(resolve, 500));

  await input.clear();
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log(`⌨️ Typing: ${value}`);
  await input.sendKeys(value);
  console.log(`✅ Typed: ${value}`);

  await new Promise((resolve) => setTimeout(resolve, 500));
  return input;
}

(async function logoutTest() {
  let driver;

  try {
    console.log("🚀 Starting Logout test...");
    // Set up Chrome options
    const options = new chrome.Options();
    options.addArguments("--start-maximized");
    options.addArguments("--disable-notifications");
    options.addArguments("--disable-popup-blocking");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-gpu");

    console.log("⚙️ Initializing Chrome driver...");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    console.log("✅ Browser launched");

    // Window size
    await driver.manage().window().setRect({ width: 1280, height: 800 });
    console.log("✅ Window size set to 1280x800");

    // Wait time
    await driver.manage().setTimeouts({ implicit: 10000 });

    // Navigate to the application
    console.log("🌐 Navigating to http://localhost:3000...");
    await driver.get("http://localhost:3000");
    console.log("✅ Page loaded");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Click login button in navbar
    console.log("🔍 Looking for login button in navbar...");
    const loginBtn = await waitForElement(driver, By.css(".navbar .login-btn"));
    console.log("✅ Found login button");

    console.log("🖱️ Clicking login button...");
    await loginBtn.click();
    console.log("✅ Clicked 'Log In'");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Fill in login form
    console.log("📝 Filling login form...");
    await fillInput(
      driver,
      By.css(".form-box.login-form input[name='Email']"),
      "laida@gmail.com"
    );
    await fillInput(
      driver,
      By.css(".form-box.login-form input[name='Password']"),
      "Laida12?"
    );

    // Submit login form
    console.log("🖱️ Clicking login submit button...");
    const loginSubmitBtn = await waitForElement(
      driver,
      By.css(".form-box.login-form button.authbutton")
    );
    await loginSubmitBtn.click();
    console.log("✅ Submitted login form");

    // Wait for redirect to feed page
    await driver.wait(until.urlContains("/feed"), 10000);
    console.log("✅ Successfully redirected to feed page.");

    // Find Logout Icon using corrected CSS selector
    console.log("🔍 Looking for the Logout icon...");
    const logoutIcon = await waitForElement(
      driver,
      By.css(".navbar-feed .navbar-right svg.nav-icon.log")
    );
    console.log("✅ Found the Logout icon.");

    console.log("🖱️ Clicking the Logout icon...");
    try {
      await logoutIcon.click();
      console.log("✅ Clicked the Logout icon.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for Logout icon, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", logoutIcon);
      console.log("✅ Clicked the Logout icon (JavaScript click).");
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Verify we're back on the login page
    console.log("🔍 Verifying redirect to login page...");
    const loginForm = await waitForElement(
      driver,
      By.css(".form-box.login-form input[name='Email']")
    );
    console.log("✅ Successfully redirected to login page");

    console.log("🎉 Logout test completed successfully!");
  } catch (err) {
    console.error("❌ Logout test failed:", err.message);
  } finally {
    if (driver) {
      try {
        await driver.quit();
        console.log("🛑 Browser closed");
      } catch (quitErr) {
        console.error("Error closing browser:", quitErr.message);
      }
    }
    console.log("🛑 Test completed.");
  }
})();
