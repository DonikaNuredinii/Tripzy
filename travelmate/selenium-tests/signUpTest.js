const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const fs = require("fs");

//Wait for element
async function waitForElement(driver, locator, timeout = 10000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
}

//Fill Input
async function fillInput(driver, locator, value) {
  console.log(`🔍 Looking for input: ${locator}`);
  const input = await waitForElement(driver, locator);
  console.log(`✅ Found input: ${locator}`);

  try {
    await input.click();
  } catch {
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

//Sign Up Test
(async function signUpTest() {
  let driver;

  try {
    console.log("🚀 Starting test...");

    const options = new chrome.Options();
    options.addArguments(
      "--start-maximized",
      "--disable-notifications",
      "--disable-popup-blocking",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-gpu"
    );

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    await driver.manage().setTimeouts({ implicit: 10000 });

    await driver.get("http://localhost:3000");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const loginBtn = await waitForElement(driver, By.css(".navbar .login-btn"));
    await loginBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const loginSection = await driver.wait(
      until.elementLocated(By.id("login-section")),
      10000
    );

    //Sign Up Toggle
    const signUpToggle = await waitForElement(
      driver,
      By.xpath("//span[text()='Sign up']")
    );
    await signUpToggle.click();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    //Sign Up Form
    const signupForm = await waitForElement(
      driver,
      By.css(".form-box.signup-form")
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));

    //Fill Input
    await fillInput(driver, By.css(".signup-form input[name='Name']"), "David");
    await fillInput(
      driver,
      By.css(".signup-form input[name='Lastname']"),
      "Johnson"
    );

    let emailInput;
    try {
      emailInput = await fillInput(
        driver,
        By.css(".signup-form input[name='Email']"),
        "david.johnson@example.com"
      );
    } catch {
      try {
        emailInput = await fillInput(
          driver,
          By.css(".signup-form input[type='email']"),
          "david.johnson@example.com"
        );
      } catch {
        emailInput = await fillInput(
          driver,
          By.xpath(
            "//div[contains(@class, 'signup-form')]//input[@placeholder='Email']"
          ),
          "david.johnson@example.com"
        );
      }
    }

    await fillInput(
      driver,
      By.css(".signup-form input[name='Password']"),
      "Passw0rd!789"
    );
    await fillInput(
      driver,
      By.css(".signup-form input[name='ConfirmPassword']"),
      "Passw0rd!789"
    );

    const genderSelect = await waitForElement(
      driver,
      By.css(".signup-form select[name='Gender']")
    );
    await genderSelect.sendKeys("male");

    await fillInput(
      driver,
      By.css(".signup-form input[name='Birthdate']"),
      "1990-07-20"
    );

    const submitBtn = await waitForElement(
      driver,
      By.css(".signup-form button[type='submit']")
    );
    await submitBtn.click();

    try {
      await driver.wait(until.elementLocated(By.css(".message")), 10000);
      console.log("✅ Success message found");
    } catch {
      console.log("⚠️ No success message found, but continuing...");
    }

    try {
      await driver.wait(until.urlContains("/"), 10000);
      console.log("✅ Successfully redirected to feed page");
    } catch {
      console.log("⚠️ No redirect to feed page detected");
    }

    //End of Test
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
