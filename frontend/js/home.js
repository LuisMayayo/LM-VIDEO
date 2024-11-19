document.addEventListener("DOMContentLoaded", function () {
  // Navbar Toggle
  const toggleButton = document.querySelector(".navbar__toggle");
  const closeButton = document.querySelector(".navbar__close");
  const menu = document.querySelector(".navbar__menu");

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      menu.classList.add("is-active");
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      menu.classList.remove("is-active");
    });
  }

  // Carousel
  const track = document.querySelector(".carousel__track");
  const items = Array.from(document.querySelectorAll(".carousel__item"));
  const nextButton = document.querySelector(".carousel__button--right");
  const prevButton = document.querySelector(".carousel__button--left");

  if (track && items.length && nextButton && prevButton) {
    const visibleItems = () => {
      // Detecta el número de imágenes visibles según el ancho de la ventana
      if (window.innerWidth >= 1024) return 5; // Desktop
      if (window.innerWidth >= 768) return 4; // Tablet
      return 2; // Móvil
    };

    let currentIndex = 0; // Índice actual
    const totalItems = items.length;
    let itemWidth = items[0].getBoundingClientRect().width;

    // Función para mover el carrusel
    function moveCarousel(index) {
      const offset = -index * itemWidth;
      track.style.transform = `translateX(${offset}px)`;
    }

    // Botón siguiente
    nextButton.addEventListener("click", () => {
      if (currentIndex < totalItems - visibleItems()) {
        currentIndex += visibleItems();
        moveCarousel(currentIndex);
      }
    });

    // Botón anterior
    prevButton.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= visibleItems();
        moveCarousel(currentIndex);
      }
    });

    // Ajustar tamaño dinámicamente
    window.addEventListener("resize", () => {
      itemWidth = items[0].getBoundingClientRect().width; // Recalcular ancho
      moveCarousel(currentIndex); // Recalcular posición al cambiar el tamaño de la ventana
    });
  }
});
