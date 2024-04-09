export {
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
};

//https://docs.microsoft.com/en-us/previous-versions//hh781509(v=vs.85)
//https://learn.javascript.ru/coordinates

//https://en.wikipedia.org/wiki/Box-drawing_character

/**
 * Checks that `rect` is either completely below a `view`
 * or (at least partially) within a `view`
 * @example
 * true cases:
 *                                                    +----+   *
 * + v.t -------+ + v.t -------+ + v.t -------+ + v.t ¦rect¦-+ *
 * ¦  ¦         ¦ ¦  ¦         ¦ ¦  ¦  +----+ ¦ ¦ r.b +----+ ¦ *
 * ¦  ¦         ¦ ¦  ¦         ¦ ¦  ¦  ¦rect¦ ¦ ¦            ¦ *
 * ¦  ¦         ¦ ¦  ¦  +----+ ¦ ¦ r.b +----+ ¦ ¦            ¦ *
 * +--¦---------+ +--¦--¦rect¦-+ +------------+ +------------+ *
 *    ¦  +----+     r.b +----+                                 *
 *    ¦  ¦rect¦                                                *
 *   r.b +----+                                                *
 * @param {DOMRectReadOnly} rect
 * @param {DOMRectReadOnly} view
 * @returns {boolean}
 */
function isApproaching (rect, view) {
  return rect.bottom > view.top;
}

/**
 * Checks that `rect` is at least partially visible in `view`
 * @example
 * true cases:
 *                                                 +------+ r.t   *
 * + v.t -------------+ + v.t -------------+ + v.t ¦ rect ¦--¦--+ *
 * ¦  ¦               ¦ ¦  ¦  +------+ r.t ¦ ¦ r.b +------+  ¦  ¦ *
 * ¦  ¦               ¦ ¦  ¦  ¦ rect ¦  ¦  ¦ ¦               ¦  ¦ *
 * ¦  ¦  +------+ r.t ¦ ¦ r.b +------+  ¦  ¦ ¦               ¦  ¦ *
 * +--¦--¦ rect ¦ v.b + +------------- v.b + +------------- v.b + *
 *   r.b +------+                                                 *
 * @param {DOMRectReadOnly} rect
 * @param {DOMRectReadOnly} view
 * @returns {boolean}
 */
function isPartInbound (rect, view) {
  return (rect.bottom > view.top) && (rect.top < view.bottom);
}

/**
 * Checks that `rect` is fully visible in `view`
 * @example
 * true cases:
 * + v.t -------------+ + v.t -------------+ + v.t -------------+ *
 * ¦  ¦               ¦ ¦  ¦               ¦ ¦ r.t +------+     ¦ *
 * ¦  ¦               ¦ ¦ r.t +------+     ¦ ¦     ¦ rect ¦     ¦ *
 * ¦ r.t +------+     ¦ ¦     ¦ rect ¦     ¦ ¦     +------+ r.b ¦ *
 * ¦     ¦ rect ¦     ¦ ¦     +------+ r.b ¦ ¦               ¦  ¦ *
 * ¦     +------+ r.b ¦ ¦               ¦  ¦ ¦               ¦  ¦ *
 * +------------- v.b + +------------- v.b + +------------- v.b + *
 * @param {DOMRectReadOnly} rect
 * @param {DOMRectReadOnly} view
 * @returns {boolean}
 */
function isFullInbound (rect, view) {
  return (rect.top >= view.top) && (rect.bottom <= view.bottom);
}

/**
 * Returns height of `rect` part that's above the upper edge of `view`
 * @example
 *                                     r.t +------+   *
 *                    r.t +------+      ¦  ¦ rect ¦   *
 *   r.t +------+      ¦  ¦ rect ¦      ¦  +------+   *
 * + v.t ¦ rect ¦-+ + v.t +------+-+ + v.t ---------+ *
 * ¦     +------+ ¦ ¦              ¦ ¦              ¦ *
 * ¦              ¦ ¦              ¦ ¦              ¦ *
 * +--------------+ +--------------+ +--------------+ *
 * @param {DOMRectReadOnly} rect
 * @param {DOMRectReadOnly} view
 * @returns {number}
 */
function getHiddenTop (rect, view) {
  return clamp(view.top - rect.top, 0, rect.height);
}

/**
 * Returns height of `rect` part that's below the lower edge of `view`
 * @example
 * +--------------+ +--------------+ +--------------+ *
 * ¦              ¦ ¦              ¦ ¦              ¦ *
 * ¦              ¦ ¦              ¦ ¦     +------+ ¦ *
 * + v.b ---------+ + v.b +------+-+ + v.b ¦ rect ¦-+ *
 *    ¦  +------+      ¦  ¦ rect ¦     r.b +------+   *
 *    ¦  ¦ rect ¦     r.b +------+                    *
 *   r.b +------+                                     *
 * @param {DOMRectReadOnly} rect
 * @param {DOMRectReadOnly} view
 * @returns {number}
 */
function getHiddenBottom (rect, view) {
  return clamp(rect.bottom - view.bottom, 0, rect.height);
}

/**
 * Returns height of `rect` part that's within a `view`
 * @example
 * true cases:
 *                    r.t +------+     r.t +------+   *
 * +--------------+ + v.t ¦      ¦-+ + v.t ¦ rect ¦-+ *
 * ¦              ¦ ¦     ¦      ¦ ¦ ¦     +------+ ¦ *
 * ¦              ¦ ¦     ¦ rect ¦ ¦ ¦              ¦ *
 * ¦     +------+ ¦ ¦     ¦      ¦ ¦ ¦              ¦ *
 * + v.b ¦ rect ¦-+ + v.b ¦      ¦-+ +--------------+ *
 *   r.b +------+     r.b +------+                    *
 * @param {DOMRectReadOnly} rect
 * @param {DOMRectReadOnly} view
 * @returns {number}
 */
function getVisible (rect, view) {
  let hiddenTop = getHiddenTop(rect, view);
  let hiddenBottom = getHiddenBottom(rect, view);
  return rect.height - hiddenTop - hiddenBottom;
}

/**
 * Returns a ratio of visible height of `rect` to its full height
 * @param {DOMRectReadOnly} rect
 * @param {DOMRectReadOnly} view
 * @returns {number}
 */
function getPartOfBounds (rect, view) {
  let visible = getVisible(rect, view);
  return visible / rect.height;
}

/**
 * Returns a ratio of visible height of `rect` to full height of `view`
 * @param {DOMRectReadOnly} rect
 * @param {DOMRectReadOnly} view
 * @returns {number}
 */
function getPartOfView (rect, view) {
  let visible = getVisible(rect, view);
  return visible / view.height;
}

/**
 * Checks that `rect` has non-zero height
 * @param {DOMRectReadOnly} rect
 * @param {DOMRectReadOnly} view
 * @returns {boolean}
 */
function isExpanded (rect, view) {
  return rect.height > 0;
}

/**
 * Checks that `rect` is 'visible enough'
 * @param {DOMRectReadOnly} rect
 * @param {DOMRectReadOnly} view
 * @returns {boolean}
 */
function isVisibleEnough (rect, view) {
  return (
    getPartOfBounds(rect, view) > 0.4 ||
    getPartOfView(rect, view) > 0.4
  );
}

/**
 * Checks that `rect` is the 'current' element
 * @param {DOMRectReadOnly} rect
 * @param {DOMRectReadOnly} view
 */
function isCurrent(rect, view) {
  return (
    isApproaching(rect, view) &&
    isPartInbound(rect, view) &&
    isVisibleEnough(rect, view)
  );
}

/**
 * Returns the value of `x` constrained to the range `minVal` to `maxVal`.
 * @param {number} x value to constrain.
 * @param {number} minVal lower end of the range.
 * @param {number} maxVal upper end of the range.
 * @returns {number} computed as `min(max(x, minVal), maxVal)`.
 */
function clamp (x, minVal, maxVal) {
  return Math.min(Math.max(x, minVal), maxVal);
}
