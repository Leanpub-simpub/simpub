document.addEventListener("turbolinks:load", () => {
	const html = document.querySelector("html");
	const checkbox = document.querySelector("input[name=theme]");
	const iconBtn = document.querySelector(".icon-btn");
	const icon = document.querySelector(".light-icon");

	if (localStorage.getItem("mode")) {
		if (localStorage.getItem("mode").includes("dark")) {
			icon.classList.remove("fa-moon");
			icon.classList.add("fa-sun");
		} else {
			icon.classList.remove("fa-sun");
			icon.classList.add("fa-moon");
		}
	}

	const getStyle = (element, style) =>
		window.getComputedStyle(element).getPropertyValue(style);

	const initialColors = {
		bg: getStyle(html, "--bg"),
		txt: getStyle(html, "--txt"),
		main: getStyle(html, "--main"),
	};

	// override styles
	const darkMode = {
		bg: "#222222",
		txt: "#ffffff",
		main: "#e09a5f",
	};

	const transformKey = (key) =>
		"--" + key.replace(/([A-Z])/, "-$1").toLowerCase();

	const changeColors = (colors) => {
		Object.keys(colors).map((key) =>
			html.style.setProperty(transformKey(key), colors[key])
		);
	};

	// checkbox.addEventListener("change", ({ target }) => {
	// 	target.checked ? changeColors(darkMode) : changeColors(initialColors);
	// });

	const isExistLocalStorage = (key) => localStorage.getItem(key) != null;

	const createOrEditLocalStorage = (key, value) =>
		localStorage.setItem(key, JSON.stringify(value));

	const getValueLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

	checkbox.addEventListener("change", ({ target }) => {
		if (target.checked) {
			changeColors(darkMode);
			createOrEditLocalStorage("mode", "darkMode");
			icon.classList.remove("fa-moon");
			icon.classList.add("fa-sun");
		} else {
			changeColors(initialColors);
			createOrEditLocalStorage("mode", "initialColors");
			icon.classList.remove("fa-sun");
			icon.classList.add("fa-moon");
		}
	});

	if (!isExistLocalStorage("mode"))
		createOrEditLocalStorage("mode", "initialColors");

	if (getValueLocalStorage("mode") === "initialColors") {
		checkbox.removeAttribute("checked");
		changeColors(initialColors);
	} else {
		checkbox.setAttribute("checked", "");
		changeColors(darkMode);
	}

	iconBtn.addEventListener("click", () => {
		checkbox.click();
	});
});
