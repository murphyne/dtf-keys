import fs from 'fs';
import path from 'path';
import chai from 'chai';
import sinon from 'sinon';
import rollup from 'rollup';
import webdriver from 'selenium-webdriver';

import {
  selectorComposite,
  selectElements,
} from "../src/selectors.js";

import {
  injectScrollCount,
  retrieveScrollTop,
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
    await driver.get(`file://${path.resolve('./test/DTF-SingleFile.html')}`);
    //await driver.get('http://dtf.ru/');

    //Subscribe to `scroll` events
    await injectScrollCount(driver);

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

    //Print any new log entries
    await driver.manage().logs().get('browser')
      .then(entries => entries.map(function (entry) {
        console.log(entry.timestamp, entry.message);
      }));

    await driver.quit();
  });

  it('userscript executes without errors', async function () {
    //Set timeout for current mocha test
    this.timeout(1000);

    //Execute the userscript in the browser environment
    await driver.executeScript(code);
  });

  it('userscript finds correct number of elements', async function () {
    //Set timeout for current mocha test
    this.timeout(1000);

    //Find elements on the page
    let selectedElements = await driver.executeScript(selectElements, selectorComposite);

    //Check found elements
    chai.expect(selectedElements).to.have.lengthOf(15);
  });

  it('userscript handles `d` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `d` button
    //console.log('Press the `d` button');
    await driver.actions().keyDown('d').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(1), 1000);

    //Check scroll count and position
    chai.assert.equal(await retrieveScrollCount(driver), 1);
    chai.assert.equal(await retrieveScrollTop(driver), 455);

    //Press the `d` button
    //console.log('Press the `d` button');
    await driver.actions().keyDown('d').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(2), 1000);

    //Check scroll count and position
    chai.assert.equal(await retrieveScrollCount(driver), 2);
    chai.assert.equal(await retrieveScrollTop(driver), 1140);

    //Press the `d` button
    //console.log('Press the `d` button');
    await driver.actions().keyDown('d').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(3), 1000);

    //Check scroll count and position
    chai.assert.equal(await retrieveScrollCount(driver), 3);
    chai.assert.equal(await retrieveScrollTop(driver), 1939);

    //Press the `d` button
    //console.log('Press the `d` button');
    await driver.actions().keyDown('d').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(4), 1000);

    //Check scroll count and position
    chai.assert.equal(await retrieveScrollCount(driver), 4);
    chai.assert.equal(await retrieveScrollTop(driver), 2550);
  });

  it('userscript handles `e` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Inject sinon in the page
    const sinonPath = './node_modules/sinon/pkg/sinon.js';
    const sinonSrc = fs.readFileSync(sinonPath).toString();
    await driver.executeScript(sinonSrc);

    //Fake Tampermonkey API
    await driver.executeScript(function () {
      window.GM = {
        openInTab: sinon.fake(),
      };
    });

    //Press the `e` button
    //console.log('Press the `e` button');
    await driver.actions().keyDown('e').perform();

    //Check that required TM API function was called
    chai.assert.isTrue(
      await driver.executeScript(() => GM.openInTab.calledOnce),
      'userscript should call TM API function');

    //Check that required TM API function was called with expected arguments
    chai.assert.match(
      await driver.executeScript(() => GM.openInTab.getCall(0).args[0]),
      new RegExp('https://dtf.ru/[\\w_/]+/\\d+'),
      'userscript should call TM API function with expected arguments');
  });

  it('userscript stays in place if already at target', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `x` button
    //console.log('Press the `x` button');
    await driver.actions().keyDown('x').perform();

    try {
      //Wait for scroll to stop (should throw TimeoutError)
      await driver.wait(untilScrollCountIs(5), 1000);

      //Fail if there was no TimeoutError
      chai.assert.fail('`x` key should not trigger a scroll');
    }
    catch (err) {
      //Check that wait for scroll was unsuccessful
      chai.assert.instanceOf(err, webdriver.error.TimeoutError);
    }
    finally {
      //Check that scroll count and position haven't changed
      chai.assert.equal(await retrieveScrollCount(driver), 4,
        'keydown should not trigger a scroll');
      chai.assert.equal(await retrieveScrollTop(driver), 2550,
        'keydown should not change scroll position');
    }
  });

  it('userscript handles `a` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `a` button
    //console.log('Press the `a` button');
    await driver.actions().keyDown('a').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(5), 1000);

    //Check scroll count and position
    chai.assert.equal(await retrieveScrollCount(driver), 5);
    chai.assert.equal(await retrieveScrollTop(driver), 1939);
  });

  it('userscript handles `c` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `c` button
    //console.log('Press the `c` button');
    await driver.actions().keyDown('c').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(6), 1000);

    //Check scroll count and position
    chai.assert.equal(await retrieveScrollCount(driver), 6);
    chai.assert.equal(await retrieveScrollTop(driver), 1939 + 200);
  });

  it('userscript handles `x` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `x` button
    //console.log('Press the `x` button');
    await driver.actions().keyDown('x').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(7), 1000);

    //Check scroll count and position
    chai.assert.equal(await retrieveScrollCount(driver), 7);
    chai.assert.equal(await retrieveScrollTop(driver), 1939);
  });

  it('userscript handles `z` keydown', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Press the `z` button
    //console.log('Press the `z` button');
    await driver.actions().keyDown('z').perform();

    //Wait for scroll to stop
    await driver.wait(untilScrollCountIs(8), 1000);

    //Check scroll count and position
    chai.assert.equal(await retrieveScrollCount(driver), 8);
    chai.assert.equal(await retrieveScrollTop(driver), 1939 - 200);
  });

  it('userscript ignores keydown if input is focused', async function () {
    //Set timeout for current mocha test
    this.timeout(5000);

    //Check scroll count and position
    chai.assert.equal(await retrieveScrollCount(driver), 8);
    chai.assert.equal(await retrieveScrollTop(driver), 1939 - 200);

    //Find the search input
    const locator = webdriver.By.className('v-text-input__input');
    const element = driver.findElement(locator);

    //Press the `d` button
    //console.log('Press the `d` button');
    await element.sendKeys('d');

    try {
      //Wait for scroll to stop (should throw TimeoutError)
      await driver.wait(untilScrollCountIs(9), 1000);

      //Fail if there was no TimeoutError
      chai.assert.fail('`d` key should not trigger a scroll');
    }
    catch (err) {
      //Check that wait for scroll was unsuccessful
      chai.assert.instanceOf(err, webdriver.error.TimeoutError);
    }
    finally {
      //Check that scroll count and position haven't changed
      chai.assert.equal(await retrieveScrollCount(driver), 8,
        'keydown in input should not trigger a scroll');
      chai.assert.equal(await retrieveScrollTop(driver), 1939 - 200,
        'keydown in input should not change scroll position');

      //Check that input received its value
      chai.assert.equal(await element.getAttribute('value'), 'd',
        'userscript should not intercept keydown in input');

      await driver.executeScript(() => document.activeElement.blur());
    }
  });
});
