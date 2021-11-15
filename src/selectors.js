export {
  selectorNewsWidget,
  selectorVacanciesWidget,
  selectorWidgetWrapper,
  selectorFeedItem,
  selectorComposite,
  selectElements,
};

const selectorNewsWidget = '.news_widget'; // Блок новостей за день
const selectorVacanciesWidget = '.vacancies_widget'; // Блок «Вакансии»
const selectorWidgetWrapper = '.widget_wrapper'; // Блок «Лучшие комментарии»
const selectorFeedItem = '.content-feed'; // Посты

const selectorComposite = [
  selectorNewsWidget,
  selectorVacanciesWidget,
  selectorWidgetWrapper,
  selectorFeedItem,
].join(',');

function selectElements (selector) {
  return Array.from(document.querySelectorAll(selector));
}
