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

// Function to fill input field (used for text inputs)
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

// Change Profile Photo Test
(async function changeProfilePhotoTest() {
  let driver;

  // User credentials
  const USER_EMAIL = "laida@gmail.com"; // Replace with your user email
  const USER_PASSWORD = "Laida12?"; // Replace with your user password

  if (USER_EMAIL === "your_user_email@example.com") {
    console.error(
      "❌ Please update USER_EMAIL and USER_PASSWORD with actual user credentials."
    );
    return;
  }

  // Path to the test image
  const imagePath = path.resolve(__dirname, "../../public/Images/travel1.jpg");
  console.log(`Attempting to use image path: ${imagePath}`);

  try {
    console.log("🚀 Starting Change Profile Photo test...");

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

    // --- Navigate to Profile Page ---
    console.log("🔍 Looking for Profile icon in navbar...");
    const profileLink = await waitForElement(
      driver,
      By.css('.navbar-feed .navbar-right a[href="/profile"]')
    );
    console.log("✅ Found Profile icon.");

    console.log("🖱️ Clicking the Profile icon...");
    try {
      await profileLink.click();
      console.log("✅ Clicked the Profile icon.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for Profile icon, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", profileLink);
      console.log("✅ Clicked the Profile icon (JavaScript click).");
    }
    await driver.wait(until.urlContains("/profile"), 10000); // Wait for URL to contain /profile
    console.log("✅ Successfully navigated to /profile.");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // --- Change Profile Image ---
    console.log("🔍 Looking for profile photo file input...");
    // The file input is hidden, make it visible to Selenium
    await driver.executeScript(
      "document.getElementById('profile-upload').style.display = 'block';"
    );
    const profileFileInput = await waitForElement(
      driver,
      By.id("profile-upload")
    );
    console.log("✅ Found profile photo file input and made it visible.");

    console.log(`⌨️ Sending image path to file input: ${imagePath}`);
    await profileFileInput.sendKeys(imagePath);
    console.log("✅ Sent image path.");

    // Add a small wait for the file input's change event to potentially fire and preview to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("🔍 Looking for the 'Save Changes' button...");
    const saveButton = await waitForElement(
      driver,
      By.css(".profile-settings .save-button")
    );
    console.log("✅ Found the 'Save Changes' button.");

    console.log("🖱️ Clicking the 'Save Changes' button...");
    try {
      await saveButton.click();
      console.log("✅ Clicked the 'Save Changes' button.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for Save Changes button, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", saveButton);
      console.log("✅ Clicked the 'Save Changes' button (JavaScript click).");
    }
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for save to process

    // Optional: Add assertions here to verify the profile photo was updated successfully

    console.log("🎉 Change Profile Photo test completed successfully!");
  } catch (err) {
    console.error("❌ Change Profile Photo test failed:", err.message);
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
