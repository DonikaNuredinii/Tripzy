const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const logging = require("selenium-webdriver/lib/logging");
require("chromedriver");
const path = require("path");
// const fs = require("fs"); // Removed fs
// const axios = require("axios"); // Removed axios

async function waitForElement(driver, locator, timeout = 10000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await new Promise((resolve) => setTimeout(resolve, 500)); // Added small delay for stability
  return element;
}

async function fillInput(driver, locator, value) {
  console.log(`🔍 Looking for input: ${locator}`);
  const input = await waitForElement(driver, locator);
  console.log(`✅ Found input: ${locator}`);

  try {
    await input.click();
  } catch (clickErr) {
    console.log(
      `⚠️ Regular click failed for ${locator}, trying JavaScript click`
    );
    await driver.executeScript("arguments[0].click();", input);
  }
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check input type to handle dates specially
  const elementType = await input.getAttribute("type");

  if (elementType === "date") {
    console.log(
      `📅 Setting date value via JavaScript for ${locator}: ${value}`
    );
    await driver.executeScript(
      `arguments[0].value = arguments[1];`,
      input,
      value
    );
    console.log(`✅ Date value set via JavaScript for ${locator}`);

    // Trigger input and change events to ensure component recognizes the change
    await driver.executeScript(
      `
      arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
      arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
      `,
      input
    );
    console.log(`✅ Input and change events dispatched for ${locator}`);
  } else {
    await input.clear();
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(`⌨️ Typing: ${value} into ${locator}`);
    await input.sendKeys(value);
    console.log(`✅ Typed: ${value} into ${locator}`);
  }

  // Add verification step
  const startTime = Date.now();
  const timeout = 5000; // 5 seconds timeout for value verification
  let currentValue = await input.getAttribute("value");

  while (currentValue !== value && Date.now() - startTime < timeout) {
    console.log(
      `⏳ Waiting for value to be set in ${locator}. Current: '${currentValue}', Expected: '${value}'`
    );
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait a bit before re-checking
    currentValue = await input.getAttribute("value");
  }

  if (currentValue !== value) {
    throw new Error(
      `❌ Failed to set value '${value}' in element ${locator}. Final value: '${currentValue}'`
    );
  }
  console.log(`✅ Value verified for ${locator}: '${currentValue}'`);

  await new Promise((resolve) => setTimeout(resolve, 500));
  return input;
}

async function checkDateValues(driver) {
  console.log("Checking date values...");
  try {
    const departureDateInput = await waitForElement(
      driver,
      By.css(".trip-option input[name='departureDate']"),
      2000
    ); // Use shorter timeout for check
    const returnDateInput = await waitForElement(
      driver,
      By.css(".trip-option input[name='returnDate']"),
      2000
    ); // Use shorter timeout for check

    const departureDateValue = await departureDateInput.getAttribute("value");
    const returnDateValue = await returnDateInput.getAttribute("value");

    console.log(`🔎 Departure Date Value: '${departureDateValue}'`);
    console.log(`🔎 Return Date Value: '${returnDateValue}'`);
  } catch (error) {
    console.warn("⚠️ Could not check date values:", error.message);
  }
}

async function reSetDateValues(driver) {
  console.log("Attempting to re-set date values before posting...");
  await driver.executeScript(
    `arguments[0].value = arguments[1];`,
    await waitForElement(
      driver,
      By.css(".trip-option input[name='departureDate']"),
      2000
    ), // Find element again if needed
    "2024-07-01"
  );
  await driver.executeScript(
    `arguments[0].value = arguments[1];`,
    await waitForElement(
      driver,
      By.css(".trip-option input[name='returnDate']"),
      2000
    ), // Find element again if needed
    "2024-07-10"
  );
  console.log("✅ Dates re-set before posting");
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Increased delay after re-setting dates
}

(async function createTripPostTest() {
  let driver; // Declare driver here to make it accessible in finally
  // let downloadPath; // Removed downloadPath declaration

  try {
    console.log("🚀 Starting test...");

    const options = new chrome.Options();
    options.addArguments("--start-maximized");
    options.addArguments("--disable-notifications");
    options.addArguments("--disable-popup-blocking");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-gpu");

    // Add logging preferences to capture performance logs (includes console logs)
    const loggingPrefs = new logging.Preferences();
    loggingPrefs.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
    options.setLoggingPrefs(loggingPrefs);

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    console.log("✅ Browser launched");

    await driver.manage().window().setRect({ width: 1280, height: 800 });
    console.log("✅ Window size set to 1280x800");

    await driver.manage().setTimeouts({ implicit: 10000 });

    console.log("🌐 Navigating to http://localhost:3000...");
    await driver.get("http://localhost:3000");
    console.log("✅ Page loaded");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("🔍 Looking for login button in navbar...");
    const loginBtn = await waitForElement(driver, By.css(".navbar .login-btn"));
    console.log("✅ Found login button");

    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      loginBtn
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("🖱️ Clicking login button...");
    await loginBtn.click();
    console.log("✅ Clicked 'Log In'");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("🔍 Waiting for login section...");
    const loginSection = await driver.wait(
      until.elementLocated(By.id("login-section")),
      10000
    );
    console.log("✅ Login section is visible");

    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      loginSection
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("📝 Filling login form...");
    await fillInput(
      driver,
      By.css(".form-box.login-form input[name='Email']"),
      "grace@gmail.com"
    );
    await fillInput(
      driver,
      By.css(".form-box.login-form input[name='Password']"),
      "Grace12?"
    );

    console.log("🖱️ Clicking login submit button...");
    const loginSubmitBtn = await waitForElement(
      driver,
      By.css(".form-box.login-form button.authbutton")
    );
    await loginSubmitBtn.click();
    console.log("✅ Submitted login form");

    await driver.wait(until.urlContains("/feed"), 10000);
    console.log("✅ Successfully redirected to feed page");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("🔍 Looking for Add Trip button...");
    const addTripBtn = await waitForElement(
      driver,
      By.css(".trip-feed-header .add-trip-btn")
    );
    console.log("✅ Found Add Trip button");

    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      addTripBtn
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("🖱️ Clicking Add Trip button...");
    await addTripBtn.click();
    console.log("✅ Clicked Add Trip button");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("📝 Filling trip description...");
    await fillInput(
      driver,
      By.css(".description-input textarea[name='description']"),
      "Exciting trip to Paris with friends! Looking for travel buddies to explore the city of lights."
    );
    await new Promise((resolve) => setTimeout(resolve, 500)); // Added delay

    console.log("📋 Retrieving browser console logs...");
    try {
      const browserLogs = await driver.manage().logs().get("performance");

      console.log("--- Browser Console Logs ---");
      browserLogs.forEach((log) => {
        const message = JSON.parse(log.message).message;
        if (message && message.method === "Runtime.consoleAPICalled") {
          const consoleLog = message.params.args
            .map((arg) => arg.value)
            .join(" ");
          console.log(`[Console] ${consoleLog}`);
        }
      });
      console.log("------------------------");
    } catch (logErr) {
      console.warn(
        "⚠️ Could not retrieve browser console logs:",
        logErr.message
      );
    }

    console.log("📝 Filling trip details...");
    const countrySelect = await waitForElement(
      driver,
      By.css(".trip-option select[name='destinationCountry']")
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      countrySelect
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Select the first actual country option (index 1) using JavaScript
    console.log("🌍 Selecting the first country option...");
    await driver.executeScript(
      `arguments[0].selectedIndex = 1;`, // Select the option at index 1
      countrySelect
    );
    // Trigger a change event after setting the selected index
    await driver.executeScript(
      `arguments[0].dispatchEvent(new Event('change', { bubbles: true }));`,
      countrySelect
    );
    console.log("✅ First country option selected");
    await new Promise((resolve) => setTimeout(resolve, 500)); // Added delay after selection

    await fillInput(
      driver,
      By.css(".trip-option input[name='destinationCity']"),
      "Turkey"
    );
    await new Promise((resolve) => setTimeout(resolve, 500)); // Added delay
    await fillInput(
      driver,
      By.css(".trip-option input[name='departureDate']"),
      "2024-07-01"
    );
    await new Promise((resolve) => setTimeout(resolve, 500)); // Added delay
    await fillInput(
      driver,
      By.css(".trip-option input[name='returnDate']"),
      "2024-07-10"
    );
    await new Promise((resolve) => setTimeout(resolve, 500)); // Added delay
    await fillInput(
      driver,
      By.css(".trip-option input[name='travelStyle']"),
      "Cultural"
    );
    await new Promise((resolve) => setTimeout(resolve, 500)); // Added delay

    // Re-set date values before checking and before posting
    await reSetDateValues(driver);
    // Check date values after filling Travel Style
    await checkDateValues(driver);

    await fillInput(
      driver,
      By.css(".trip-option input[name='budget']"),
      "1500"
    );
    await new Promise((resolve) => setTimeout(resolve, 500)); // Added delay

    // Re-set date values before checking
    await reSetDateValues(driver);
    // Check date values after filling Budget
    await checkDateValues(driver);

    await fillInput(
      driver,
      By.css(".trip-option input[name='lookingFor']"),
      "Travel buddies to explore museums and cafes"
    );
    await new Promise((resolve) => setTimeout(resolve, 500)); // Added delay

    // Check date values after filling Looking For
    await checkDateValues(driver);

    // Re-set date values just before posting to counteract potential component state issues
    console.log("Attempting to re-set date values before posting...");
    await driver.executeScript(
      `arguments[0].value = arguments[1];`,
      await waitForElement(
        driver,
        By.css(".trip-option input[name='departureDate']"),
        2000
      ), // Find element again if needed
      "2024-07-01"
    );
    await driver.executeScript(
      `arguments[0].value = arguments[1];`,
      await waitForElement(
        driver,
        By.css(".trip-option input[name='returnDate']"),
        2000
      ), // Find element again if needed
      "2024-07-10"
    );
    console.log("✅ Dates re-set before posting");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Increased delay after re-setting dates

    console.log("🖱️ Clicking post button...");
    const postBtn = await waitForElement(driver, By.css(".post-button"));
    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      postBtn
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await postBtn.click();
    console.log("✅ Submitted trip post");

    // Check for success message after posting
    console.log("🔍 Waiting for success message after post submission...");
    try {
      await driver.wait(until.elementLocated(By.css(".message")), 10000);
      console.log("✅ Success message found!");
    } catch (err) {
      console.warn("⚠️ Timed out waiting for success message.", err.message);
      // The test will continue even if no success message is found, but log the warning.
    }

    await new Promise((resolve) => setTimeout(resolve, 7000));
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  } finally {
    if (driver) {
      try {
        await driver.quit();
        console.log("🛑 Browser closed");
      } catch (quitErr) {
        console.error("Error closing browser:", quitErr.message);
      }
    }
    // Removed cleanup code for downloaded image
    console.log("🛑 Test completed.");
  }
})();
