document.addEventListener("DOMContentLoaded", function () {
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

  // API URL y contenedor de las películas
  const apiUrl = "http://localhost:5028/api/pelicula";
  const peliculasContainer = document.querySelector(".peliculas__container");

  async function cargarPeliculas() {
    try {
      const response = await fetch(apiUrl);

      // Verificar si la respuesta es válida
      if (!response.ok) {
        console.error(`Error al obtener las películas: ${response.status} ${response.statusText}`);
        return;
      }

      const peliculas = await response.json();
      mostrarPeliculas(peliculas);
    } catch (error) {
      console.error("Error en la petición a la API:", error.message);
    }
  }

  function mostrarPeliculas(peliculas) {
    // Validar que el contenedor de películas exista
    if (!peliculasContainer) {
      console.error("El contenedor de películas no está definido.");
      return;
    }

    peliculasContainer.innerHTML = ""; // Limpia el contenedor antes de cargar películas
    peliculas.forEach((pelicula) => {
      // Crear elemento para la tarjeta de película
      const peliculaCard = document.createElement("article");
      peliculaCard.className = "peliculas__card";

      // Agregar contenido a la tarjeta
      peliculaCard.innerHTML = `
        <img src="${pelicula.fotoUrl}" alt="${pelicula.titulo}" class="peliculas__image">
        <div class="peliculas__info">
          <h2 class="peliculas__title">${pelicula.titulo}</h2>
          <p class="peliculas__description">${pelicula.descripcion}</p>
          <p class="peliculas__duration"><strong>Duración:</strong> ${pelicula.duracion}</p>
          <a href="#" class="peliculas__button" data-id="${pelicula.id}">Entrar</a>
        </div>
      `;

      // Añadir la tarjeta al contenedor
      peliculasContainer.appendChild(peliculaCard);
    });
  }

  // Evento para capturar clics en los botones de las tarjetas
  peliculasContainer.addEventListener("click", (event) => {
    const button = event.target;

    // Verifica si el elemento clicado es un botón con la clase 'peliculas__button'
    if (button.classList.contains("peliculas__button")) {
      // Obtén el ID de la película desde el atributo data-id del botón
      const peliculaId = button.getAttribute("data-id");

      if (!peliculaId) {
        console.error("El ID de la película no está definido.");
        return;
      }

      // Redirige a la página con el ID de la película como parámetro en la URL
      window.location.href = `../html/SalaPeliculaFuncion.html?id=${peliculaId}`;
    }
  });

  // Llamar a la función para cargar las películas
  cargarPeliculas();
});
