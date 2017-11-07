suite('Custom Automation Tests for px-overlay', function() {
  let overlay;
  let salmonOverlay;

  setup((done)=>{
    overlay = fixture('px-overlay-fixture');
    salmonOverlay = fixture('px-overlay-salmon-fixture');
    flush(()=>{
      done();
    })
  });

  test('Overlay is correct background color', function(done) {
    let overlayDiv = Polymer.dom(overlay.root).querySelector('div');
    async.until(
      function() {
        return (window.getComputedStyle(overlayDiv).backgroundColor.substring(0,18) === 'rgba(0, 0, 0, 0.65');
      },
      function(callback) {
        setTimeout(callback, 1000);
      },
      function (err, n) {
        assert.equal(window.getComputedStyle(overlayDiv).backgroundColor.substring(0,18), 'rgba(0, 0, 0, 0.65');
        done();
      }
    )
  });

  test('Overlay is correct size', function(done) {
    async.until(
      function() {
        return (parseInt(window.getComputedStyle(overlay).height) === window.innerHeight);
      },
      function(callback) {
        setTimeout(callback, 1000);
      },
      function (err, n) {
        assert.equal(parseInt(window.getComputedStyle(overlay).height), window.innerHeight);
        assert.equal(parseInt(window.getComputedStyle(overlay).width), window.innerWidth);
        done();
      }
    )
  });

  test('Overlay accepts style variable', function(done) {
    let div = Polymer.dom(salmonOverlay.root).querySelector('#overlay');
    async.until(
      function() {
        return (window.getComputedStyle(div).backgroundColor === 'rgb(250, 128, 114)');
      },
      function(callback) {
        setTimeout(callback, 1000);
      },
      function (err, n) {
        assert.equal(window.getComputedStyle(div).backgroundColor, 'rgb(250, 128, 114)');
        done();
      }
    )
  });
});
