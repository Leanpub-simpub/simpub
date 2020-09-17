import "bootstrap";
import $ from "jquery";
import "select2";

$(document).on("turbolinks:load", () => {
  if ($("#book_tag_items")) {
    $("#book_tag_items").select2({
      tags: true,
      tokenSeparators: [',', ' ']
    });
  }
});