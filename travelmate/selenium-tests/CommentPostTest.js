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

(async function commentPostTest() {
  let driver;

  try {
    console.log("🚀 Starting Comment Post test...");

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

    //Window size
    await driver.manage().window().setRect({ width: 1280, height: 800 });
    console.log("✅ Window size set to 1280x800");

    //Wait time
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

    //Redirect to feed page
    await driver.wait(until.urlContains("/feed"), 10000);
    console.log("✅ Successfully redirected to feed page");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Find post
    console.log("🔍 Looking for the second trip post...");
    const secondTripPost = await waitForElement(
      driver,
      By.css(".trip-feed .wide-trip-card:nth-child(2)")
    );
    console.log("✅ Found the second trip post.");

    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      secondTripPost
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find the comment button
    console.log("🔍 Looking for the comment button in the second post...");
    const commentButton = await waitForElement(
      driver,
      By.css(".wide-trip-card:nth-child(2) .action-buttons button:nth-child(2)")
    );
    console.log("✅ Found the comment button.");

    // Click the comment button to open comments
    console.log("🖱️ Clicking the comment button...");
    try {
      await commentButton.click();
      console.log("✅ Clicked the comment button.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for comment button, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", commentButton);
      console.log("✅ Clicked the comment button (JavaScript click).");
    }
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find the comment input field using specific class names
    console.log("🔍 Looking for the comment input field...");
    const commentInput = await waitForElement(
      driver,
      By.css(
        ".wide-trip-card:nth-child(2) .comment-input-wrapper input[type='text']"
      )
    );
    console.log("✅ Found the comment input field.");

    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'start' });",
      commentInput
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Type a comment
    const testComment = "This is a test comment from Selenium.";
    console.log(`⌨️ Typing comment: ${testComment}`);
    await commentInput.sendKeys(testComment);
    console.log("✅ Typed comment.");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find the post comment button using specific class names
    console.log("🔍 Looking for the post comment button...");
    const postCommentButton = await waitForElement(
      driver,
      By.css(
        ".wide-trip-card:nth-child(2) .comment-input-wrapper .comment-send-btn"
      )
    );
    console.log("✅ Found the post comment button.");

    // Click the post comment button
    console.log("🖱️ Clicking the post comment button...");
    try {
      await postCommentButton.click();
      console.log("✅ Clicked the post comment button.");
    } catch (clickErr) {
      console.log(
        `⚠️ Standard click failed for post comment button, trying JavaScript click`,
        clickErr.message
      );
      await driver.executeScript("arguments[0].click();", postCommentButton);
      console.log("✅ Clicked the post comment button (JavaScript click).");
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("🎉 Comment Post test completed successfully!");
  } catch (err) {
    console.error("❌ Comment Post test failed:", err.message);
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
