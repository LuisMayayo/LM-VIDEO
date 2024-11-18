const apiUrl = "http://localhost:5028/api/pelicula";
const peliculasContainer = document.querySelector(".peliculas__container");

async function cargarPeliculas() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Error al obtener las películas");
    const peliculas = await response.json();
    mostrarPeliculas(peliculas);
  } catch (error) {
    console.error("Hubo un problema con la petición:", error);
  }
}

function mostrarPeliculas(peliculas) {
  peliculasContainer.innerHTML = "";
  peliculas.forEach((pelicula) => {
    // Usa la ruta relativa correcta para las imágenes
    const imagenUrl = pelicula.fotoUrl;

    const peliculaCard = document.createElement("article");
    peliculaCard.className = "peliculas__card";

    peliculaCard.innerHTML = `
      <img src="${imagenUrl}" alt="${pelicula.titulo}" class="peliculas__image">
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


cargarPeliculas();
