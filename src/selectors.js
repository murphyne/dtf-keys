export {
  selectorNewsWidget,
  selectorSubsiteHeader,
  selectorServicesHeader,
  selectorVacanciesWidget,
  selectorWidgetWrapper,
  selectorFeedItem,
  selectorComposite,
  selectElements,
};

const selectorNewsWidget = '.news-widget,.news-widget-skeleton'; // Блок новостей за день
const selectorSubsiteHeader = '.subsite-header'; // Блок «Шапка подсайта»
const selectorServicesHeader = '.services-header'; // Блок «Шапка поиска»
const selectorVacanciesWidget = '.vacancies_widget'; // Блок «Вакансии»
const selectorWidgetWrapper = '.widget_wrapper'; // Блок «Лучшие комментарии»
const selectorFeedItem = '.content-feed'; // Посты

const selectorComposite = [
  selectorNewsWidget,
  selectorSubsiteHeader,
  selectorServicesHeader,
  selectorVacanciesWidget,
  selectorWidgetWrapper,
  selectorFeedItem,
].join(',');

function selectElements (selector) {
  return Array.from(document.querySelectorAll(selector));
}
