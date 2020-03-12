export {
  isApproaching,
  isPartInbound,
  isFullInbound,
  getHiddenTop,
  getHiddenBottom,
  getVisible,
  getPartOfBounds,
  getPartOfView,
  isVisibleEnough,
  isCurrent,
};

//https://docs.microsoft.com/en-us/previous-versions//hh781509(v=vs.85)
//https://learn.javascript.ru/coordinates

function isApproaching (rect, view) {
  return rect.bottom > view.top;
}

function isPartInbound (rect, view) {
  return (rect.bottom > view.top) && (rect.top < view.bottom);
}

function isFullInbound (rect, view) {
  return (rect.top >= view.top) && (rect.bottom <= view.bottom);
}

function getHiddenTop (rect, view) {
  return clamp(view.top - rect.top, 0, rect.height);
}

function getHiddenBottom (rect, view) {
  return clamp(rect.bottom - view.bottom, 0, rect.height);
}

function getVisible (rect, view) {
  let hiddenTop = getHiddenTop(rect, view);
  let hiddenBottom = getHiddenBottom(rect, view);
  return rect.height - hiddenTop - hiddenBottom;
}

function getPartOfBounds (rect, view) {
  let visible = getVisible(rect, view);
  return visible / rect.height;
}

function getPartOfView (rect, view) {
  let visible = getVisible(rect, view);
  return visible / view.height;
}

function isVisibleEnough (rect, view) {
  return (
    getPartOfBounds(rect, view) > 0.4 ||
    getPartOfView(rect, view) > 0.4
  );
}

function isCurrent(rect, view) {
  return (
    isApproaching(rect, view) &&
    isPartInbound(rect, view) &&
    isVisibleEnough(rect, view)
  );
}

function clamp (x, minVal, maxVal) {
  return Math.min(Math.max(x, minVal), maxVal);
}
