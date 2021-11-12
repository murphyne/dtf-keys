import {
  isApproaching,
  isPartInbound,
  isFullInbound,
  getHiddenTop,
  getHiddenBottom,
  getVisible,
  getPartOfBounds,
  getPartOfView,
  isExpanded,
  isVisibleEnough,
  isCurrent,
} from './bounds.js';


/**
 * @param {string} url
 * @param {boolean} openInBackground
 * @see https://wiki.greasespot.net/GM.openInTab
 */
export function openInTab (url, openInBackground) {
  //window.open(url, '_blank');
  GM.openInTab(url, openInBackground);
}

export function dtfNavigationKeys () {
  'use strict';

  let view = DOMRect.fromRect();

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

  function selectElements () {
    let selectors = [
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

    return Array.from(document.querySelectorAll(selectors));
  }

  function filterElements (elements) {
    return elements.filter(function (element, i, arr) {
      let bounds = element.getBoundingClientRect();
      return isExpanded(bounds, view);
    });
  }

  function computeOffset (targetElement) {
    let targetElementTop = targetElement.getBoundingClientRect().top;
    let topMargin = 15;
    let targetOffset = targetElementTop - view.top - topMargin;

    //Reveal both .feed_header and .new_entries
    if (targetElement.isSameNode(document.querySelector(selectorFeedItem))) {
      let feedHeader = document.querySelector('.feed_header');
      if (feedHeader) {
        let feedHeaderHeight = feedHeader.getBoundingClientRect().height;
        targetOffset = targetOffset - feedHeaderHeight;
      }

      let newEntries = document.querySelector('.new_entries');
      if (newEntries) {
        let newEntriesHeight = newEntries.getBoundingClientRect().height;
        targetOffset = targetOffset - newEntriesHeight;
      }
    }

    return targetOffset;
  }

  function indexOfCurrent (elements) {
    for (var i = 0; i < elements.length; i++) {
      let element = elements[i];
      let bounds = element.getBoundingClientRect();
      if (isCurrent(bounds, view)) {
        return i;
      }
    }
  }

  //https://bureau.ru/soviet/20190815/
  document.addEventListener('keydown', function (event) {
    //console.log("%O %O", event.target === document.body, event);
    if (event.target !== document.body) return;

    let key = event.key.toLowerCase();
    let keyHeld = event.repeat;
    let alt = event.altKey;
    let ctrl = event.ctrlKey;
    let meta = event.metaKey;
    let shift = event.shiftKey;
    let modifier = alt || ctrl || meta || shift;

    if (['a','d','x'].includes(key) && !modifier && !keyHeld) {
      if (document.querySelectorAll(selectorFeedItem).length === 0) return;

      let siteHeader = document.getElementsByClassName('site-header')[0];
      view.y = siteHeader.clientHeight;
      view.height = document.documentElement.clientHeight - view.y;

      let elements = filterElements(selectElements());
      let i = indexOfCurrent(elements);

      let targetElement = {
        x: elements[i],
        a: elements[i - 1] || elements[i],
        d: elements[i + 1] || elements[i],
      }[key];

      let targetOffset = computeOffset(targetElement);

      window.scrollBy({ left: 0, top: targetOffset, behavior: 'smooth' });
    }
    else if (['e'].includes(key) && !modifier) {
      if (document.querySelectorAll(selectorFeedItem).length === 0) return;

      let siteHeader = document.getElementsByClassName('site-header')[0];
      view.y = siteHeader.clientHeight;
      view.height = document.documentElement.clientHeight - view.y;

      let elements = filterElements(selectElements());
      let i = indexOfCurrent(elements);

      let targetElement = elements[i];

      let url = targetElement.querySelector('a.content-feed__link').href;

      openInTab(url, true);
    }
    else if (['z','c'].includes(key) && !modifier) {
      //console.log(event);

      let dir = (key === 'c') ? 1 : -1;
      if (keyHeld) {
        window.scrollBy({ left: 0, top: dir * 70, behavior: 'auto' });
      }
      else {
        window.scrollBy({ left: 0, top: dir * 200, behavior: 'smooth' });
      }
    }
  });
}
