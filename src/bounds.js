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
};

//https://docs.microsoft.com/en-us/previous-versions//hh781509(v=vs.85)
//https://learn.javascript.ru/coordinates

function isApproaching (bounds, viewTop, viewBottom) {
  return bounds.bottom > viewTop;
}

function isPartInbound (bounds, viewTop, viewBottom) {
  return (bounds.bottom > viewTop) && (bounds.top < viewBottom);
}

function isFullInbound (bounds, viewTop, viewBottom) {
  return (bounds.top >= viewTop) && (bounds.bottom <= viewBottom);
}

function getHiddenTop (bounds, viewTop, viewBottom) {
  return clamp(viewTop - bounds.top, 0, bounds.height);
}

function getHiddenBottom (bounds, viewTop, viewBottom) {
  return clamp(bounds.bottom - viewBottom, 0, bounds.height);
}

function getVisible (bounds, viewTop, viewBottom) {
  let hiddenTop = getHiddenTop(bounds, viewTop, viewBottom);
  let hiddenBottom = getHiddenBottom(bounds, viewTop, viewBottom);
  return bounds.height - hiddenTop - hiddenBottom;
}

function getPartOfBounds (bounds, viewTop, viewBottom) {
  let visible = getVisible(bounds, viewTop, viewBottom);
  return visible / bounds.height;
}

function getPartOfView (bounds, viewTop, viewBottom) {
  let visible = getVisible(bounds, viewTop, viewBottom);
  return visible / (viewBottom - viewTop);
}

function isVisibleEnough (bounds, viewTop, viewBottom) {
  return (
    getPartOfBounds(bounds, viewTop, viewBottom) > 0.4 ||
    getPartOfView(bounds, viewTop, viewBottom) > 0.4
  );
}

function clamp (x, minVal, maxVal) {
  return Math.min(Math.max(x, minVal), maxVal);
}
