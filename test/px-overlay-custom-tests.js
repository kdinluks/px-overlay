// This is the wrapper for custom tests, called upon web components ready state
function runCustomTests() {
  // Place any setup steps like variable declaration and initialization here

  // This is the placeholder suite to place custom tests in
  // Use testCase(options) for a more convenient setup of the test cases
  suite('Custom Automation Tests for px-overlay', function() {
    var overlay = document.getElementById('overlay');
    test('Overlay is correct background color', function() {
      assert.equal(window.getComputedStyle(overlay).backgroundColor.substring(0,18), 'rgba(0, 0, 0, 0.65');
    });
    test('Overlay is correct size', function() {
      assert.equal(parseInt(window.getComputedStyle(overlay).height), window.innerHeight);
      assert.equal(parseInt(window.getComputedStyle(overlay).width), window.innerWidth);
    });
    test('Overlay accepts style variable', function() {
      var overlay = document.getElementById('salmon'),
      div = Polymer.dom(overlay.root).querySelector('#overlay');
      assert.equal(window.getComputedStyle(div).backgroundColor, 'rgb(250, 128, 114)');
    });
  });
};
