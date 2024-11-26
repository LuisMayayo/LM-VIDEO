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
  const trackStyle = window.getComputedStyle(track);
  const gap = parseFloat(trackStyle.gap) || 0;
  const itemsPerSlide = 3;
  let currentIndex = 0;

  const totalSlides = Math.ceil(items.length / itemsPerSlide);
  const slideWidth = itemsPerSlide * itemWidth + gap * (itemsPerSlide - 1);

  function updateCarousel() {
    const amountToMove = -(currentIndex * slideWidth);
    track.style.transform = `translateX(${amountToMove}px)`;
  }

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });

});