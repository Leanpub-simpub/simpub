// import { Controller } from "stimulus";
// // import axios from "axios";

// export default class extends Controller {
//   static targets = ["icon"];

//   switch() {
//     const html = document.querySelector("html");
//     const getStyle = (element, style) =>
//       window.getComputedStyle(element).getPropertyValue(style);

//     const initialColors = {
//       bg: getStyle(html, "--bg"),
//       txt: getStyle(html, "--txt"),
//       main: getStyle(html, "--main"),
//     };

//     const darkMode = {
//       bg: "#222222",
//       txt: "#ffffff",
//       main: "#e09a5f",
//     };

//     const transformKey = (key) =>
//       "--" + key.replace(/([A-Z])/, "-$1").toLowerCase();

//     const changeColors = (colors) => {
//       Object.keys(colors).map((key) =>
//         html.style.setProperty(transformKey(key), colors[key])
//       );
//     };

//     const isExistLocalStorage = (key) => localStorage.getItem(key) != null;
//     const createOrEditLocalStorage = (key, value) =>
//       localStorage.setItem(key, JSON.stringify(value));
//     const getValueLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

//     if (!isExistLocalStorage("mode"))
//       createOrEditLocalStorage("mode", "initialColors");

//     if (getValueLocalStorage("mode") === "initialColors") {
//       changeColors(initialColors);
//     } else {
//       changeColors(darkMode);
//     }

//     let moon = $("i.fa-moon");
//     console.log("click is working!");

//     if (moon.length > 0) {
//       moon.attr("class", "fas fa-lightbulb");
//       changeColors(darkMode);
//       createOrEditLocalStorage("mode", "darkMode");
//     } else {
//       $("i.fa-lightbulb").attr("class", "fas fa-moon");
//       changeColors(initialColors);
//       createOrEditLocalStorage("mode", "initialColors");
//     }

//     if ($(".fa-moon")) {
//       changeColors(darkMode);
//     } else {
//       changeColors(initialColors);
//     }
//   }
// }
