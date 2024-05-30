export {
  selectorFeedHeader,
  selectorNewEntries,
  selectorSiteHeader,
  selectorContentLink,
  selectorTextInput,
  selectorNewsWidget,
  selectorSubsiteHeader,
  selectorServicesHeader,
  selectorFeedItem,
  selectorComposite,
  selectElements,
};

const selectorFeedHeader = '.feed_header';
const selectorNewEntries = '.new_entries';
const selectorSiteHeader = '.header';
const selectorContentLink = '.content:not(.content--embed) > * > a.content__link';
const selectorTextInput = '.text-input';

const selectorNewsWidget = '.news-widget,.news-widget-skeleton'; // Блок новостей за день
const selectorSubsiteHeader = '.subsite-header'; // Блок «Шапка подсайта»
const selectorServicesHeader = '.discovery__header'; // Блок «Шапка поиска»
const selectorFeedItem = '.content-list > .content:not(.content--embed)'; // Закрытые посты
const selectorArticle = '.entry > .content'; // Открытый пост
const selectorComments = '.comments'; // Комментарии под открытым постом

const selectorComposite = [
  selectorNewsWidget,
  selectorSubsiteHeader,
  selectorServicesHeader,
  selectorFeedItem,
  selectorArticle,
  selectorComments,
].join(',');

/**
 * @param {string} selector
 * @returns {Element[]}
 */
function selectElements (selector) {
  return Array.from(document.querySelectorAll(selector));
}
