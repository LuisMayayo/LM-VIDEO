document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado.");

    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        const valor = params.get(nombre);
        console.log(`Parámetro obtenido: ${nombre} = ${valor}`);
        return valor;
    }

    const peliculaId = obtenerParametroUrl("id");

    if (peliculaId) {
        obtenerPeliculaPorId(peliculaId);
        obtenerFuncionesPorPeliculaId(peliculaId);
    } else {
        console.error("No se recibió ningún ID en la URL.");
    }

    async function obtenerPeliculaPorId(id) {
        const apiUrl = `http://localhost:5028/api/pelicula/${id}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error al obtener la película: ${response.statusText}`);
            }

            const pelicula = await response.json();
            mostrarPelicula(pelicula);
        } catch (error) {
            console.error("Error al cargar los datos de la película:", error.message);
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
            mostrarFunciones(funciones);
        } catch (error) {
            console.error("Error al cargar las funciones:", error.message);
        }
    }

    function mostrarPelicula(pelicula) {
        const peliculaContainer = document.querySelector(".pelicula");
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
        funcionesList.innerHTML = "";

        funciones.forEach((funcion) => {
            const funcionCard = document.createElement("a");
            funcionCard.className = "funcion";
            funcionCard.href = `../html/Butacas.html?funcionId=${funcion.id}&peliculaId=${peliculaId}`;
            funcionCard.innerHTML = `
                <div>
                    <span><strong>${new Date(funcion.horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                    <span>Sala ${funcion.salaId}</span>
                </div>
            `;

            funcionesList.appendChild(funcionCard);
        });
    }
});
