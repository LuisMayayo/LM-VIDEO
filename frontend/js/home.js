document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.querySelector(".navbar__toggle");
    const menu = document.querySelector(".navbar__menu");
  
    toggleButton.addEventListener("click", () => {
      menu.classList.toggle("is-active");
    });
  });

  document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.querySelector(".navbar__toggle");
    const closeButton = document.querySelector(".navbar__close");
    const menu = document.querySelector(".navbar__menu");
  
    toggleButton.addEventListener("click", () => {
      menu.classList.add("is-active");
    });
  
    closeButton.addEventListener("click", () => {
      menu.classList.remove("is-active");
    });
  });
  
  
  
  
  