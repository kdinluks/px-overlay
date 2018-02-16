let overlayContent,
    overlayContainer,
    overlayContainerFoo,
    overlayHost,
    overlayHostFoo,
    contentEvents = [],
    windowEvents = [];

suite('Basic configuration', function() {
  suiteSetup((done) => {
    overlayContent = document.getElementById('px-overlay-content-fixture');
    overlayContainer = document.getElementById('px-overlay-container-fixture');

    overlayHost = overlayContainer.shadowRoot ? overlayContainer.shadowRoot.querySelector('#overlayHost') : overlayContainer.querySelector('#overlayHost');

    document.getElementById('eventCatcher').addEventListener('test-event', evt => { contentEvents.push(evt); });
    window.addEventListener('test-event', evt => { windowEvents.push(evt); });

    setTimeout( () => {
      done();
    }, 50);
  });

  test('Content is hoisted to container', function() {
    const elems = overlayHost.querySelectorAll('div');
    assert.equal(elems.length, 1);
    assert.equal(elems[0].children[0].children[0].textContent, "HI DAVID");
  });

  test('Container creates a map with info', function() {
    assert.isTrue(overlayContainer._attachedOverlays.has(overlayContent));

    const vals = overlayContainer._attachedOverlays.get(overlayContent);

    assert.equal(vals.localContainer, overlayHost.querySelector('div'));
    assert.equal(vals.content.length, 3);
    assert.equal(typeof vals.fn, 'function');
  });

  test('Event is retargeted', function() {
    const h1 = overlayHost.querySelector('h1');

    const event = new CustomEvent('test-event', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {hi: "david"}
    });

    h1.dispatchEvent(event);

    assert.equal(contentEvents.length, 1);
    assert.equal(windowEvents.length, 1);

    assert.deepEqual(contentEvents[0].detail, {hi: "david"});
    assert.equal(typeof contentEvents[0].sourceEvent, 'object');
  });

});

suite('Detach container', function() {
  suiteSetup((done) => {
    contentEvents = [];
    windowEvents = [];

    document.body.removeChild(overlayContainer);

    setTimeout( () => {
      done();
    }, 50);
  });

  test('Container was removed and new one was added', function() {
    const containers = document.querySelectorAll('px-overlay-container');

    overlayContainer = containers[0];

    overlayHost = overlayContainer.shadowRoot ? overlayContainer.shadowRoot.querySelector('#overlayHost') : overlayContainer.querySelector('#overlayHost');

    assert.equal(containers.length, 1);
    assert.isNull(containers[0].getAttribute('id'));

  });

  test('Content got reattached', function() {
    const elems = overlayHost.querySelectorAll('div');

    assert.equal(elems.length, 1);
    assert.equal(elems[0].children[0].children[0].textContent, "HI DAVID");
  });

});

suite('Toggle hoist prop to false', function() {
  suiteSetup((done) => {
    overlayContent.set('hoist', false);

    setTimeout( () => {
      done();
    }, 50);
  });

  test('Content was removed from container', function() {
    const elems = overlayHost.querySelectorAll('div');

    assert.equal(elems.length, 0);

  });

  test('Content got reattached in overlay-content', function() {
    const elem = overlayContent.querySelector('h1');

    assert.equal(elem.textContent, "HI DAVID");
  });

});

suite('Add containerType and hoist to true', function() {
  suiteSetup((done) => {
    overlayContent.set('containerType', "foo");
    overlayContent.set('hoist', true);

    setTimeout( () => {
      done();
    }, 50);
  });

  test('Foo type container was added', function() {
    const containers = document.querySelectorAll('px-overlay-container');

    assert.equal(containers.length, 2);

    if(containers[0].containerType === 'foo') {
      overlayContainerFoo = containers[0];

    } else if(containers[1].containerType === 'foo') {
      overlayContainerFoo = containers[1];

    }

    assert.isDefined(overlayContainerFoo);

  });

  test('Content was added to the correct container', function() {
    overlayHostFoo = overlayContainerFoo.shadowRoot ? overlayContainerFoo.shadowRoot.querySelector('#overlayHost') : overlayContainerFoo.querySelector('#overlayHost');

    const elems = overlayHost.querySelectorAll('div');
    const elemsFoo = overlayHostFoo.querySelectorAll('div');

    assert.equal(elems.length, 0);
    assert.equal(elemsFoo.length, 1);
    assert.equal(elemsFoo[0].querySelector('h1').textContent, "HI DAVID");

  });

});

suite('Add new content to the overlay-content', function() {
  let newElem;

  suiteSetup((done) => {
    newElem = document.createElement('h2');
    newElem.setAttribute("david", true);
    newElem.textContent = "is Ben there?";

    window._wrapper.appendChild(newElem);

    flush(() => {
      setTimeout( () => {
        done();
      }, 50);
    });
  });

  test("new content was added to the content's _content", function() {
    assert.equal(overlayContent._content.length, 3);
    assert.equal(overlayContent._content[1].children[1], newElem);

  });

  test('Content was added to the container', function() {
    const elems = overlayHost.querySelectorAll('div');
    const elemsFoo = overlayHostFoo.querySelectorAll('div');

    assert.equal(elems.length, 0);
    assert.equal(elemsFoo.length, 1);
    assert.equal(elemsFoo[0].querySelector('h2').textContent, "is Ben there?");

  });

});

suite('Detach overlay-content', function() {
  suiteSetup((done) => {
    document.getElementById('eventCatcher').removeChild(overlayContent);

    setTimeout( () => {
      done();
    }, 50);
  });

  test('Content was removed from container', function() {
    const elemsFoo = overlayHostFoo.querySelectorAll('div');

    assert.equal(elemsFoo.length, 0);
    assert.isFalse(overlayContainerFoo._attachedOverlays.has(overlayContent));
  });

});