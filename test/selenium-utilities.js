import webdriver from 'selenium-webdriver';

export {
  retrieveScrollCount,
  untilScrollCountIs,
};

function getScrollTop () { return document.scrollingElement.scrollTop; }
function getScrollCount () { return Number(window.scrollCount); }
function getIsScrolling () { return Boolean(window.isScrolling); }
function getIsNotScrolling () { return Boolean(!window.isScrolling); }

/**
 * @param {webdriver.WebDriver} driver
 * @returns {Promise<number>}
 */
function retrieveScrollTop (driver) {
  return driver.executeScript(getScrollTop);
}
/**
 * @param {webdriver.WebDriver} driver
 * @returns {Promise<number>}
 */
function retrieveScrollCount (driver) {
  return driver.executeScript(getScrollCount);
}
/**
 * @param {webdriver.WebDriver} driver
 * @returns {Promise<boolean>}
 */
function retrieveIsScrolling (driver) {
  return driver.executeScript(getIsScrolling);
}
/**
 * @param {webdriver.WebDriver} driver
 * @returns {Promise<boolean>}
 */
function retrieveIsNotScrolling (driver) {
  return driver.executeScript(getIsNotScrolling);
}

/**
 * Creates a condition that will wait for the scroll count
 * to match the expected value.
 * @param {number} expected The expected scroll count value.
 */
function untilScrollCountIs (expected) {
  return new webdriver.Condition(
  `for scroll count to be ${expected}`,
  function (driver) {
    return retrieveScrollCount(driver).then(function (actual) {
      // console.log(`untilScrollCountIs: ${actual} === ${expected}`);
      return actual === expected;
    });
  });
}

/**
 * A condition that will wait for the scrolling to start
 */
let untilIsScrolling = new webdriver.Condition(
  'until scrolling starts',
  function (driver) {
    return retrieveIsScrolling(driver).then(function (result) {
      // console.log(`untilIsScrolling: ${result}`);
      return result;
    });
  });

/**
 * A condition that will wait for the scrolling to stop
 */
let untilIsNotScrolling = new webdriver.Condition(
  'until scrolling stops',
  function (driver) {
    return retrieveIsNotScrolling(driver).then(function (result) {
      // console.log(`untilIsNotScrolling: ${result}`);
      return result;
    });
  });
