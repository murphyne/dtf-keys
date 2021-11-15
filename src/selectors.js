export {
  selectorNewsWidget,
  selectorVacanciesWidget,
  selectorWidgetWrapper,
  selectorFeedItem,
  selectorComposite,
  selectElements,
};

const selectorNewsWidget = '.news_widget';
const selectorVacanciesWidget = '.vacancies_widget';
const selectorWidgetWrapper = '.widget_wrapper';
const selectorFeedItem = '.content-feed';

const selectorComposite = [
  selectorNewsWidget,
  selectorVacanciesWidget,
  selectorWidgetWrapper,
  selectorFeedItem,
].join(',');

function selectElements (selector) {
  return Array.from(document.querySelectorAll(selector));
}
