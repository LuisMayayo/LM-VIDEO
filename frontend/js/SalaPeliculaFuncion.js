document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado.");
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

    // Función para obtener parámetros de la URL
    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        const valor = params.get(nombre);
        console.log(`Parámetro obtenido: ${nombre} = ${valor}`);
        return valor;
    }

    // Obtener el ID de la película desde la URL
    const peliculaId = obtenerParametroUrl("id");

    if (peliculaId) {
        obtenerPeliculaPorId(peliculaId);
        obtenerFuncionesPorPeliculaId(peliculaId);
    } else {
        console.error("No se recibió ningún ID en la URL.");
    }

    // Obtener información de la película
    async function obtenerPeliculaPorId(id) {
        const apiUrl = `http://localhost:5028/api/pelicula/${id}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error al obtener la película: ${response.statusText}`);
            const pelicula = await response.json();
            mostrarPelicula(pelicula);
        } catch (error) {
            console.error("Error al cargar los datos de la película:", error.message);
        }
    }

    // Obtener funciones por ID de película
    async function obtenerFuncionesPorPeliculaId(peliculaId) {
        const apiUrl = `http://localhost:5028/api/funcion/pelicula/${peliculaId}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error al obtener las funciones: ${response.statusText}`);
            const funciones = await response.json();
            mostrarFunciones(funciones);
        } catch (error) {
            console.error("Error al cargar las funciones:", error.message);
        }
    }

    // Mostrar la información de la película
    function mostrarPelicula(pelicula) {
        const peliculaContainer = document.querySelector(".pelicula");
        peliculaContainer.innerHTML = `
            <img src="${pelicula.fotoUrl}" alt="${pelicula.titulo}" class="pelicula__image">
            <div class="pelicula__info">
                <h1 class="pelicula__title">${pelicula.titulo}</h1>
                <p class="pelicula__description">${pelicula.descripcion}</p>
                <p class="pelicula__duration">Duración: ${pelicula.duracion}</p>
            </div>
        `;
    }

    // Mostrar funciones
    function mostrarFunciones(funciones) {
        const funcionesList = document.querySelector(".funciones__list");
        funcionesList.innerHTML = "";

        // Agrupar funciones por fecha
        const funcionesPorDia = funciones.reduce((acc, funcion) => {
            const fecha = new Date(funcion.fecha).toLocaleDateString();
            if (!acc[fecha]) {
                acc[fecha] = [];
            }
            acc[fecha].push(funcion);
            return acc;
        }, {});

        // Renderizar funciones por cada día
        Object.keys(funcionesPorDia).forEach((fecha) => {
            // Crear elemento del día
            const diaTitulo = document.createElement("h3");
            diaTitulo.className = "funciones__dia";
            diaTitulo.textContent = fecha;

            funcionesList.appendChild(diaTitulo);

            // Crear contenedor para las funciones del día
            const sesionesContainer = document.createElement("div");
            sesionesContainer.className = "funciones__sesiones";

            funcionesPorDia[fecha].forEach((funcion) => {
                const hora = funcion.hora.slice(0, 5); // Extraer solo "HH:mm"

                const funcionCard = document.createElement("a");
                funcionCard.className = "funcion";
                funcionCard.href = `../html/Butacas.html?funcionId=${funcion.id}&peliculaId=${peliculaId}`;
                funcionCard.innerHTML = `
                <div>
                    <span>${hora}</span> <!-- Hora de la función -->
                    <span>Sala ${funcion.salaId}</span>
                </div>
            `;

                sesionesContainer.appendChild(funcionCard);
            });

            funcionesList.appendChild(sesionesContainer);
        });
    }


});
