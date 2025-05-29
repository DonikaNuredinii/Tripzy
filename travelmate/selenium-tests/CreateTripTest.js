const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const path = require("path");
const fs = require("fs");

// Function to take screenshot
async function takeScreenshot(driver, name) {
  try {
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(`${name}.png`, screenshot, "base64");
    console.log(`📸 Screenshot saved as ${name}.png`);
  } catch (err) {
    console.error(`Failed to take screenshot ${name}:`, err.message);
  }
}

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

(async function createTripPostTest() {
  let driver;

  try {
    console.log("🚀 Starting test...");

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

    // Set window size
    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    console.log("✅ Window size set");

    // Set implicit wait time
    await driver.manage().setTimeouts({ implicit: 10000 });

    // Navigate to the application
    console.log("🌐 Navigating to http://localhost:3000...");
    await driver.get("http://localhost:3000");
    console.log("✅ Page loaded");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Take screenshot of initial page
    await takeScreenshot(driver, "initial-page");

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
    const loginSection = await driver.wait(
      until.elementLocated(By.id("login-section")),
      10000
    );
    console.log("✅ Login section is visible");

    await takeScreenshot(driver, "after-login-click");

    // Fill in login form
    console.log("📝 Filling login form...");
    await fillInput(
      driver,
      By.css(".login-form input[name='Email']"),
      "rrona2004@gmail.com"
    );
    await fillInput(
      driver,
      By.css(".login-form input[name='Password']"),
      "Rrona12?"
    );

    // Submit login form
    console.log("🖱️ Clicking login submit button...");
    const loginSubmitBtn = await waitForElement(
      driver,
      By.css(".login-form button[type='submit']")
    );
    await loginSubmitBtn.click();
    console.log("✅ Submitted login form");

    // Wait for redirect to feed page
    await driver.wait(until.urlContains("/feed"), 10000);
    console.log("✅ Successfully redirected to feed page");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Click Add Trip button
    console.log("🔍 Looking for Add Trip button...");
    const addTripBtn = await waitForElement(driver, By.css(".add-trip-btn"));
    console.log("✅ Found Add Trip button");

    console.log("🖱️ Clicking Add Trip button...");
    await addTripBtn.click();
    console.log("✅ Clicked Add Trip button");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Fill in trip description
    console.log("📝 Filling trip description...");
    await fillInput(
      driver,
      By.css("textarea[name='description']"),
      "Exciting trip to Paris with friends! Looking for travel buddies to explore the city of lights."
    );

    // Upload image directly using file input
    console.log("📸 Uploading image...");
    const fileInput = await waitForElement(
      driver,
      By.css("input[type='file']")
    );
    // Make file input visible if it's hidden
    await driver.executeScript(
      "arguments[0].style.display = 'block';",
      fileInput
    );
    const filePath =
      "C:\\Users\\hp\\OneDrive\\Desktop\\Tripzy\\travelmate\\public\\Images\\travel1.jpg";
    console.log(`📁 Using image path: ${filePath}`);
    await fileInput.sendKeys(filePath);
    console.log("✅ Image uploaded");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Close file explorer if it's open
    try {
      await driver.sendKeys(Key.ESCAPE);
      console.log("✅ Closed file explorer");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.log("ℹ️ No file explorer to close");
    }

    // Fill in trip details
    console.log("📝 Filling trip details...");

    // Select country
    const countrySelect = await waitForElement(
      driver,
      By.name("destinationCountry")
    );
    await countrySelect.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await countrySelect.sendKeys("France", Key.RETURN);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fill other fields
    await fillInput(driver, By.name("destinationCity"), "Paris");
    await fillInput(driver, By.name("departureDate"), "2024-07-01");
    await fillInput(driver, By.name("returnDate"), "2024-07-10");
    await fillInput(driver, By.name("travelStyle"), "Cultural");
    await fillInput(driver, By.name("budget"), "1500");
    await fillInput(
      driver,
      By.name("lookingFor"),
      "Travel buddies to explore museums and cafes"
    );

    // Submit the trip post
    console.log("🖱️ Clicking post button...");
    const postBtn = await waitForElement(driver, By.css(".post-button"));
    await postBtn.click();
    console.log("✅ Submitted trip post");

    // Wait for success message or redirect
    try {
      await driver.wait(until.elementLocated(By.css(".message")), 10000);
      console.log("✅ Success message found");
    } catch (err) {
      console.log("⚠️ No success message found, but continuing...");
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (err) {
    console.error("❌ Test failed:", err.message);
    await takeScreenshot(driver, "error-screenshot");
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
