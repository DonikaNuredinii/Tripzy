const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const path = require("path");

// Function to wait for element
async function waitForElement(driver, locator, timeout = 10000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await new Promise((resolve) => setTimeout(resolve, 500)); // Small wait after visibility
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

// Admin Filter Trips Test
(async function filterTripsTest() {
  let driver;

  // !!! IMPORTANT: Replace with actual admin credentials if needed, or change to regular user !!!
  const USER_EMAIL = "rrona2004@gmail.com"; // Replace with your user email
  const USER_PASSWORD = "Rrona12?"; // Replace with your user password

  if (USER_EMAIL === "your_user_email@example.com") {
    console.error(
      "❌ Please update USER_EMAIL and USER_PASSWORD with actual user credentials."
    );
    return;
  }

  try {
    console.log("🚀 Starting Admin Filter Trips test...");

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

    // Fill in login form with user credentials
    console.log("📝 Filling login form with user credentials...");
    await fillInput(
      driver,
      By.css(".form-box.login-form input[name='Email']"),
      USER_EMAIL
    );
    await fillInput(
      driver,
      By.css(".form-box.login-form input[name='Password']"),
      USER_PASSWORD
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

    // --- Navigate to Dashboard Trips Explorer ---
    console.log("🔍 Looking for Dashboard link in navbar...");
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

    console.log("🔍 Looking for Trips Explorer link in sidebar...");
    const tripsExplorerLink = await waitForElement(
      driver,
      By.css('.sidebar-nav a[href="/dashboard/trips"]')
    );
    console.log("✅ Found the Trips Explorer link.");

    console.log("🖱️ Clicking the Trips Explorer link...");
    try {
      await tripsExplorerLink.click();
      console.log("✅ Clicked the Trips Explorer link.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for Trips Explorer link, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", tripsExplorerLink);
      console.log("✅ Clicked the Trips Explorer link (JavaScript click).");
    }
    await driver.wait(until.urlContains("/dashboard/trips"), 10000);
    console.log("✅ Successfully navigated to /dashboard/trips.");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // --- Apply Filter ---
    console.log("📝 Applying filter...");

    // Select 'Turkey' from the country dropdown
    const countrySelectSelector = 'select[name="country"]';
    console.log(
      `🔍 Looking for country select element with selector: ${countrySelectSelector}`
    );
    const countrySelectElement = await waitForElement(
      driver,
      By.css(countrySelectSelector)
    );
    console.log("✅ Found country select element.");

    console.log("Selecting 'Turkey' from the country dropdown...");
    await countrySelectElement.sendKeys("Turkey");
    console.log("✅ Selected 'Turkey'.");

    console.log("✅ Filter applied.");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    //End of Test
    console.log("🎉 Admin Filter Trips test completed successfully!");
  } catch (err) {
    console.error("❌ Admin Filter Trips test failed:", err.message);
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
