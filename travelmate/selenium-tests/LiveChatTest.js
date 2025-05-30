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

// Live Chat Test
(async function liveChatTest() {
  let driver1, driver2;

  const USER1_EMAIL = "rrona2004@gmail.com";
  const USER1_PASSWORD = "Rrona12?";

  const USER2_EMAIL = "grace@gmail.com";
  const USER2_PASSWORD = "Grace12?";

  if (
    USER1_EMAIL === "your_user1_email@example.com" ||
    USER2_EMAIL === "your_user2_email@example.com"
  ) {
    console.error(
      "❌ Please update USER1_EMAIL, USER1_PASSWORD, USER2_EMAIL, and USER2_PASSWORD with actual credentials."
    );
    return;
  }

  try {
    console.log("🚀 Starting Live Chat test...");

    // --- Set up Driver 1 (Standard Chrome) ---
    console.log("⚙️ Initializing Driver 1 (Standard Chrome)...");
    const options1 = new chrome.Options();
    options1.addArguments("--start-maximized");
    options1.addArguments("--disable-notifications");
    options1.addArguments("--disable-popup-blocking");
    options1.addArguments("--disable-dev-shm-usage");
    options1.addArguments("--no-sandbox");
    options1.addArguments("--disable-gpu");

    driver1 = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options1)
      .build();
    console.log("✅ Driver 1 launched");

    await driver1
      .manage()
      .window()
      .setRect({ x: 0, y: 0, width: 900, height: 1000 });
    await driver1.manage().setTimeouts({ implicit: 10000 });

    // --- Set up Driver 2 (Incognito Chrome) ---
    console.log("⚙️ Initializing Driver 2 (Incognito Chrome)...");
    const options2 = new chrome.Options();
    options2.addArguments("--incognito");
    options2.addArguments("--start-maximized");
    options2.addArguments("--disable-notifications");
    options2.addArguments("--disable-popup-blocking");
    options2.addArguments("--disable-dev-shm-usage");
    options2.addArguments("--no-sandbox");
    options2.addArguments("--disable-gpu");

    driver2 = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options2)
      .build();
    console.log("✅ Driver 2 launched (Incognito)");

    await driver2
      .manage()
      .window()
      .setRect({ x: 900, y: 0, width: 900, height: 1000 });
    await driver2.manage().setTimeouts({ implicit: 10000 });

    // --- Log in User 1 ---
    console.log("🌐 Navigating Driver 1 to http://localhost:3000...");
    await driver1.get("http://localhost:3000");
    console.log("✅ Driver 1 Page loaded");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await waitForElement(driver1, By.css(".navbar .login-btn")).then((btn) =>
      btn.click()
    );
    await waitForElement(driver1, By.id("login-section"));
    await fillInput(
      driver1,
      By.css(".form-box.login-form input[name='Email']"),
      USER1_EMAIL
    );
    await fillInput(
      driver1,
      By.css(".form-box.login-form input[name='Password']"),
      USER1_PASSWORD
    );
    await waitForElement(
      driver1,
      By.css(".form-box.login-form button.authbutton")
    ).then((btn) => btn.click());
    await driver1.wait(until.urlContains("/feed"), 10000);
    console.log(`✅ User 1 (${USER1_EMAIL}) logged in.`);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // --- Log in User 2 ---
    console.log("🌐 Navigating Driver 2 to http://localhost:3000...");
    await driver2.get("http://localhost:3000");
    console.log("✅ Driver 2 Page loaded");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await waitForElement(driver2, By.css(".navbar .login-btn")).then((btn) =>
      btn.click()
    );
    await waitForElement(driver2, By.id("login-section"));
    await fillInput(
      driver2,
      By.css(".form-box.login-form input[name='Email']"),
      USER2_EMAIL
    );
    await fillInput(
      driver2,
      By.css(".form-box.login-form input[name='Password']"),
      USER2_PASSWORD
    );
    await waitForElement(
      driver2,
      By.css(".form-box.login-form button.authbutton")
    ).then((btn) => btn.click());
    await driver2.wait(until.urlContains("/feed"), 10000);
    console.log(`✅ User 2 (${USER2_EMAIL}) logged in.`);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // --- Navigate to Messages Page ---
    console.log("🌐 Navigating both users to Messages page...");

    // User 1 opens messages
    const messagesLink1 = await waitForElement(
      driver1,
      By.css('.navbar-feed .navbar-center .nav-link[href="/messages"]')
    );
    await messagesLink1.click();
    await driver1.wait(until.urlContains("/messages"), 10000);
    console.log("✅ User 1 navigated to Messages page.");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // User 2 opens messages
    const messagesLink2 = await waitForElement(
      driver2,
      By.css('.navbar-feed .navbar-center .nav-link[href="/messages"]')
    );
    await messagesLink2.click();
    await driver2.wait(until.urlContains("/messages"), 10000);
    console.log("✅ User 2 navigated to Messages page.");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // --- Select Conversation for User 1 ---
    console.log(`🔍 User 1 selecting conversation with ${USER2_EMAIL}...`);
    const user2FullName = "g Grace";
    const user2Conversation = await waitForElement(
      driver1,
      By.xpath(
        `//div[contains(@class, 'conversation-item')]//strong[text()='${user2FullName}']`
      )
    );
    await user2Conversation.click();
    console.log(`✅ User 1 selected conversation with ${user2FullName}.`);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // --- User 1 Sends Message ---
    console.log("📝 User 1 typing message...");
    const messageInput1 = await waitForElement(
      driver1,
      By.css(".chat-input input[type='text']")
    );
    const messageText1 = "Live Chat Test";
    await messageInput1.sendKeys(messageText1);
    console.log(`✅ User 1 typed: "${messageText1}".`);

    const sendButton1 = await waitForElement(
      driver1,
      By.css(".chat-input button")
    );
    await sendButton1.click();
    console.log("✅ User 1 clicked Send.");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // --- Select Conversation for User 2 ---
    console.log(`🔍 User 2 selecting conversation with ${USER1_EMAIL}...`);
    const user1FullName = "Rrona Pajaziti";
    const user1Conversation = await waitForElement(
      driver2,
      By.xpath(
        `//div[contains(@class, 'conversation-item')]//strong[text()='${user1FullName}']`
      )
    );
    await user1Conversation.click();
    console.log(`✅ User 2 selected conversation with ${user1FullName}.`);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Verify the message appears in User 2's chat
    console.log("🔍 Verifying message appears in User 2's chat...");
    try {
      // Wait for the message container to be present
      await waitForElement(driver2, By.css(".chat-messages"), 15000);

      // Try multiple selectors to find the message
      const messageSelectors = [
        `//div[contains(@class, 'message')]//p[contains(text(), '${messageText1}')]`,
        `//div[contains(@class, 'message-content')]//p[contains(text(), '${messageText1}')]`,
        `//div[contains(@class, 'message')][contains(text(), '${messageText1}')]`,
      ];

      let messageFound = false;
      for (const selector of messageSelectors) {
        try {
          const messageElement = await driver2.wait(
            until.elementLocated(By.xpath(selector)),
            5000
          );
          if (messageElement) {
            messageFound = true;
            console.log("✅ Message successfully received by User 2");
            break;
          }
        } catch (err) {
          continue;
        }
      }

      if (!messageFound) {
        throw new Error("Message not found with any selector");
      }
    } catch (err) {
      console.error("❌ Failed to verify message:", err.message);
      throw err;
    }

    console.log("🎉 Live Chat test completed successfully!");
  } catch (err) {
    console.error("❌ Live Chat test failed:", err.message);
  } finally {
    if (driver1) {
      try {
        await driver1.quit();
        console.log("🛑 Driver 1 closed");
      } catch (quitErr) {
        console.error("Error closing Driver 1:", quitErr.message);
      }
    }
    if (driver2) {
      try {
        await driver2.quit();
        console.log("🛑 Driver 2 closed");
      } catch (quitErr) {
        console.error("Error closing Driver 2:", quitErr.message);
      }
    }
    console.log("🛑 Test completed.");
  }
})();
