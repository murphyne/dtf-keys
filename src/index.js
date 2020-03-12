import {
  isApproaching,
  isPartInbound,
  isFullInbound,
  getHiddenTop,
  getHiddenBottom,
  getVisible,
  getPartOfBounds,
  getPartOfView,
  isVisibleEnough,
} from './bounds.js';


export function dtfNavigationKeys () {
  'use strict';

  let _viewTop;
  let _viewBottom;

  function selectElements () {
    let selectors = [
      '.vacancy_header',
      '.custom_subsite_html:first-of-type',
      '.subsite__cover:first-of-type',
      '.subsite_head:first-of-type',
      '.news_widget',
      '.teaserPodcast',
      '.vacancies_widget',
      '.widget_wrapper',
      '.feed__item',
    ].join(',');

    return Array.from(document.querySelectorAll(selectors));
  }

  function computeOffset (targetElement) {
    let targetElementTop = targetElement.getBoundingClientRect().top;
    let topMargin = 15;
    let targetOffset = targetElementTop - _viewTop - topMargin;

    //Reveal both .feed_header and .new_entries
    if (targetElement.isSameNode(document.querySelector('.feed__item'))) {
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
      let isCurrentElement =
        isApproaching(bounds, _viewTop, _viewBottom) &&
        isPartInbound(bounds, _viewTop, _viewBottom) &&
        isVisibleEnough(bounds, _viewTop, _viewBottom);
      if (isCurrentElement) {
        return i;
      }
    }
  }

  //https://bureau.ru/soviet/20190815/
  document.addEventListener('keydown', function (event) {
    let key = event.key.toLowerCase();
    let keyHeld = event.repeat;
    let alt = event.altKey;
    let ctrl = event.ctrlKey;
    let meta = event.metaKey;
    let shift = event.shiftKey;
    let modifier = alt || ctrl || meta || shift;

    if (['a','d','x'].includes(key) && !modifier && !keyHeld) {
      if (document.querySelectorAll('.feed__item').length === 0) return;

      let menuElement = document.getElementsByClassName('main_menu layout')[0];
      _viewTop = menuElement.clientHeight;
      _viewBottom = document.documentElement.clientHeight;

      let elements = selectElements();
      let i = indexOfCurrent(elements);

      let targetElement = {
        x: elements[i],
        a: elements[i - 1] || elements[i],
        d: elements[i + 1] || elements[i],
      }[key];

      let targetOffset = computeOffset(targetElement);

      window.scrollBy({ left: 0, top: targetOffset, behavior: 'smooth' });
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
