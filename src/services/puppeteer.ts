import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const usePuppeteer = () => {
  let browser: any = null;
  let context: any = null;

  const init = async (options: {
    headless?: boolean | 'shell' | undefined;
  }): Promise<any> => {
    const params: {
      headless?: boolean | 'shell' | undefined
      ignoreDefaultArgs?: string[]
      args?: string[]
    } = {
      headless: 'shell',
      ignoreDefaultArgs: ['--enable-automation'],
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito'],
      ...options,
    }

    browser = await puppeteer.launch(params);
    context = browser;
    return browser;
  };

  const delay = (ms = 3000) => new Promise(resolve => setTimeout(resolve, ms))

  const goTo = async (url: string): Promise<any> => {
    // Log opening URL
    console.log(`[PUPPETEER] goTo: ${url}`);
    if (!context) {
      throw new Error("Browser context not initialized. Call init() first.");
    }
    const page = await context.newPage();
    // Log HTTP responses (status + url)
    page.on('response', (response: any) => {
      console.log(`[PUPPETEER][HTTP] ${response.status()} ${response.url()}`);
    });
    // Log konsoli strony
    page.on('console', (msg: any) => {
      console.log(`[PUPPETEER][CONSOLE] ${msg.type()}: ${msg.text()}`);
    });
    await page.goto(url);
    await page.setViewport({ width: 1360, height: 980, deviceScaleFactor: 1 });
    await delay()
    return page;
  };

  const close = async (): Promise<void> => {
    if (context) {
      await context.close();
      context = null;
    }
    if (browser) {
      await browser.close();
      browser = null;
    }
  };

  return { browser, init, goTo, close };
}

export default usePuppeteer()