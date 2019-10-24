;(function dtfNavigationKeys () {
  'use strict';

  //https://docs.microsoft.com/en-us/previous-versions//hh781509(v=vs.85)
  //https://learn.javascript.ru/coordinates

  let viewTop;
  let viewBottom;

  function isApproaching (bounds) {
    return bounds.bottom > viewTop;
  }

  function isPartInbound (bounds) {
    return (bounds.bottom > viewTop) && (bounds.top < viewBottom);
  }

  function isFullInbound (bounds) {
    return (bounds.top > viewTop) && (bounds.bottom < viewBottom);
  }

  function getHiddenTop (bounds) {
    return Math.max(viewTop - bounds.top, 0);
  }

  function getHiddenBottom (bounds) {
    return Math.max(bounds.bottom - viewBottom, 0);
  }

  function getVisible (bounds) {
    let hiddenTop = getHiddenTop(bounds);
    let hiddenBottom = getHiddenBottom(bounds);
    return bounds.height - hiddenTop - hiddenBottom;
  }

  function getPartOfBounds (bounds) {
    let visible = getVisible(bounds);
    return visible / bounds.height;
  }

  function getPartOfView (bounds) {
    let visible = getVisible(bounds);
    return visible / viewBottom;
  }

  function isVisibleEnough (bounds) {
    return (
      getPartOfBounds(bounds) > 0.4 ||
      getPartOfView(bounds) > 0.4
    );
  }

  function selectElements () {
    let selectors = [
      '.news_widget',
      '.teaserPodcast',
      '.vacancies_widget',
      '.widget_wrapper',
      '.feed__item',
    ].join(',');

    let elements = Array.from(document.querySelectorAll(selectors));

    //Do not obscure .feed_header
    let firstFeedItem = elements.find(function (v, i, a) {
      return v.classList.contains('feed__item');
    });
    let feedHeader = document.querySelector('.feed_header');
    let feedHeaderHeight = feedHeader.getBoundingClientRect().height;
    firstFeedItem.style.marginTop = `-${feedHeaderHeight}px`;
    firstFeedItem.style.paddingTop = `${feedHeaderHeight}px`;

    return elements;
  }

  function indexOfCurrent (elements) {
    for (var i = 0; i < elements.length; i++) {
      let element = elements[i];
      let bounds = element.getBoundingClientRect();
      let isCurrentElement =
        isApproaching(bounds) &&
        isPartInbound(bounds) &&
        isVisibleEnough(bounds);
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
      viewTop = menuElement.clientHeight;
      viewBottom = document.documentElement.clientHeight;

      let elements = selectElements();
      let i = indexOfCurrent(elements);

      let targetElement = {
        x: elements[i],
        a: elements[i - 1] || elements[i],
        d: elements[i + 1] || elements[i],
      }[key];

      let targetElementTop = targetElement.getBoundingClientRect().top;
      let topMargin = 15;
      let targetOffset = targetElementTop - viewTop - topMargin;

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

  return;

  //Below is the code for debugging purposes
  var feedItems = Array.from(document.getElementsByClassName('feed__item'));
  var laterItems = feedItems.filter(item => isApproaching(item.getBoundingClientRect()));
  var partItems = laterItems.filter(item => isPartInbound(item.getBoundingClientRect()));
  var fullItems = partItems.filter(item => isFullInbound(item.getBoundingClientRect()));

  feedItems.forEach(item => item.lastElementChild.removeAttribute('style'));
  partItems.forEach(item => item.lastElementChild.style.background = '#aaf');
  fullItems.forEach(item => item.lastElementChild.style.background = '#faa');

  for (let i = 0; i < partItems.length; i++) {
    let item = partItems[i];
    let bounds = item.getBoundingClientRect();
    if (isVisibleEnough(bounds)) {
      item.lastElementChild.style.background = '#afa';
      console.log(item);
      console.log(`
        getHiddenTop     ${getHiddenTop(bounds)}
        getHiddenBottom  ${getHiddenBottom(bounds)}
        getVisible       ${getVisible(bounds)}
        bounds.height    ${bounds.height}
        -
        getVisible       ${getVisible(bounds)}
        bounds.height    ${bounds.height}
        getPartOfBounds  ${getPartOfBounds(bounds)}
        -
        getVisible       ${getVisible(bounds)}
        viewBottom       ${viewBottom}
        getPartOfView    ${getPartOfView(bounds)}
      `.replace(/^\s+/gm, ''));
      break;
    }
  }
})();
