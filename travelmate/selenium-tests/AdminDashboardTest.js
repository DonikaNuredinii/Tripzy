const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

// Function to wait for element
async function waitForElement(driver, locator, timeout = 10000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return element;
}

// Function to fill input field
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

// Admin Dashboard Test
(async function adminDashboardTest() {
  let driver;

  const ADMIN_EMAIL = "rrona2004@gmail.com";
  const ADMIN_PASSWORD = "Rrona12?";

  if (ADMIN_EMAIL === "your_admin_email@example.com") {
    console.error(
      "❌ Please update ADMIN_EMAIL and ADMIN_PASSWORD with actual admin credentials."
    );
    return;
  }

  try {
    console.log("🚀 Starting Admin Dashboard test...");

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

    // Wait for login section to be visible
    console.log("🔍 Waiting for login section...");
    await driver.wait(until.elementLocated(By.id("login-section")), 10000);
    console.log("✅ Login section is visible");

    // Fill in login form with ADMIN credentials
    console.log("📝 Filling login form with admin credentials...");
    await fillInput(
      driver,
      By.css(".form-box.login-form input[name='Email']"),
      ADMIN_EMAIL
    );
    await fillInput(
      driver,
      By.css(".form-box.login-form input[name='Password']"),
      ADMIN_PASSWORD
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
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("🔍 Looking for Dashboard link in navbar...");
    //Find Dashboard Link
    const dashboardLink = await waitForElement(
      driver,
      By.css(".navbar-feed .navbar-center .nav-link[href='/dashboard']")
    );
    console.log("✅ Found the Dashboard link.");

    console.log("🖱️ Clicking the Dashboard link...");
    try {
      await dashboardLink.click();
      console.log("✅ Clicked the Dashboard link.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for Dashboard link, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", dashboardLink);
      console.log("✅ Clicked the Dashboard link (JavaScript click).");
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    //Verify Navigation to Dashboard Page
    console.log("🔍 Verifying navigation to dashboard page...");
    await driver.wait(until.urlContains("/dashboard"), 10000);
    console.log("✅ Successfully navigated to /dashboard.");

    console.log("🎉 Admin Dashboard test completed successfully!");
  } catch (err) {
    console.error("❌ Admin Dashboard test failed:", err.message);
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
