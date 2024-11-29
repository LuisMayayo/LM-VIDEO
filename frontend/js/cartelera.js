document.addEventListener("DOMContentLoaded", function () {
    console.log("Script cargado correctamente");
  
    // Navbar Toggle
    const toggleButton = document.querySelector(".navbar__toggle");
    const closeButton = document.querySelector(".navbar__close");
    const menu = document.querySelector(".navbar__menu");
  
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        if (menu) menu.classList.add("is-active");
      });
    }
  
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        if (menu) menu.classList.remove("is-active");
      });
    }
  
    const apiUrl = "http://localhost:5028/api/pelicula";
    const moviesContainer = document.querySelector(".movies__container");
  
    async function cargarPeliculas() {
      try {
        const response = await fetch(apiUrl);
  
        if (!response.ok) {
          throw new Error(`Error al obtener las películas: ${response.statusText}`);
        }
  
        const peliculas = await response.json();
        mostrarPeliculas(peliculas);
      } catch (error) {
        console.error("Error al cargar las películas:", error.message);
      }
    }
  
    function mostrarPeliculas(peliculas) {
      moviesContainer.innerHTML = "";
  
      peliculas.forEach((pelicula) => {
        const movieCard = document.createElement("article");
        movieCard.className = "movies__card";
        movieCard.innerHTML = `
          <img src="${pelicula.fotoUrl}" alt="${pelicula.titulo}" class="movies__image">
          <div class="movies__info">
            <h2 class="movies__info-title">${pelicula.titulo}</h2>
            <p class="movies__info-description">${pelicula.descripcion}</p>
            <p class="movies__info-duration"><strong>Duración:</strong> ${pelicula.duracion}</p>
            <button class="movies__info-button" data-id="${pelicula.id}">Ver Funciones</button>
          </div>
        `;
  
        moviesContainer.appendChild(movieCard);
      });
    }
  
    moviesContainer.addEventListener("click", (event) => {
      const button = event.target;
  
      if (button.classList.contains("movies__info-button")) {
        const movieId = button.getAttribute("data-id");
        if (!movieId) {
          console.error("El ID de la película no está definido.");
          return;
        }
  
        window.location.href = `../html/SalaPeliculaFuncion.html?id=${movieId}`;
      }
    });
  
    cargarPeliculas();
  });
  