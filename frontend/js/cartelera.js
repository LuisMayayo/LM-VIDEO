// URL del endpoint de la API
const apiUrl = "http://localhost:5000/api/pelicula";

// Contenedor donde se mostrarán las películas
const peliculasContainer = document.querySelector(".peliculas__container");

// Función para obtener las películas desde la API
async function cargarPeliculas() {
  try {
    const response = await fetch(apiUrl); // Hacemos la petición GET
    if (!response.ok) {
      throw new Error("Error al obtener las películas");
    }
    const peliculas = await response.json(); // Convertimos la respuesta a JSON
    mostrarPeliculas(peliculas); // Llamamos a la función que muestra las películas
  } catch (error) {
    console.error("Hubo un problema con la petición:", error);
  }
}

// Función para renderizar las películas en el DOM
function mostrarPeliculas(peliculas) {
  peliculasContainer.innerHTML = ""; // Limpiamos el contenedor
  peliculas.forEach((pelicula) => {
    // Creamos los elementos HTML para cada película
    const peliculaCard = document.createElement("article");
    peliculaCard.className = "peliculas__card";

    peliculaCard.innerHTML = `
      <img src="${pelicula.fotoUrl}" alt="${pelicula.titulo}" class="peliculas__image">
      <div class="peliculas__info">
        <h2 class="peliculas__title">${pelicula.titulo}</h2>
        <p class="peliculas__description">${pelicula.descripcion}</p>
        <p class="peliculas__duration"><strong>Duración:</strong> ${pelicula.duracion}</p>
        <a href="#" class="peliculas__button">Entrar</a>
      </div>
    `;

    peliculasContainer.appendChild(peliculaCard);
  });
}

// Llamamos a la función al cargar la página
cargarPeliculas();
