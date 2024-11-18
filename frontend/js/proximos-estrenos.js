document.addEventListener("DOMContentLoaded", function () {
    // Navbar Toggle
    const toggleButton = document.querySelector(".navbar__toggle");
    const closeButton = document.querySelector(".navbar__close");
    const menu = document.querySelector(".navbar__menu");

    toggleButton.addEventListener("click", () => {
        menu.classList.add("is-active");
    });

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            menu.classList.remove("is-active");
        });
    }
});