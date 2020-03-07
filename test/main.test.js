import chai from 'chai';
import sinon from 'sinon';

describe('src.js', function () {
  beforeEach(function () {
    global.document = {
      addEventListener: sinon.fake(),
    };
  });

  afterEach(function () {
    delete global.document;
  });

  it('Adds EventListener to document', async function () {
    chai.assert.isFalse(document.addEventListener.called);

    await import('../src/src.js');

    chai.assert.isTrue(document.addEventListener.called);
  });
});
