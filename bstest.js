const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:8080/login');
        await page.type('#loginInput', 'Алиса Тулегенова');
        await page.click('#loginButton');
        console.log('Зашли на страницу');

        await page.goto('http://localhost:8080/dashboard');
        console.log('Перешли на страницу Dashboard');
        await page.waitForSelector('#hello', { visible: true });
        await page.waitForSelector('#AAPL');
        console.log('Нашли элемент #AAPL');
        await page.click('#AAPL');
        await page.waitForSelector('#balanceElement', { visible: true });

        const balanceText = await page.$eval('#balanceElement', (element) => element.textContent);
        console.log('Баланс после покупки:', balanceText);

    } catch (error) {
        console.error('Ошибка во время выполнения теста:', error);
    } finally {
        await browser.close();
    }
})();
