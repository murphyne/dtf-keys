import chai from 'chai';
import fc from 'fast-check';

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
  isCurrent,
} from '../src/bounds.js';


function r ({x=0, y=0, w=0, h=0}) {
  return {
    x: x,
    y: y,
    width: w,
    height: h,
    top: Math.min(y, y + h),
    right: Math.max(x, x + w),
    bottom: Math.max(y, y + h),
    left: Math.min(x, x + w),
  };
}

describe('rect', function () {
  it(`uses provided x, y, w, h as is`, function () {
    fc.assert(
      fc.property(
        fc.double(), fc.double(), fc.double(), fc.double(),
        (x, y, w, h) => {
          const rect = r({x, y, w, h});
          chai.assert.equal(rect.x, x);
          chai.assert.equal(rect.y, y);
          chai.assert.equal(rect.width, w);
          chai.assert.equal(rect.height, h);
        }
      )
    );
  });

  it(`handles positive width, height values`, function () {
    fc.assert(
      fc.property(
        fc.double(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
        fc.double(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
        fc.double(0, Number.MAX_SAFE_INTEGER),
        fc.double(0, Number.MAX_SAFE_INTEGER),
        (x, y, w, h) => {
          const rect = r({x, y, w, h});
          chai.assert.equal(rect.top, y);
          chai.assert.equal(rect.bottom, y + h);
          chai.assert.equal(rect.left, x);
          chai.assert.equal(rect.right, x + w);
        }
      )
    );
  });

  it(`handles negative width, height values`, function () {
    fc.assert(
      fc.property(
        fc.double(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
        fc.double(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
        fc.double(Number.MIN_SAFE_INTEGER, 0),
        fc.double(Number.MIN_SAFE_INTEGER, 0),
        (x, y, w, h) => {
          const rect = r({x, y, w, h});
          chai.assert.equal(rect.top, y + h);
          chai.assert.equal(rect.bottom, y);
          chai.assert.equal(rect.left, x + w);
          chai.assert.equal(rect.right, x);
        }
      )
    );
  });
});

describe('bounds', function () {
  it(`${isApproaching.name}`, function () {
    const tests = [
      {ry: 200, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry: 100, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  90, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  80, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  10, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:   0, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:   0, rh: 11, vy: 10, vh: 100, expected:  true},
      {ry:   0, rh: 10, vy: 10, vh: 100, expected: false},
      {ry: -10, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: -10, rh: 11, vy: 10, vh: 100, expected: false},
      {ry: -10, rh: 10, vy: 10, vh: 100, expected: false},
      {ry: -20, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: -40, rh: 20, vy: 10, vh: 100, expected: false},
    ];

    tests.forEach(function (test) {
      const rect = r({y: test.ry, h: test.rh});
      const view = r({y: test.vy, h: test.vh});
      const result = isApproaching(rect, view.top, view.bottom);
      chai.assert.equal(result, test.expected,
        `(ry:${test.ry}, rh:${test.rh}) (vy:${test.vy}, vh:${test.vh})`);
    });
  });

  it(`${isPartInbound.name}`, function () {
    const tests = [
      {ry: 200, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: 110, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: 100, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  90, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  10, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:   0, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry: -10, rh: 21, vy: 10, vh: 100, expected:  true},
      {ry: -10, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: -20, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: -80, rh: 20, vy: 10, vh: 100, expected: false},
    ];

    tests.forEach(function (test) {
      const rect = r({y: test.ry, h: test.rh});
      const view = r({y: test.vy, h: test.vh});
      const result = isPartInbound(rect, view.top, view.bottom);
      chai.assert.equal(result, test.expected,
        `(ry:${test.ry}, rh:${test.rh}) (vy:${test.vy}, vh:${test.vh})`);
    });
  });

  it(`${isFullInbound.name}`, function () {
    const tests = [
      {ry: 200, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: 110, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: 100, rh: 20, vy: 10, vh: 100, expected: false},
      {ry:  90, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  50, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  10, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:   0, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: -10, rh: 21, vy: 10, vh: 100, expected: false},
      {ry: -10, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: -20, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: -80, rh: 20, vy: 10, vh: 100, expected: false},
    ];

    tests.forEach(function (test) {
      const rect = r({y: test.ry, h: test.rh});
      const view = r({y: test.vy, h: test.vh});
      const result = isFullInbound(rect, view.top, view.bottom);
      chai.assert.equal(result, test.expected,
        `(ry:${test.ry}, rh:${test.rh}) (vy:${test.vy}, vh:${test.vh})`);
    });
  });

  it(`${getHiddenTop.name}`, function () {
    const tests = [
      {ry: 200, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry: 110, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry: 100, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry:  90, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry:  50, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry:  10, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry:   0, rh: 20, vy: 10, vh: 100, expected: 10},
      {ry: -10, rh: 21, vy: 10, vh: 100, expected: 20},
      {ry: -10, rh: 20, vy: 10, vh: 100, expected: 20},
      {ry: -20, rh: 20, vy: 10, vh: 100, expected: 20},
      {ry: -80, rh: 20, vy: 10, vh: 100, expected: 20},
    ];

    tests.forEach(function (test) {
      const rect = r({y: test.ry, h: test.rh});
      const view = r({y: test.vy, h: test.vh});
      const result = getHiddenTop(rect, view.top, view.bottom);
      chai.assert.equal(result, test.expected,
        `(ry:${test.ry}, rh:${test.rh}) (vy:${test.vy}, vh:${test.vh})`);
    });
  });

  it(`${getHiddenBottom.name}`, function () {
    const tests = [
      {ry: 200, rh: 20, vy: 10, vh: 100, expected: 20},
      {ry: 110, rh: 20, vy: 10, vh: 100, expected: 20},
      {ry: 100, rh: 20, vy: 10, vh: 100, expected: 10},
      {ry:  90, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry:  50, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry:  10, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry:   0, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry: -10, rh: 21, vy: 10, vh: 100, expected:  0},
      {ry: -10, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry: -20, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry: -80, rh: 20, vy: 10, vh: 100, expected:  0},
    ];

    tests.forEach(function (test) {
      const rect = r({y: test.ry, h: test.rh});
      const view = r({y: test.vy, h: test.vh});
      const result = getHiddenBottom(rect, view.top, view.bottom);
      chai.assert.equal(result, test.expected,
        `(ry:${test.ry}, rh:${test.rh}) (vy:${test.vy}, vh:${test.vh})`);
    });
  });

  it(`${getVisible.name}`, function () {
    const tests = [
      {ry: 200, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry: 110, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry: 100, rh: 20, vy: 10, vh: 100, expected: 10},
      {ry:  90, rh: 20, vy: 10, vh: 100, expected: 20},
      {ry:  50, rh: 20, vy: 10, vh: 100, expected: 20},
      {ry:  10, rh: 20, vy: 10, vh: 100, expected: 20},
      {ry:   0, rh: 20, vy: 10, vh: 100, expected: 10},
      {ry: -10, rh: 21, vy: 10, vh: 100, expected:  1},
      {ry: -10, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry: -20, rh: 20, vy: 10, vh: 100, expected:  0},
      {ry: -80, rh: 20, vy: 10, vh: 100, expected:  0},
    ];

    tests.forEach(function (test) {
      const rect = r({y: test.ry, h: test.rh});
      const view = r({y: test.vy, h: test.vh});
      const result = getVisible(rect, view.top, view.bottom);
      chai.assert.equal(result, test.expected,
        `(ry:${test.ry}, rh:${test.rh}) (vy:${test.vy}, vh:${test.vh})`);
    });
  });

  it(`${getPartOfBounds.name}`, function () {
    const tests = [
      {ry: 200, rh: 20, vy: 10, vh: 100, expected: 0   },
      {ry: 110, rh: 20, vy: 10, vh: 100, expected: 0   },
      {ry: 100, rh: 20, vy: 10, vh: 100, expected: 0.5 },
      {ry:  90, rh: 20, vy: 10, vh: 100, expected: 1.0 },
      {ry:  50, rh: 20, vy: 10, vh: 100, expected: 1.0 },
      {ry:  10, rh: 20, vy: 10, vh: 100, expected: 1.0 },
      {ry:   0, rh: 20, vy: 10, vh: 100, expected: 0.5 },
      {ry:  -9, rh: 20, vy: 10, vh: 100, expected: 0.05},
      {ry: -10, rh: 20, vy: 10, vh: 100, expected: 0   },
      {ry: -20, rh: 20, vy: 10, vh: 100, expected: 0   },
      {ry: -80, rh: 20, vy: 10, vh: 100, expected: 0   },
    ];

    tests.forEach(function (test) {
      const rect = r({y: test.ry, h: test.rh});
      const view = r({y: test.vy, h: test.vh});
      const result = getPartOfBounds(rect, view.top, view.bottom);
      chai.assert.equal(result, test.expected,
        `(ry:${test.ry}, rh:${test.rh}) (vy:${test.vy}, vh:${test.vh})`);
    });
  });

  it(`${getPartOfView.name}`, function () {
    const tests = [
      {ry: 200, rh: 20, vy: 10, vh: 100, expected: 0   },
      {ry: 110, rh: 20, vy: 10, vh: 100, expected: 0   },
      {ry: 100, rh: 20, vy: 10, vh: 100, expected: 0.10},
      {ry:  90, rh: 20, vy: 10, vh: 100, expected: 0.20},
      {ry:  50, rh: 20, vy: 10, vh: 100, expected: 0.20},
      {ry:  10, rh: 20, vy: 10, vh: 100, expected: 0.20},
      {ry:   0, rh: 20, vy: 10, vh: 100, expected: 0.10},
      {ry:  -9, rh: 20, vy: 10, vh: 100, expected: 0.01},
      {ry: -10, rh: 20, vy: 10, vh: 100, expected: 0   },
      {ry: -20, rh: 20, vy: 10, vh: 100, expected: 0   },
      {ry: -80, rh: 20, vy: 10, vh: 100, expected: 0   },
    ];

    tests.forEach(function (test) {
      const rect = r({y: test.ry, h: test.rh});
      const view = r({y: test.vy, h: test.vh});
      const result = getPartOfView(rect, view.top, view.bottom);
      chai.assert.equal(result, test.expected,
        `(ry:${test.ry}, rh:${test.rh}) (vy:${test.vy}, vh:${test.vh})`);
    });
  });

  it(`${isVisibleEnough.name}`, function () {
    const tests = [
      {ry: 200, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: 110, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: 100, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  90, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  50, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  10, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:   0, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry: -10, rh: 21, vy: 10, vh: 100, expected: false},
      {ry: -10, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: -20, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: -80, rh: 20, vy: 10, vh: 100, expected: false},
    ];

    tests.forEach(function (test) {
      const rect = r({y: test.ry, h: test.rh});
      const view = r({y: test.vy, h: test.vh});
      const result = isVisibleEnough(rect, view.top, view.bottom);
      chai.assert.equal(result, test.expected,
        `(ry:${test.ry}, rh:${test.rh}) (vy:${test.vy}, vh:${test.vh})`);
    });
  });

  it(`${isCurrent.name}`, function () {
    const tests = [
      {ry: 200, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: 110, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: 100, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  90, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  50, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:  10, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry:   0, rh: 20, vy: 10, vh: 100, expected:  true},
      {ry: -10, rh: 21, vy: 10, vh: 100, expected: false},
      {ry: -10, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: -20, rh: 20, vy: 10, vh: 100, expected: false},
      {ry: -80, rh: 20, vy: 10, vh: 100, expected: false},
    ];

    tests.forEach(function (test) {
      const rect = r({y: test.ry, h: test.rh});
      const view = r({y: test.vy, h: test.vh});
      const result = isCurrent(rect, view.top, view.bottom);
      chai.assert.equal(result, test.expected,
        `(ry:${test.ry}, rh:${test.rh}) (vy:${test.vy}, vh:${test.vh})`);
    });
  });
});
