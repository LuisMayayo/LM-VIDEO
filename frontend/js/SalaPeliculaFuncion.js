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

    // Función para obtener parámetros de la URL
    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        return params.get(nombre);
    }

    // Obtener el ID de la película
    const peliculaId = obtenerParametroUrl("id");

    if (peliculaId) {
        console.log(`El ID de la película es: ${peliculaId}`);
        obtenerPeliculaPorId(peliculaId); // Llama a la función para obtener la película
        obtenerFuncionesPorPeliculaId(peliculaId); // Llama a la función para obtener las funciones
    } else {
        console.error("No se recibió ningún ID en la URL.");
    }

    // Función para obtener datos de una película específica desde la API
    async function obtenerPeliculaPorId(id) {
        const apiUrl = `http://localhost:5028/api/pelicula/${id}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                console.error(`Error al obtener la película: ${response.status} ${response.statusText}`);
                return;
            }

            const pelicula = await response.json();
            mostrarPelicula(pelicula);
        } catch (error) {
            console.error("Error en la solicitud de la película:", error.message);
        }
    }

    // Función para mostrar los datos de la película en el DOM
    function mostrarPelicula(pelicula) {
        const peliculaContainer = document.querySelector(".pelicula");

        if (!peliculaContainer) {
            console.error("El contenedor de la película no está definido.");
            return;
        }

        peliculaContainer.innerHTML = `
        <img src="${pelicula.fotoUrl}" alt="${pelicula.titulo}" class="pelicula__image">
        <div class="pelicula__info">
          <h1 class="pelicula__title">${pelicula.titulo}</h1>
          <p class="pelicula__description">${pelicula.descripcion}</p>
          <p class="pelicula__duration"><strong>Duración:</strong> ${pelicula.duracion}</p>
        </div>
      `;
    }

    // Función para obtener funciones por el ID de la película
    async function obtenerFuncionesPorPeliculaId(peliculaId) {
        const apiUrl = `http://localhost:5028/api/funcion/pelicula/${peliculaId}`;
    
        try {
            const response = await fetch(apiUrl);
    
            if (!response.ok) {
                console.error(`Error al obtener las funciones: ${response.status} ${response.statusText}`);
                return;
            }
    
            const funciones = await response.json();
            console.log("Funciones obtenidas desde la API:", funciones);
    
            mostrarFunciones(funciones);
        } catch (error) {
            console.error("Error en la solicitud de las funciones:", error.message);
        }
    }
    
    

    // Función para mostrar las funciones en el DOM
    function mostrarFunciones(funciones) {
        const funcionesList = document.querySelector(".funciones__list");

        if (!funcionesList) {
            console.error("El contenedor de funciones no está definido.");
            return;
        }

        if (funciones.length === 0) {
            funcionesList.innerHTML = `<p>No hay funciones disponibles para esta película.</p>`;
            return;
        }

        funcionesList.innerHTML = funciones
            .map(
                (funcion) => `
            <div class="funcion">
              <p><strong>Sala:</strong> ${funcion.SalaId}</p>
              <p><strong>Horario:</strong> ${new Date(funcion.Horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          `
            )
            .join("");
    }

});
