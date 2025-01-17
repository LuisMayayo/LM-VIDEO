document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado.");
    const toggleButton = document.querySelector(".navbar__toggle");
    const closeButton = document.querySelector(".navbar__close");
    const menu = document.querySelector(".navbar__menu");

    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            console.log("Menú desplegado.");
            menu.classList.add("is-active");
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            console.log("Menú cerrado.");
            menu.classList.remove("is-active");
        });
    }

    // Función para obtener parámetros de la URL
    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        const valor = params.get(nombre);
        console.log(`Parámetro obtenido de la URL: ${nombre} = ${valor}`);
        return valor;
    }

    // Obtener el ID de la película desde la URL
    const peliculaId = obtenerParametroUrl("id");
    console.log(`ID de la película obtenido: ${peliculaId}`);

    if (peliculaId) {
        console.log("Iniciando la obtención de datos para la película...");
        obtenerPeliculaPorId(peliculaId);
        obtenerFuncionesPorPeliculaId(peliculaId);
    } else {
        console.error("No se recibió ningún ID en la URL.");
    }

    // Obtener información de la película
    async function obtenerPeliculaPorId(id) {
        const apiUrl = `http://localhost:5028/api/pelicula/${id}`;
        console.log(`Llamando a la API de película con URL: ${apiUrl}`);

        try {
            const response = await fetch(apiUrl);
            console.log("Respuesta de la API de película:", response);
            if (!response.ok) throw new Error(`Error al obtener la película: ${response.statusText}`);
            const pelicula = await response.json();
            console.log("Datos de la película recibidos:", pelicula);
            mostrarPelicula(pelicula);
        } catch (error) {
            console.error("Error al cargar los datos de la película:", error.message);
        }
    }

    // Obtener funciones por ID de película
    async function obtenerFuncionesPorPeliculaId(peliculaId) {
        const apiUrl = `http://localhost:5028/api/funcion/pelicula/${peliculaId}`;
        console.log(`Llamando a la API de funciones con URL: ${apiUrl}`);

        try {
            const response = await fetch(apiUrl);
            console.log("Respuesta de la API de funciones:", response);
            if (!response.ok) throw new Error(`Error al obtener las funciones: ${response.statusText}`);
            const funciones = await response.json();
            console.log("Funciones recibidas:", funciones);
            mostrarFunciones(funciones);
        } catch (error) {
            console.error("Error al cargar las funciones:", error.message);
        }
    }

    // Mostrar la información de la película
    function mostrarPelicula(pelicula) {
        console.log("Mostrando los datos de la película en el DOM.");
        const peliculaContainer = document.querySelector(".pelicula");
        const mainElement = document.querySelector("main");

        // Configura el contenido de la película
        peliculaContainer.innerHTML = `
        <img src="${pelicula.fotoUrl}" alt="${pelicula.titulo}" class="pelicula__image">
        <div class="pelicula__info">
            <h1 class="pelicula__title">${pelicula.titulo}</h1>
            <p class="pelicula__description">${pelicula.descripcion}</p>
            <p class="pelicula__duration">Duración: ${pelicula.duracion}</p>
        </div>
    `;

        // Establece la imagen de fondo en el <main>
        if (mainElement) {
            mainElement.style.backgroundImage = `url(${pelicula.fotoUrl})`;
            console.log(`Imagen de fondo establecida en el <main>: ${pelicula.fotoUrl}`);
        }
    }

    // Mostrar funciones
    function mostrarFunciones(funciones) {
        console.log("Mostrando funciones en el DOM.");
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
        console.log("Funciones agrupadas por día:", funcionesPorDia);

        // Renderizar funciones por cada día
        Object.keys(funcionesPorDia).forEach((fecha) => {
            console.log(`Renderizando funciones para el día: ${fecha}`);
            const diaTitulo = document.createElement("h3");
            diaTitulo.className = "funciones__dia";
            diaTitulo.textContent = fecha;

            funcionesList.appendChild(diaTitulo);

            // Crear contenedor para las funciones del día
            const sesionesContainer = document.createElement("div");
            sesionesContainer.className = "funciones__sesiones";

            funcionesPorDia[fecha].forEach((funcion) => {
                console.log(`Renderizando función: ID=${funcion.id}, Sala=${funcion.salaId}, Hora=${funcion.hora}`);
                const hora = funcion.hora.slice(0, 5); // Extraer solo "HH:mm"

                const funcionCard = document.createElement("a");
                funcionCard.className = "funcion";
                funcionCard.href = `../html/Butacas.html?funcionId=${funcion.id}&peliculaId=${peliculaId}`;
                funcionCard.innerHTML = `
                <div>
                    <span>${hora}</span>
                    <span>Sala ${funcion.salaId}</span>
                </div>
            `;

                sesionesContainer.appendChild(funcionCard);
            });

            funcionesList.appendChild(sesionesContainer);
        });
    }
});
