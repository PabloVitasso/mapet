"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
const usePuppeteer = () => {
    let browser = null;
    let context = null;
    const init = async (options) => {
        const params = Object.assign({ headless: 'shell', ignoreDefaultArgs: ['--enable-automation'], args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito'] }, options);
        browser = await puppeteer_extra_1.default.launch(params);
        context = browser;
        return browser;
    };
    const delay = (ms = 3000) => new Promise(resolve => setTimeout(resolve, ms));
    const goTo = async (url) => {
        // Log opening URL
        console.log(`[PUPPETEER] goTo: ${url}`);
        if (!context) {
            throw new Error("Browser context not initialized. Call init() first.");
        }
        const page = await context.newPage();
        // Log HTTP responses (status + url)
        page.on('response', (response) => {
            console.log(`[PUPPETEER][HTTP] ${response.status()} ${response.url()}`);
        });
        // Log konsoli strony
        page.on('console', (msg) => {
            console.log(`[PUPPETEER][CONSOLE] ${msg.type()}: ${msg.text()}`);
        });
        await page.goto(url);
        await page.setViewport({ width: 1360, height: 980, deviceScaleFactor: 1 });
        await delay();
        return page;
    };
    const close = async () => {
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
};
exports.default = usePuppeteer();
