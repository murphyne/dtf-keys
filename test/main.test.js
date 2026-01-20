import * as chai from 'chai';
import sinon from 'sinon';

describe('main.js', function () {
  beforeEach(function () {
    global.document = {
      addEventListener: sinon.fake(),
    };
    global.DOMRect = {
      fromRect: sinon.fake(),
    }
  });

  afterEach(function () {
    delete global.document;
    delete global.DOMRect;
  });

  it('Adds EventListener to document', async function () {
    chai.assert.isFalse(document.addEventListener.called);

    await import('../src/main.js');

    chai.assert.isTrue(document.addEventListener.called);
    chai.assert.isTrue(document.addEventListener.calledWith('keydown'));
  });
});
