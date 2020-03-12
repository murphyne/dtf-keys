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

function isApproaching (bounds, view) {
  return bounds.bottom > view.top;
}

function isPartInbound (bounds, view) {
  return (bounds.bottom > view.top) && (bounds.top < view.bottom);
}

function isFullInbound (bounds, view) {
  return (bounds.top >= view.top) && (bounds.bottom <= view.bottom);
}

function getHiddenTop (bounds, view) {
  return clamp(view.top - bounds.top, 0, bounds.height);
}

function getHiddenBottom (bounds, view) {
  return clamp(bounds.bottom - view.bottom, 0, bounds.height);
}

function getVisible (bounds, view) {
  let hiddenTop = getHiddenTop(bounds, view);
  let hiddenBottom = getHiddenBottom(bounds, view);
  return bounds.height - hiddenTop - hiddenBottom;
}

function getPartOfBounds (bounds, view) {
  let visible = getVisible(bounds, view);
  return visible / bounds.height;
}

function getPartOfView (bounds, view) {
  let visible = getVisible(bounds, view);
  return visible / view.height;
}

function isVisibleEnough (bounds, view) {
  return (
    getPartOfBounds(bounds, view) > 0.4 ||
    getPartOfView(bounds, view) > 0.4
  );
}

function isCurrent(bounds, view) {
  return (
    isApproaching(bounds, view) &&
    isPartInbound(bounds, view) &&
    isVisibleEnough(bounds, view)
  );
}

function clamp (x, minVal, maxVal) {
  return Math.min(Math.max(x, minVal), maxVal);
}
