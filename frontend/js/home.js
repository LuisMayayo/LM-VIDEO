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

  // Clase Carousel
  const track = document.querySelector('.carousel-track');
  const prevButton = document.querySelector('.carousel-control.prev');
  const nextButton = document.querySelector('.carousel-control.next');
  
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.carousel-item').length;
  const slidesPerView = 3;
  
  const moveCarousel = () => {
    const slideWidth = document.querySelector('.carousel-item').offsetWidth;
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  };
  
  // Evento para el botón "Anterior"
  prevButton.addEventListener('click', () => {
    currentSlide--;
    if (currentSlide < 0) {
      currentSlide = totalSlides - slidesPerView;
    }
    moveCarousel();
  });
  
  // Evento para el botón "Siguiente"
  nextButton.addEventListener('click', () => {
    currentSlide++;
    if (currentSlide > totalSlides - slidesPerView) {
      currentSlide = 0;
    }
    moveCarousel();
  });
  
  // Ajustar el carrusel en caso de redimensionar la ventana
  window.addEventListener('resize', moveCarousel);  
});