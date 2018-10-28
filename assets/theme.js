// Inspired by: https://www.swiftbysundell.com
(function() {
  function applyTheme() {
    var theme = window.localStorage.getItem("theme");

    if (theme == null) {
      theme = "light";
    }

    document.body.classList.add(theme + "-theme");

    let selector = document.getElementById("theme-button-" + theme)

    if (selector != null) {
      selector.classList.add("theme-selected");
      selector.removeAttribute("href");
      selector.removeAttribute("onclick");
    }
  }

  document.addEventListener('DOMContentLoaded', applyTheme, false);
})();

function selectTheme(theme) {
  window.localStorage.setItem("theme", theme);
  location.reload();
  return false;
}
