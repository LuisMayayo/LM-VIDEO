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
const items = Array.from(track.children);
const itemWidth = items[0].getBoundingClientRect().width;
const itemsPerSlide = 3;
let currentIndex = 0;

const totalSlides = Math.ceil(items.length / itemsPerSlide);

function updateCarousel() {
  const amountToMove = -(currentIndex * (itemWidth * itemsPerSlide));
  track.style.transform = `translateX(${amountToMove}px)`;
}

nextButton.addEventListener('click', () => {
  if (currentIndex < totalSlides - 1) {
    currentIndex++;
    updateCarousel();
  }
});

prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});
});