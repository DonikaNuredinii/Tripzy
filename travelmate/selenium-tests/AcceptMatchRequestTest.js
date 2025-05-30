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

// Function to fill Log in Feild
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
// Accept Match Request Test
(async function acceptMatchRequestTest() {
  let driver;

  try {
    console.log("🚀 Starting Accept Match Request test...");
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

    // Fill in login form
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

    // Submit login form
    console.log("🖱️ Clicking login submit button...");
    const loginSubmitBtn = await waitForElement(
      driver,
      By.css(".form-box.login-form button.authbutton")
    );
    await loginSubmitBtn.click();
    console.log("✅ Submitted login form");

    // Wait for redirect to feed page and match requests to load
    await driver.wait(until.urlContains("/feed"), 10000);
    console.log("✅ Successfully redirected to feed page.");

    // Find the last trip post to send a match request
    console.log("🔍 Looking for the last trip post...");
    const lastTripPost = await waitForElement(
      driver,
      By.css(".trip-feed .wide-trip-card:last-child")
    );
    console.log("✅ Found the last trip post.");

    // Scroll to the last trip post if needed
    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      lastTripPost
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find the Match button within the last post
    console.log("🔍 Looking for the Match button in the last post...");
    const matchButton = await waitForElement(
      driver,
      By.css(".wide-trip-card:last-child .action-buttons .match-btn")
    );
    console.log("✅ Found the Match button.");

    // Click the Match button on the last post
    console.log("🖱️ Clicking the Match button...");
    try {
      await matchButton.click();
      console.log("✅ Clicked the Match button.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for Match button, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", matchButton);
      console.log("✅ Clicked the Match button (JavaScript click).");
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("🔍 Checking for alert after clicking Match button...");
    try {
      // Wait for the alert to be present
      await driver.wait(until.alertIsPresent(), 5000);
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
      console.log(`✅ Alert appeared with text: "${alertText}"`);

      await alert.accept();
      console.log("✅ Accepted the alert.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (alertErr) {
      console.log(
        "ℹ️ No alert appeared after clicking Match button, continuing."
      );
    }

    console.log("⬆️ Scrolling back to the top of the page...");
    await driver.executeScript(
      "window.scrollTo({ top: 0, behavior: 'smooth' });"
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    //Find Bell Icon
    console.log(
      "✨ Attempting to find and click the Bell icon to open match requests..."
    );
    console.log("🔍 Looking for the Bell icon...");
    const bellIcon = await waitForElement(
      driver,
      By.css(".navbar-feed .navbar-right svg.nav-icon")
    );
    console.log("✅ Found the Bell icon.");

    console.log("🖱️ Clicking the Bell icon...");
    try {
      await bellIcon.click();
      console.log("✅ Clicked the Bell icon.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for Bell icon, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", bellIcon);
      console.log("✅ Clicked the Bell icon (JavaScript click).");
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    //Find Match Requests Section
    console.log("🔍 Waiting for the match requests section to be visible...");
    const matchRequestsSection = await waitForElement(
      driver,
      By.css(".match-requests-wrapper")
    );
    console.log("✅ Match requests section is visible.");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log(
      "🔍 Looking for the first pending match request in the list..."
    );

    const pendingRequest = await waitForElement(
      driver,
      By.css(
        ".match-requests-wrapper .match-list li.match-request.pending:first-child"
      )
    );
    console.log("✅ Found a pending match request.");

    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      pendingRequest
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    //Find Accept Button
    console.log(
      "🔍 Looking for the Accept button within the pending request..."
    );

    const acceptButton = await waitForElement(
      driver,
      By.css(
        ".match-request.pending:first-child .match-actions button:first-child"
      )
    );
    console.log("✅ Found the Accept button.");

    console.log("🖱️ Clicking the Accept button...");
    try {
      await acceptButton.click();
      console.log("✅ Clicked the Accept button (standard click).");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for Accept button, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", acceptButton);
      console.log("✅ Clicked the Accept button (JavaScript click).");
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    //End of Test
    console.log(
      "✅ Match request likely accepted. Add assertions here to verify."
    );

    console.log("🎉 Accept Match Request test completed successfully!");
  } catch (err) {
    console.error("❌ Accept Match Request test failed:", err.message);
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
