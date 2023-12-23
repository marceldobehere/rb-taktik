function attachOnEnterHandler(element, callback) {
  element.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      callback()
    }
  })
}