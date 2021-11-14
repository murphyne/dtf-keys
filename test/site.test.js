import chai from 'chai';
import https from 'https';
import webdriver from 'selenium-webdriver';

import {
  selectorNewsWidget,
  selectorVacanciesWidget,
  selectorWidgetWrapper,
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

  function testPageSelectors (page, selector, assert) {
    return async function () {
      //Set timeout for current mocha test
      this.timeout(10000);

      //Load the website
      await driver.get(page);

      //Find elements on the page
      let selectedElements = await driver.executeScript(selectElements, selector);

      //Check found elements
      assert(selectedElements);
    }
  }

  it(`selector '${selectorFeedItem}' gets correct number of elements`,
    testPageSelectors('https://dtf.ru', selectorFeedItem,
      (elements) => chai.expect(elements).to.have.length.above(3)));

  it(`selector '${selectorNewsWidget}' gets correct number of elements`,
    testPageSelectors('https://dtf.ru', selectorNewsWidget,
      (elements) => chai.expect(elements).to.have.lengthOf(1)));

  it(`selector '${selectorVacanciesWidget}' gets correct number of elements`,
    testPageSelectors('https://dtf.ru', selectorVacanciesWidget,
      (elements) => chai.expect(elements).to.have.lengthOf(1)));

  it(`selector '${selectorWidgetWrapper}' gets correct number of elements`,
    async function () {
      //Set timeout for current mocha test
      this.timeout(10000);

      //Load the website
      await driver.get('https://dtf.ru');

      let selectedElements;

      //Trigger chunk loading
      await driver.executeScript(() =>
        document.querySelector(".feed__horizon").scrollIntoView());

      //Wait for chunk to load
      let locator = webdriver.By.css('.feed__chunk:nth-of-type(2)');
      await driver.wait(webdriver.until.elementLocated(locator));

      //Find elements on the page
      selectedElements = await driver.executeScript(selectElements, selectorWidgetWrapper);

      //Check found elements
      chai.expect(selectedElements).to.have.lengthOf(1);
    });

});
