document.addEventListener("DOMContentLoaded", function () {
    console.log("Script cargado correctamente");

    // Variables y elementos
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
    cargarAsientos();

    // Función para cargar los asientos desde la API
    async function cargarAsientos() {
        try {
            const apiUrl = `http://localhost:5028/api/asiento/Todos/${funcionId}`;
            console.log(`Obteniendo asientos desde la API: ${apiUrl}`);

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error al obtener los asientos: ${response.statusText}`);
            }

            const asientos = await response.json();
            console.log("Datos obtenidos de la API:", asientos);

            if (!Array.isArray(asientos)) {
                throw new Error("La respuesta de la API no es un array válido.");
            }

            mostrarAsientos(asientos); // Mostrar los asientos reales obtenidos de la API
        } catch (error) {
            console.error("Error al cargar los asientos:", error.message);
        }
    }

    // Función para mostrar los asientos en el DOM
    function mostrarAsientos(asientos) {
        console.log("Mostrando asientos...");
        if (!asientosContainer) {
            console.error("Contenedor de asientos no encontrado.");
            return;
        }

        asientosContainer.innerHTML = "";

        if (asientos.length === 0) {
            asientosContainer.innerHTML = "<p>No hay asientos disponibles.</p>";
            return;
        }

        asientos.forEach((asiento) => {
            console.log("Procesando asiento:", asiento);

            // Crear el elemento HTML para el asiento
            const div = document.createElement("div");
            div.className = `asiento ${asiento.disponible ? "disponible" : "ocupado"}`; // Evalúa como booleano
            div.textContent = asiento.Numero;
            div.id = `asiento-${asiento.Numero}`; // Asignar un ID único al asiento

            if (asiento.Disponible) {
                div.addEventListener("click", () => seleccionarAsiento(asiento.Numero, div));
            }

            asientosContainer.appendChild(div);
        });
    }

    // Manejar la selección de un asiento
    function seleccionarAsiento(numero, div) {
        console.log(`Seleccionando asiento: ${numero}`);
        if (asientosSeleccionados.includes(numero)) {
            // Deseleccionar asiento
            asientosSeleccionados = asientosSeleccionados.filter((n) => n !== numero);
            div.classList.remove("seleccionado");
            console.log(`Asiento deseleccionado: ${numero}`);
        } else {
            // Seleccionar asiento
            asientosSeleccionados.push(numero);
            div.classList.add("seleccionado");
            console.log(`Asiento seleccionado: ${numero}`);
        }

        console.log("Asientos seleccionados actualmente:", asientosSeleccionados);

        // Habilitar o deshabilitar el botón de reservar
        reservarButton.disabled = asientosSeleccionados.length === 0;
    }

    // Obtener parámetros de la URL
    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        const valor = params.get(nombre);
        console.log(`Parámetro obtenido de la URL - ${nombre}: ${valor}`);
        return valor;
    }
});
