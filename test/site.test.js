import chai from 'chai';
import https from 'https';
import webdriver from 'selenium-webdriver';

import {
  selectorNewsWidget,
  selectorFeedItem,
  selectElements,
} from '../src/selectors.js';


describe('site', function () {
  /**
   * @type {webdriver.WebDriver}
   */
  let driver;

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

  function testPageStatus (page) {
    return function (done) {
      https.get(page, function (res) {
        chai.assert.equal(res.statusCode, 200);
        chai.assert.notEqual(res.statusCode, 404);
        done();
      });
    };
  }

  it(`page 'dtf.ru/' loads`, testPageStatus('https://dtf.ru/'));
  it(`page 'dtf.ru/games' loads`, testPageStatus('https://dtf.ru/games'));

  function testPageSelectors (selector, assert) {
    return async function () {
      //Find elements on the page
      let selectedElements = await driver.executeScript(selectElements, selector);

      //Check found elements
      assert(selectedElements);
    }
  }

  async function loadPages (driver, count) {
    for (let i = 0; i < count; i++) {
      //Trigger chunk loading
      const heightBefore = await driver.executeScript(() => document.body.scrollHeight);
      await driver.executeScript(() => window.scrollTo(0, document.body.scrollHeight));

      //Wait for chunk to load
      await driver.wait(async function () {
        return heightBefore !== await driver.executeScript(() => document.body.scrollHeight);
      }, 2000);
    }

    await driver.executeScript(() => window.scrollTo(0, 0));
  }

  describe('selectors', function () {
    before(async function () {
      //Set timeout for current setUp mocha hook
      this.timeout(10000);

      //Load the website
      await driver.get('https://dtf.ru');

      await loadPages(driver, 2);
    });

    it(`selector '${selectorFeedItem}' gets correct number of elements`,
      testPageSelectors(selectorFeedItem,
        (elements) => chai.expect(elements).to.have.length.above(3)));

    it(`selector '${selectorNewsWidget}' gets correct number of elements`,
      testPageSelectors(selectorNewsWidget,
        (elements) => chai.expect(elements).to.have.lengthOf(1)));
  });
});
