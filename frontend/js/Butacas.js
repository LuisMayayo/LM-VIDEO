document.addEventListener("DOMContentLoaded", function () {
    console.log("Script cargado correctamente");

    // Navbar Toggle
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

    // Variables de asientos
    const asientosContainer = document.getElementById("asientos");
    const reservarButton = document.getElementById("reservar");
    const seleccionadosLista = document.querySelector(".seleccionados__lista");
    let asientosSeleccionados = []; // Almacena los asientos seleccionados
    const funcionId = obtenerParametroUrl("funcionId"); // Obtener el ID de la función desde la URL

    // Deshabilitar botón de reservar inicialmente
    reservarButton.disabled = true;

    if (!funcionId) {
        alert("No se especificó la función. Por favor, selecciona una función e inténtalo nuevamente.");
        console.error("No se proporcionó el ID de la función.");
        return;
    }

    console.log(`ID de la función seleccionada: ${funcionId}`);

    // Cargar los asientos
    cargarAsientos();

    // Función para cargar asientos desde la API
    async function cargarAsientos() {
        try {
            const apiUrl = `http://localhost:5028/api/asiento/Todos/${funcionId}`;
            console.log(`Solicitando datos de asientos desde: ${apiUrl}`);

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error al obtener los asientos: ${response.statusText}`);
            }

            const asientos = await response.json();
            console.log("Datos de asientos obtenidos desde la API:", asientos);
            mostrarAsientos(asientos);
        } catch (error) {
            alert("Ocurrió un error al cargar los asientos. Por favor, intenta nuevamente.");
            console.error("Error al cargar los asientos:", error.message);
        }
    }

    // Función para mostrar los asientos en el DOM
    function mostrarAsientos(asientos) {
        console.log("Mostrando asientos en la página...");
        asientosContainer.innerHTML = "";

        if (asientos.length === 0) {
            console.warn("No hay asientos disponibles.");
            asientosContainer.innerHTML = "<p>No hay asientos disponibles.</p>";
            return;
        }

        asientos.forEach((asiento) => {
            console.log("Procesando asiento completo:", asiento);

            // Verificar que la propiedad 'numero' esté definida
            if (typeof asiento.numero === "undefined") {
                console.error("El campo 'numero' está undefined en este asiento:", asiento);
                return;
            }

            const div = document.createElement("div");
            div.className = `asiento ${asiento.disponible ? "disponible" : "ocupado"}`;
            div.textContent = asiento.numero; // Mostrar el número del asiento
            div.id = `asiento-${asiento.numero}`;

            if (asiento.disponible) {
                div.addEventListener("click", () => seleccionarAsiento(asiento.numero, div));
            }

            asientosContainer.appendChild(div);
        });

        console.log("Asientos mostrados correctamente.");
    }

    // Función para manejar la selección/deselección de un asiento
    function seleccionarAsiento(numero, div) {
        console.log(`Asiento clickeado: Número = ${numero}, Elemento =`, div);

        if (asientosSeleccionados.includes(numero)) {
            // Deseleccionar asiento
            console.log(`Deseleccionando asiento: ${numero}`);
            asientosSeleccionados = asientosSeleccionados.filter((n) => n !== numero);
            div.classList.remove("seleccionado");
        } else {
            // Seleccionar asiento
            console.log(`Seleccionando asiento: ${numero}`);
            asientosSeleccionados.push(numero);
            div.classList.add("seleccionado");
        }

        console.log("Asientos seleccionados actualmente:", asientosSeleccionados);
        actualizarAsientosSeleccionados();

        // Habilitar/deshabilitar el botón de reservar
        reservarButton.disabled = asientosSeleccionados.length === 0;
    }

    // Función para actualizar la lista de asientos seleccionados en el DOM
    function actualizarAsientosSeleccionados() {
        console.log("Actualizando la lista de asientos seleccionados...");
        seleccionadosLista.textContent = asientosSeleccionados.join(", ");
    }

    // Función para manejar el evento de compra
    reservarButton.addEventListener("click", async function () {
        console.log("Iniciando el proceso de reserva...");
        if (asientosSeleccionados.length === 0) {
            console.warn("No hay asientos seleccionados para reservar.");
            return;
        }

        try {
            const apiUrl = `http://localhost:5028/api/asiento/Elegir/${funcionId}`;
            console.log(`Enviando datos de reserva a la API: ${apiUrl}`);
            console.log("Asientos a reservar:", asientosSeleccionados);

            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(asientosSeleccionados),
            });

            if (!response.ok) {
                throw new Error(`Error al reservar los asientos: ${response.statusText}`);
            }

            alert("¡Reserva exitosa!");
            console.log("Reserva completada con éxito.");

            // Limpiar la selección y recargar los asientos
            asientosSeleccionados = [];
            actualizarAsientosSeleccionados();
            cargarAsientos();
        } catch (error) {
            alert("Ocurrió un error al procesar la reserva. Por favor, intenta nuevamente.");
            console.error("Error al reservar los asientos:", error.message);
        }
    });

    // Función para obtener parámetros de la URL
    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        const valor = params.get(nombre);
        console.log(`Parámetro obtenido de la URL: ${nombre} = ${valor}`);
        return valor;
    }
});
