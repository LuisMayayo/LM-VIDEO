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
    const totalPagarContainer = document.getElementById("total-pagar"); // Nuevo contenedor para el total
    let asientosSeleccionados = []; // Almacena los asientos seleccionados
    let preciosSeleccionados = []; // Nuevo: Almacena los precios de los asientos seleccionados
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

            if (typeof asiento.numero === "undefined") {
                console.error("El campo 'numero' está undefined en este asiento:", asiento);
                return;
            }

            const div = document.createElement("div");
            div.className = `asiento ${asiento.disponible ? "disponible" : "ocupado"}`;
            div.textContent = asiento.numero; // Mostrar el número del asiento
            div.id = `asiento-${asiento.numero}`;

            if (asiento.disponible) {
                const precio = parseFloat(asiento.precio); // Asegúrate de convertir el precio a número
                if (isNaN(precio)) {
                    console.error(`El precio del asiento ${asiento.numero} no es válido:`, asiento.precio);
                    return;
                }
                div.addEventListener("click", () => seleccionarAsiento(asiento.numero, precio, div));
            }
            

            asientosContainer.appendChild(div);
        });

        console.log("Asientos mostrados correctamente.");
    }

    // Función para manejar la selección/deselección de un asiento
    function seleccionarAsiento(numero, precio, div) {
        console.log(`Asiento clickeado: Número = ${numero}, Precio = ${precio}, Elemento =`, div);

        if (asientosSeleccionados.includes(numero)) {
            // Deseleccionar asiento
            console.log(`Deseleccionando asiento: ${numero}`);
            asientosSeleccionados = asientosSeleccionados.filter((n) => n !== numero);
            preciosSeleccionados = preciosSeleccionados.filter((p) => p !== precio); // Remover el precio
            div.classList.remove("seleccionado");
        } else {
            // Seleccionar asiento
            console.log(`Seleccionando asiento: ${numero}`);
            asientosSeleccionados.push(numero);
            preciosSeleccionados.push(precio); // Agregar el precio
            div.classList.add("seleccionado");
        }

        console.log("Asientos seleccionados actualmente:", asientosSeleccionados);
        console.log("Precios seleccionados actualmente:", preciosSeleccionados);
        actualizarAsientosSeleccionados();
        actualizarTotal(); // Nuevo

        // Habilitar/deshabilitar el botón de reservar
        reservarButton.disabled = asientosSeleccionados.length === 0;
    }

    // Función para actualizar la lista de asientos seleccionados en el DOM
    function actualizarAsientosSeleccionados() {
        console.log("Actualizando la lista de asientos seleccionados...");
        seleccionadosLista.textContent = asientosSeleccionados.join(", ");
    }

    // Nuevo: Función para actualizar el total a pagar
    function actualizarTotal() {
        const total = preciosSeleccionados.reduce((sum, precio) => {
            // Asegúrate de que el precio sea un número
            return sum + (typeof precio === "number" ? precio : 0);
        }, 0);
    
        // Formatear el total como moneda en euros
        const totalFormateado = new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR"
        }).format(total);
    
        totalPagarContainer.textContent = `Total a pagar: ${totalFormateado}`;
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
            preciosSeleccionados = [];
            actualizarAsientosSeleccionados();
            actualizarTotal(); // Actualizamos el total
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
