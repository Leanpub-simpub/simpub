$(function () {
  $(".typed").typed({
    strings: ["Simple to publish. <br> Simple to write."],
    // Optionally use an HTML element to grab strings from (must wrap each string in a <p>)
    stringsElement: null,
    // typing speed
    typeSpeed: 80,
    // time before typing starts
    startDelay: 1200,
    // backspacing speed
    loop: true,
    // false = infinite
    loopCount: 1,
    // show cursor
    showCursor: false,
    // character for cursor
    cursorChar: "|",
    // attribute to type (null == text)
    attr: null,
    // either html or text
    contentType: "html",
  });
});
