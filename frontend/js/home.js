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

  // Carrusel
  const track = document.querySelector(".carousel__track");
  const items = Array.from(document.querySelectorAll(".carousel__item"));
  const nextButton = document.querySelector(".carousel__button--right");
  const prevButton = document.querySelector(".carousel__button--left");

  let currentIndex = 1;
  const itemWidth = items[0].offsetWidth + 10; // Incluye el margen en el cálculo

  // Clonar el primer y último elemento
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);

  // Añadir los clones al track
  track.appendChild(firstClone);
  track.insertBefore(lastClone, items[0]);

  // Actualizar la lista de ítems incluyendo los clones
  const updatedItems = Array.from(document.querySelectorAll(".carousel__item"));
  
  // Posicionar el carrusel en el primer elemento real
  track.style.transform = `translateX(${-itemWidth * currentIndex}px)`;

  // Función para mover el carrusel
  const updateCarousel = () => {
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(${-itemWidth * currentIndex}px)`;
  };

  // Botón siguiente
  nextButton.addEventListener("click", () => {
    currentIndex++;
    updateCarousel();
    if (currentIndex === updatedItems.length - 1) {
      setTimeout(() => {
        track.style.transition = "none";
        currentIndex = 1;
        track.style.transform = `translateX(${-itemWidth * currentIndex}px)`;
      }, 500); // Espera a que termine la animación
    }
  });

  // Botón anterior
  prevButton.addEventListener("click", () => {
    currentIndex--;
    updateCarousel();
    if (currentIndex === 0) {
      setTimeout(() => {
        track.style.transition = "none";
        currentIndex = updatedItems.length - 2;
        track.style.transform = `translateX(${-itemWidth * currentIndex}px)`;
      }, 500); // Espera a que termine la animación
    }
  });
});