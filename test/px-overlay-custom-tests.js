suite('Basic configuration', function() {
  let overlayContent,
      overlayContainer,
      overlayHost,
      contentEvents = [],
      windowEvents = [];

  suiteSetup(() => {
    overlayContent = document.getElementById('px-overlay-content-fixture');
    overlayContainer = document.getElementById('px-overlay-container-fixture');

    overlayHost = overlayContainer.shadowRoot ? overlayContainer.shadowRoot.querySelector('#overlayHost') : overlayContainer.querySelector('#overlayHost');

    document.getElementById('eventCatcher').addEventListener('test-event', evt => { contentEvents.push(evt); });
    window.addEventListener('test-event', evt => { windowEvents.push(evt); });
  });

  test('Content is hoisted to container', function() {
    const elems = overlayHost.querySelectorAll('div');

    assert.equal(elems.length, 1);
    assert.equal(elems[0].children[0].textContent, "HI DAVID");
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
    debugger
    assert.deepEqual(contentEvents[0].sourceEvent.rootTarget, );


  });

});
