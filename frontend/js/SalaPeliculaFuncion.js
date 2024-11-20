document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado."); // Confirmación inicial

    const toggleButton = document.querySelector(".navbar__toggle");
    const closeButton = document.querySelector(".navbar__close");
    const menu = document.querySelector(".navbar__menu");

    if (toggleButton) {
        toggleButton.addEventListener("click", () => menu && menu.classList.add("is-active"));
    }

    if (closeButton) {
        closeButton.addEventListener("click", () => menu && menu.classList.remove("is-active"));
    }

    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        const valor = params.get(nombre);
        console.log(`Parámetro obtenido: ${nombre} = ${valor}`); // Para verificar el ID de la película
        return valor;
    }

    const peliculaId = obtenerParametroUrl("id");

    if (peliculaId) {
        const peliculaContainer = document.querySelector(".pelicula");
        const funcionesContainer = document.querySelector(".funciones__list");

        if (peliculaContainer) mostrarCargando(peliculaContainer);
        if (funcionesContainer) mostrarCargando(funcionesContainer);

        obtenerPeliculaPorId(peliculaId);
        obtenerFuncionesPorPeliculaId(peliculaId);
    } else {
        console.error("No se recibió ningún ID en la URL."); // Error crítico
    }

    async function obtenerPeliculaPorId(id) {
        const apiUrl = `http://localhost:5028/api/pelicula/${id}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error al obtener la película: ${response.statusText}`);
            }

            const pelicula = await response.json();
            console.log("Película mostrada en la web:", pelicula); // Muestra los datos de la película
            mostrarPelicula(pelicula);
        } catch (error) {
            mostrarError(".pelicula", "Error al cargar los datos de la película.");
        }
    }

    async function obtenerFuncionesPorPeliculaId(peliculaId) {
        const apiUrl = `http://localhost:5028/api/funcion/pelicula/${peliculaId}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error al obtener las funciones: ${response.statusText}`);
            }

            const funciones = await response.json();
            console.log("Funciones mostradas en la web:", funciones); // Muestra los datos de las funciones
            mostrarFunciones(funciones);
        } catch (error) {
            mostrarError(".funciones__list", "Error al cargar las funciones.");
        }
    }

    function mostrarPelicula(pelicula) {
        const peliculaContainer = document.querySelector(".pelicula");

        if (!peliculaContainer) return;

        peliculaContainer.innerHTML = `
            <img src="${pelicula.fotoUrl}" alt="${pelicula.titulo}" class="pelicula__image">
            <div class="pelicula__info">
              <h1 class="pelicula__title">${pelicula.titulo}</h1>
              <p class="pelicula__description">${pelicula.descripcion}</p>
              <p class="pelicula__duration"><strong>Duración:</strong> ${pelicula.duracion}</p>
            </div>
        `;
    }

    function mostrarFunciones(funciones) {
        const funcionesList = document.querySelector(".funciones__list");
    
        if (!funcionesList) {
            console.error("El contenedor de funciones no está definido.");
            return;
        }
    
        funcionesList.innerHTML = ""; // Limpiar contenido anterior
    
        funciones.forEach((funcion) => {
            // Crear el enlace que actuará como botón
            const funcionCard = document.createElement("a");
            funcionCard.className = "funcion";
            funcionCard.href = `../html/Butacas.html?funcionId=${funcion.id}`; // URL dinámica
            funcionCard.innerHTML = `
                <div>
                    <span><strong>${new Date(funcion.horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                    <span>S${funcion.salaId}</span>
                </div>
            `;
    
            // Añadir la tarjeta al contenedor
            funcionesList.appendChild(funcionCard);
        });
    }
    
    

    function mostrarCargando(contenedor) {
        contenedor.innerHTML = `<p>Cargando...</p>`;
    }

    function mostrarError(selector, mensaje) {
        const contenedor = document.querySelector(selector);
        if (contenedor) contenedor.innerHTML = `<p>${mensaje}</p>`;
    }
});
