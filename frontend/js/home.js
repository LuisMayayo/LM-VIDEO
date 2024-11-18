document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel__track");
  const items = Array.from(document.querySelectorAll(".carousel__item"));
  const nextButton = document.querySelector(".carousel__button--right");
  const prevButton = document.querySelector(".carousel__button--left");

  const visibleItems = () => {
    // Detecta el número de imágenes visibles según el ancho de la ventana
    if (window.innerWidth >= 1024) return 5; // Desktop
    if (window.innerWidth >= 768) return 4; // Tablet
    return 2; // Móvil
  };

  let currentIndex = 0; // Índice actual
  const totalItems = items.length;
  const moveBy = visibleItems(); // Cuántas imágenes desplazar
  const itemWidth = items[0].getBoundingClientRect().width;

  // Función para mover el carrusel
  function moveCarousel(index) {
    const offset = -index * itemWidth;
    track.style.transform = `translateX(${offset}px)`;
  }

  // Botón siguiente
  nextButton.addEventListener("click", () => {
    if (currentIndex < totalItems - moveBy) {
      currentIndex += moveBy;
      moveCarousel(currentIndex);
    }
  });

  // Botón anterior
  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= moveBy;
      moveCarousel(currentIndex);
    }
  });

  // Ajustar tamaño dinámicamente
  window.addEventListener("resize", () => {
    moveCarousel(currentIndex); // Recalcular posición al cambiar el tamaño de la ventana
  });
});
