const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const path = require("path");

// Function to wait for element
async function waitForElement(driver, locator, timeout = 10000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await new Promise((resolve) => setTimeout(resolve, 500));
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

// Admin Add Country Test
(async function addCountryTest() {
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
    console.log("🚀 Starting Admin Add Country test...");

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

    // --- Navigate to Dashboard Country Form ---
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
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for navigation

    console.log("🔍 Looking for Country Form link in sidebar...");
    const countryFormLink = await waitForElement(
      driver,
      By.css('.sidebar-nav a[href="/dashboard/country"]')
    );
    console.log("✅ Found the Country Form link.");

    console.log("🖱️ Clicking the Country Form link...");
    try {
      await countryFormLink.click();
      console.log("✅ Clicked the Country Form link.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for Country Form link, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", countryFormLink);
      console.log("✅ Clicked the Country Form link (JavaScript click).");
    }
    await driver.wait(until.urlContains("/dashboard/country"), 10000);
    console.log("✅ Successfully navigated to /dashboard/country.");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // --- Add a New Country ---
    console.log("🔍 Looking for the 'Add country' button...");
    const addCountryButton = await waitForElement(
      driver,
      By.xpath("//button[contains(text(), '+ Add country')]")
    );
    console.log("✅ Found the 'Add country' button.");

    console.log("🖱️ Clicking the 'Add country' button...");
    try {
      await addCountryButton.click();
      console.log("✅ Clicked the 'Add country' button.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for 'Add country' button, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", addCountryButton);
      console.log("✅ Clicked the 'Add country' button (JavaScript click).");
    }
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for modal to open

    console.log("🔍 Looking for the modal form...");
    await driver.wait(until.elementLocated(By.css(".modal-box")), 10000);
    console.log("✅ Modal form is visible.");

    console.log("📝 Filling the 'Add country' form...");
    await fillInput(
      driver,
      By.css('.modal-box input[name="Name"]'),
      `Test Country ${Date.now()}` // Use a unique name
    );
    await fillInput(
      driver,
      By.css('.modal-box input[name="Image_path"]'),
      "https://via.placeholder.com/150" // Placeholder image URL
    );

    console.log("🖱️ Clicking the 'Save changes' button...");
    const saveButton = await waitForElement(
      driver,
      By.css('.modal-box button.btn-dark[type="submit"]')
    );
    try {
      await saveButton.click();
      console.log("✅ Clicked the 'Save changes' button.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for 'Save changes' button, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", saveButton);
      console.log("✅ Clicked the 'Save changes' button (JavaScript click).");
    }
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for save and modal close

    // Optional: Add assertions here to verify the country was added

    console.log("🎉 Admin Add Country test completed successfully!");
  } catch (err) {
    console.error("❌ Admin Add Country test failed:", err.message);
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
