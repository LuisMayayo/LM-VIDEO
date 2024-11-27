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
  const peliculasContainer = document.querySelector(".peliculas__container");

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
      peliculasContainer.innerHTML = "";

      peliculas.forEach((pelicula) => {
          const peliculaCard = document.createElement("article");
          peliculaCard.className = "peliculas__card";
          peliculaCard.innerHTML = `
              <img src="${pelicula.fotoUrl}" alt="${pelicula.titulo}" class="peliculas__image">
              <div class="peliculas__info">
                  <h2 class="peliculas__title">${pelicula.titulo}</h2>
                  <p class="peliculas__description">${pelicula.descripcion}</p>
                  <p class="peliculas__duration"><strong>Duración:</strong> ${pelicula.duracion}</p>
                  <button class="peliculas__button" data-id="${pelicula.id}">Ver Funciones</button>
              </div>
          `;

          peliculasContainer.appendChild(peliculaCard);
      });
  }

  peliculasContainer.addEventListener("click", (event) => {
      const button = event.target;

      if (button.classList.contains("peliculas__button")) {
          const peliculaId = button.getAttribute("data-id");
          if (!peliculaId) {
              console.error("El ID de la película no está definido.");
              return;
          }

          window.location.href = `../html/SalaPeliculaFuncion.html?id=${peliculaId}`;
      }
  });

  cargarPeliculas();
});
