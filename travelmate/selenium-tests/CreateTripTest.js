const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const path = require("path");
const fs = require("fs");

async function waitForElement(driver, locator, timeout = 10000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return element;
}

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

    const options = new chrome.Options();
    options.addArguments("--start-maximized");
    options.addArguments("--disable-notifications");
    options.addArguments("--disable-popup-blocking");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-gpu");

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
      "rrona2004@gmail.com"
    );
    await fillInput(
      driver,
      By.css(".form-box.login-form input[name='Password']"),
      "Rrona12?"
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

    console.log("📸 Starting image upload process...");
    const fileInput = await waitForElement(
      driver,
      By.css(".drop-area input[type='file']")
    );
    console.log("✅ File input element found.");

    await driver.executeScript(
      `
      arguments[0].style.display = 'block';
      arguments[0].style.opacity = '1';
      arguments[0].style.position = 'relative';
      arguments[0].style.zIndex = '1000';
      arguments[0].style.width = '100%';
      arguments[0].style.height = '100%';
    `,
      fileInput
    );
    console.log("✅ File input made visible and interactable.");

    const filePath =
      "C:\\Users\\hp\\OneDrive\\Desktop\\Tripzy\\travelmate\\public\\Images\\switzerland.jpg";
    console.log(`📁 Attempting to use image path: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Error: Test image not found at: ${filePath}`);
      throw new Error(`Test image not found at: ${filePath}`);
    }
    console.log("✅ Image file exists at the specified path.");

    await fileInput.sendKeys(filePath);
    console.log("✅ Image file path successfully sent to input.");

    await driver.executeScript(
      `
      const input = arguments[0];
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    `,
      fileInput
    );
    console.log("✅ Dispatched change event on file input.");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("🔍 Waiting for image preview to appear in the UI...");
    try {
      await driver.wait(
        until.elementLocated(By.css(".preview-container img.preview-image")),
        15000
      );
      console.log("✅ Image preview appeared successfully.");
    } catch (err) {
      console.log(
        "⚠️ Image preview did NOT appear within the expected timeout.",
        err.message
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

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

    await countrySelect.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await countrySelect.sendKeys("France", Key.RETURN);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await fillInput(
      driver,
      By.css(".trip-option input[name='destinationCity']"),
      "Paris"
    );
    await fillInput(
      driver,
      By.css(".trip-option input[name='departureDate']"),
      "2024-07-01"
    );
    await fillInput(
      driver,
      By.css(".trip-option input[name='returnDate']"),
      "2024-07-10"
    );
    await fillInput(
      driver,
      By.css(".trip-option input[name='travelStyle']"),
      "Cultural"
    );
    await fillInput(
      driver,
      By.css(".trip-option input[name='budget']"),
      "1500"
    );
    await fillInput(
      driver,
      By.css(".trip-option input[name='lookingFor']"),
      "Travel buddies to explore museums and cafes"
    );

    console.log("🖱️ Clicking post button...");
    const postBtn = await waitForElement(driver, By.css(".post-button"));
    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      postBtn
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await postBtn.click();
    console.log("✅ Submitted trip post");

    try {
      await driver.wait(until.elementLocated(By.css(".message")), 10000);
      console.log("✅ Success message found");
    } catch (err) {
      console.log("⚠️ No success message found, but continuing...");
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
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
    console.log("🛑 Test completed.");
  }
})();
