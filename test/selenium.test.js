import path from 'path';
import chai from 'chai';
import sinon from 'sinon';
import rollup from 'rollup';
import webdriver from 'selenium-webdriver';

import {
  retrieveScrollCount,
  untilScrollCountIs,
} from './selenium-utilities.js';


describe('selenium', function () {
  /**
   * @type {webdriver.WebDriver}
   */
  let driver;

  /**
   * @type {string}
   */
  let code;

  before(async function () {
    //Set timeout for current setUp mocha hook
    this.timeout(30000);

    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions({
        excludeSwitches: ['enable-logging'],
      })
      .setFirefoxOptions(/* ... */)
      .build();

    //Load the website
    await driver.get(path.resolve('./test/DTF-SingleFile.html'));
    //await driver.get('http://dtf.ru/');

    //Subscribe to `scroll` events
    //https://vanillajstoolkit.com/helpers/scrollstop/
    await driver.executeScript(function () {
      let timeout;
      window.scrollCount = 0;
      window.document.addEventListener('scroll', function (event) {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(function () {
          window.scrollCount += 1;
        }, 60);
      });
    });

    //Generate the code
    let bundle = await rollup.rollup({ input: './src/main.js' });
    let output = await bundle.generate({ format: 'esm' });
    code = output.output[0].code;
  });

  after(async function () {
    //Set timeout for current tearDown mocha hook
    this.timeout(5000);

    //Take a pause before exiting
    await driver.sleep(3000);

    await driver.quit();
  });

  it('userscript executes without errors', async function () {
    //Set timeout for current mocha test
    this.timeout(1000);

    //Execute the userscript in the browser environment
    await driver.executeScript(code);
  });

  it('userscript handles `d` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `d` button
    //console.log('Press the `d` button');
    await driver.actions().keyDown('d').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(1), 1000);

    //Press the `d` button
    //console.log('Press the `d` button');
    await driver.actions().keyDown('d').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(2), 1000);

    //Check scroll count
    chai.assert.equal(await retrieveScrollCount(driver), 2);
  });

  it('userscript handles `x` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `x` button
    //console.log('Press the `x` button');
    await driver.actions().keyDown('x').perform();

    //Check that scroll count haven't changed
    try {
      await driver.wait(untilScrollCountIs(3), 1000);
      chai.assert.fail('`x` key should not trigger a scroll');
    }
    catch (err) {
      chai.assert.instanceOf(err, webdriver.error.TimeoutError);
    }
  });

  it('userscript handles `a` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `a` button
    //console.log('Press the `a` button');
    await driver.actions().keyDown('a').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(3), 1000);

    //Check scroll count
    chai.assert.equal(await retrieveScrollCount(driver), 3);
  });

  it('userscript handles `c` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `c` button
    //console.log('Press the `c` button');
    await driver.actions().keyDown('c').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(4), 1000);

    //Check scroll count
    chai.assert.equal(await retrieveScrollCount(driver), 4);
  });

  it('userscript handles `x` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `x` button
    //console.log('Press the `x` button');
    await driver.actions().keyDown('x').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(5), 1000);

    //Check scroll count
    chai.assert.equal(await retrieveScrollCount(driver), 5);
  });

  it('userscript handles `z` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `z` button
    //console.log('Press the `z` button');
    await driver.actions().keyDown('z').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(6), 1000);

    //Check scroll count
    chai.assert.equal(await retrieveScrollCount(driver), 6);
  });
});
