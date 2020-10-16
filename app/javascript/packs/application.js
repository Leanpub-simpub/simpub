// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start();
require("turbolinks").start();
require("@rails/activestorage").start();
require("channels");

// require("trix")
// require("@rails/actiontext")

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
const images = require.context("../images", true);
const imagePath = (name) => images(name, true);

import "bootstrap";
import "select2";
import "select2/dist/css/select2.css";
import "controllers";
require("../stylesheets");
require("../cart");
require("../books");
require("../sign_up");
import "controllers";
import "cropperjs";
import "cropperjs/dist/cropper.css";
import "sweetalert2";
import "./layout";
