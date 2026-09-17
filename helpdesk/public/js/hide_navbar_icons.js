// White-label the desk navbar: hide Frappe-branded menu items (Support,
// About, Reload) that this deployment does not want end users seeing.
//
// The v16 desk navbar/context menu is not driven by Navbar Settings data
// (frappe.boot.navbar_settings.help_dropdown comes back empty), and it
// re-renders the menu DOM on every open - so this hides by icon via a
// MutationObserver instead of a one-time query.
//
// Deliberately does not depend on frappe.ready - this script can load on
// pages (e.g. /login) before frappe.ready is defined, plain DOM readiness
// is all it actually needs.
(function () {
	const HIDE_ICONS = ["#icon-support", "#icon-info", "#icon-rotate-ccw"];

	function hideItems() {
		HIDE_ICONS.forEach(icon => {
			document.querySelectorAll(
				`.frappe-menu.context-menu .dropdown-menu-item:has(use[href="${icon}"])`
			).forEach(el => {
				el.style.display = "none";
			});
		});
	}

	function init() {
		hideItems();

		// Re-apply whenever the menu is re-rendered (v16 rebuilds it on every open)
		new MutationObserver(hideItems).observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
