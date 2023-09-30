import { test, expect } from '@playwright/test';
const { chromium } = require('playwright');


test.describe('Are all services UP', () => {
  test('is telemetrie-service UP', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Accédez à l'URL de votre API
    await page.goto('http://localhost:3003/isAlive');
    // get the text content of the body element
    const bodyText = await page.textContent('body');

    // Assert
    expect(bodyText).toContain(JSON.stringify({ status:"ok"}));

    await browser.close();
  });


  test('is rocket-service UP', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Accédez à l'URL de votre API
    await page.goto('http://localhost:3001/');
    // get the text content of the body element
    const bodyText = await page.textContent('body');

    // Assert
    expect(bodyText).toContain(JSON.stringify({ status:"ok"}));

    await browser.close();
  });


  test('is weather-service UP', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Accédez à l'URL de votre API
    await page.goto('http://localhost:3002/weather');
    // get the text content of the body element
    const bodyText = await page.textContent('body');

    // Assert
    expect(bodyText).toContain(JSON.stringify({ status:"ok"}));

    await browser.close();
  });

  test('is rocket-object-service UP', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Accédez à l'URL de votre API
    await page.goto('http://localhost:3005/');
    // get the text content of the body element
    const bodyText = await page.textContent('body');

    // Assert
    expect(bodyText).toContain(JSON.stringify({ status:"ok"}));

    await browser.close();
  });

  test('is payload-service UP', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Accédez à l'URL de votre API
    await page.goto('http://localhost:3004/payload');
    // get the text content of the body element
    const bodyText = await page.textContent('body');

    // Assert
    expect(bodyText).toContain(JSON.stringify({ status:"ok"}));

    await browser.close();
  });
});