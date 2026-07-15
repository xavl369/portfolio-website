/** Contact form — vanilla JS replacement for the old AngularJS controller.
	Posts to Web3Forms; native HTML5 validation gates submission. */
(function () {
	"use strict";

	document.addEventListener("DOMContentLoaded", function () {
		var form = document.getElementById("contactform");
		if (!form) return;

		var button = form.querySelector("button[type=submit]");
		var result = document.getElementById("form_result");
		var nameInput = document.getElementById("inputName");
		var namePreview = document.getElementById("contact_name_preview");

		if (nameInput && namePreview) {
			nameInput.addEventListener("input", function () {
				namePreview.textContent = nameInput.value || " ";
			});
		}

		form.addEventListener("submit", function (e) {
			e.preventDefault();
			button.disabled = true;

			fetch("https://api.web3forms.com/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({
					access_key: "68739825-f9ca-4147-8b63-67b4a66a520f",
					name: form.inputName.value,
					email: form.inputEmail.value,
					message: form.inputMessage.value
				})
			}).then(function (response) {
				return response.json();
			}).then(function (data) {
				button.disabled = false;
				if (data.success) {
					form.reset();
					if (namePreview) namePreview.textContent = " ";
					result.className = "bg-success";
					result.textContent = "Message sent successfully!";
				} else {
					result.className = "bg-danger";
					result.textContent = "Failed :( Please try again.";
				}
			}).catch(function () {
				button.disabled = false;
				result.className = "bg-danger";
				result.textContent = "Failed :( Please try again.";
			});
		});
	});
}());
