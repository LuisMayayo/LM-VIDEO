document.addEventListener("DOMContentLoaded", function () {
    const asientosContainer = document.getElementById("asientos");
    const reservarButton = document.getElementById("reservar");
    let asientosSeleccionados = []; // Almacena los asientos seleccionados
    const funcionId = obtenerParametroUrl("funcionId"); // Obtener el ID de la función desde la URL

    if (!funcionId) {
        alert("No se especificó la función. Por favor, selecciona una función e inténtalo nuevamente.");
        console.error("No se proporcionó el ID de la función.");
        return;
    }

    console.log(`Cargando asientos para la función: ${funcionId}`);
    cargarAsientos(); // Llamar a la función para cargar los asientos



    // Fetch para obtener todos los asientos de una función
    async function cargarAsientos() {
        const apiUrl = `http://localhost:5028/api/asiento/Todos/${funcionId}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Error al obtener los asientos");
            }

            const asientos = await response.json();
            console.log("Asientos obtenidos:", asientos);
            mostrarAsientos(asientos);
        } catch (error) {
            console.error("Error al cargar los asientos:", error.message);
        }
    }

    // Renderizar los asientos en el DOM
    function mostrarAsientos(asientos) {
        asientosContainer.innerHTML = ""; // Limpiar el contenedor
        asientos.forEach(asiento => {
            const asientoDiv = document.createElement("div");
            asientoDiv.className = `asiento ${asiento.Disponible === "Disponible" ? "disponible" : "ocupado"}`;
            asientoDiv.textContent = asiento.Numero;

            if (asiento.Disponible === "Disponible") {
                asientoDiv.addEventListener("click", () => seleccionarAsiento(asiento.Numero));
            }

            asientosContainer.appendChild(asientoDiv);
        });
    }

    // Manejar la selección de un asiento
    function seleccionarAsiento(numero) {
        if (asientosSeleccionados.includes(numero)) {
            // Si ya está seleccionado, lo deseleccionamos
            asientosSeleccionados = asientosSeleccionados.filter(n => n !== numero);
        } else {
            // Seleccionamos el asiento
            asientosSeleccionados.push(numero);
        }

        console.log("Asientos seleccionados:", asientosSeleccionados);

        // Actualizar estado del botón de reserva
        reservarButton.disabled = asientosSeleccionados.length === 0;

        // Actualizar el estilo de los asientos seleccionados
        actualizarEstiloSeleccionados();
    }

    function actualizarEstiloSeleccionados() {
        document.querySelectorAll(".asiento").forEach(asiento => {
            const numero = parseInt(asiento.textContent, 10);
            if (asientosSeleccionados.includes(numero)) {
                asiento.classList.add("seleccionado");
            } else {
                asiento.classList.remove("seleccionado");
            }
        });
    }

    // Enviar la reserva de los asientos seleccionados al servidor
    async function reservarAsientos() {
        const apiUrl = `http://localhost:5028/api/asiento/Elegir/${funcionId}`;

        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(asientosSeleccionados),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            console.log("Asientos reservados correctamente:", asientosSeleccionados);
            alert("Asientos reservados correctamente");
            asientosSeleccionados = []; // Limpiar la selección
            reservarButton.disabled = true; // Deshabilitar el botón
            cargarAsientos(); // Recargar asientos
        } catch (error) {
            console.error("Error al reservar asientos:", error.message);
            alert("Error al reservar los asientos: " + error.message);
        }
    }

    reservarButton.addEventListener("click", reservarAsientos);

    // Cargar asientos al inicio
    cargarAsientos();

    // Obtener parámetros de la URL
    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        return params.get(nombre);
    }
});
