let trustedCounter = 0;
let scrollCounter = 0;
let keyCounter = 0;

window.addEventListener("mousemove", function (e) {
  if (e.isTrusted) {
    trustedCounter++;
  }
  //console.log(trustedCounter)
});

window.addEventListener("scroll", function (e) {
  if (e.isTrusted) {
    scrollCounter++;
  }
  //console.log(scrollCounter);
});

window.addEventListener("keyup", function (e) {
    if (e.isTrusted) {
      keyCounter++;
    }
    //console.log(scrollCounter);
  });

export { trustedCounter, scrollCounter, keyCounter };