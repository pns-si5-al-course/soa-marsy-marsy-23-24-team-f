import { test, expect } from '@playwright/test';
const { chromium } = require('playwright');


test.describe('DB should be empty before preparation', () => {
  test("is telemetrie-DB empty", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://localhost:3003/rocket/telemetrics');
    // get the text content of the body element
    const bodyText = await page.textContent('body');

    // Assert
    expect(bodyText).toContain(JSON.stringify({message:"No telemetrics found"}));

    await browser.close();

  });

  test("is payload-DB empty", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://localhost:3004/rocket/payload/data');
    // get the text content of the body element
    const bodyText = await page.textContent('body');

    // Assert
    expect(bodyText).toContain(JSON.stringify({message: "No payload telemetrics found"}));

    await browser.close();

  });
});