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
   const items = document.querySelectorAll(".carousel__item");
   const nextButton = document.querySelector(".carousel__button--right");
   const prevButton = document.querySelector(".carousel__button--left");
 
   let currentIndex = 0;
 
   // Función para mover el carrusel
   const updateCarousel = () => {
     const itemWidth = items[0].offsetWidth + 20; // Ajusta el ancho de cada ítem con el margen
     const offset = -currentIndex * itemWidth;
     track.style.transform = `translateX(${offset}px)`;
   };
 
   // Botón siguiente
   nextButton.addEventListener("click", () => {
     currentIndex = (currentIndex + 1) % items.length; // Ciclo al principio si se excede
     updateCarousel();
   });
 
   // Botón anterior
   prevButton.addEventListener("click", () => {
     currentIndex = (currentIndex - 1 + items.length) % items.length; // Ciclo al final si es menor a 0
     updateCarousel();
   });
 
   // Configuración inicial
   updateCarousel();
 });