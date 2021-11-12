export {
  selectorVacancyHeader,
  selectorCustomSubsite_html,
  selectorSubsiteCover,
  selectorSubsiteHead,
  selectorNewsWidget,
  selectorTeaserPodcast,
  selectorDailyPromoUnit,
  selectorBlogsEntries,
  selectorVacanciesWidget,
  selectorWidgetWrapper,
  selectorFeedItem,
  selectorComposite,
  selectElements,
};

const selectorVacancyHeader = '.vacancy_header';
const selectorCustomSubsite_html = '.custom_subsite_html:first-of-type';
const selectorSubsiteCover = '.subsite__cover:first-of-type';
const selectorSubsiteHead = '.subsite_head:first-of-type';
const selectorNewsWidget = '.news_widget';
const selectorTeaserPodcast = '.teaserPodcast';
const selectorDailyPromoUnit = '.daily-promo-unit';
const selectorBlogsEntries = '.island.island--expanded.island--blogs_entries';
const selectorVacanciesWidget = '.vacancies_widget';
const selectorWidgetWrapper = '.widget_wrapper';
const selectorFeedItem = '.feed__item';

const selectorComposite = [
  selectorVacancyHeader,
  selectorCustomSubsite_html,
  selectorSubsiteCover,
  selectorSubsiteHead,
  selectorNewsWidget,
  selectorTeaserPodcast,
  selectorDailyPromoUnit,
  selectorBlogsEntries,
  selectorVacanciesWidget,
  selectorWidgetWrapper,
  selectorFeedItem,
].join(',');

function selectElements (selector) {
  return Array.from(document.querySelectorAll(selector));
}
