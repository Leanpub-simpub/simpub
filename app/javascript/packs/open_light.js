document.addEventListener("turbolinks:load", () => {
	const html = document.querySelector("html");
	const checkbox = document.querySelector("input[name=theme]");

	const getStyle = (element, style) =>
		window.getComputedStyle(element).getPropertyValue(style);

	const initialColors = {
		bg: getStyle(html, "--bg"),
		txt: getStyle(html, "--txt"),
	};

	// override styles
	const darkMode = {
		bg: "#222222",
		txt: "#ffffff",
	};

	const transformKey = (key) =>
		"--" + key.replace(/([A-Z])/, "-$1").toLowerCase();

	const changeColors = (colors) => {
		Object.keys(colors).map((key) =>
			html.style.setProperty(transformKey(key), colors[key])
		);
	};

	checkbox.addEventListener("change", ({ target }) => {
		target.checked ? changeColors(darkMode) : changeColors(initialColors);
	});

	const isExistLocalStorage = (key) => localStorage.getItem(key) != null;

	const createOrEditLocalStorage = (key, value) =>
		localStorage.setItem(key, JSON.stringify(value));

	const getValueLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

	checkbox.addEventListener("change", ({ target }) => {
		if (target.checked) {
			changeColors(darkMode);
			createOrEditLocalStorage("mode", "darkMode");
		} else {
			changeColors(initialColors);
			createOrEditLocalStorage("mode", "initialColors");
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
});
