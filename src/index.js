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

import {
  selectorFeedHeader,
  selectorNewEntries,
  selectorSiteHeader,
  selectorContentLink,
  selectorFeedItem,
  selectorComposite,
  selectElements,
} from "./selectors.js";


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

  /**
   * @param {Element[]} elements
   * @returns {Element[]}
   */
  function filterElements (elements) {
    return elements.filter(function (element, i, arr) {
      let bounds = element.getBoundingClientRect();
      return isExpanded(bounds, view);
    });
  }

  /**
   * @param {Element} targetElement
   * @returns {number}
   */
  function computeOffset (targetElement) {
    let targetElementTop = targetElement.getBoundingClientRect().top;
    let topMargin = 15;
    let targetOffset = targetElementTop - view.top - topMargin;

    //Reveal both FeedHeader and NewEntries
    if (targetElement.isSameNode(document.querySelector(selectorFeedItem))) {
      let feedHeader = document.querySelector(selectorFeedHeader);
      if (feedHeader) {
        let feedHeaderHeight = feedHeader.getBoundingClientRect().height;
        targetOffset = targetOffset - feedHeaderHeight;
      }

      let newEntries = document.querySelector(selectorNewEntries);
      if (newEntries) {
        let newEntriesHeight = newEntries.getBoundingClientRect().height;
        targetOffset = targetOffset - newEntriesHeight;
      }
    }

    return targetOffset;
  }

  /**
   * @param {Element[]} elements
   * @returns {number}
   */
  function indexOfCurrent (elements) {
    for (var i = 0; i < elements.length; i++) {
      let element = elements[i];
      let bounds = element.getBoundingClientRect();
      if (isCurrent(bounds, view)) {
        return i;
      }
    }
  }

  //Как отслеживать и обрабатывать сочетания и последовательность нажатых клавиш
  //https://bureau.ru/soviet/20190815/
  document.addEventListener('keydown', function (event) {
    //console.log("%O %O", event.target, event);
    if (event.target.tagName === "INPUT") return;

    let key = event.key.toLowerCase();
    let keyHeld = event.repeat;
    let alt = event.altKey;
    let ctrl = event.ctrlKey;
    let meta = event.metaKey;
    let shift = event.shiftKey;
    let modifier = alt || ctrl || meta || shift;

    if (['a','d','x'].includes(key) && !modifier && !keyHeld) {
      if (selectElements(selectorFeedItem).length === 0) return;

      let siteHeader = document.querySelector(selectorSiteHeader);
      view.y = siteHeader.clientHeight;
      view.height = document.documentElement.clientHeight - view.y;

      let elements = filterElements(selectElements(selectorComposite));
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
      if (selectElements(selectorFeedItem).length === 0) return;

      let siteHeader = document.querySelector(selectorSiteHeader);
      view.y = siteHeader.clientHeight;
      view.height = document.documentElement.clientHeight - view.y;

      let elements = filterElements(selectElements(selectorComposite));
      let i = indexOfCurrent(elements);

      let targetElement = elements[i];

      let url = targetElement.querySelector(selectorContentLink).href;

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
