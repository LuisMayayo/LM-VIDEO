document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado.");

    // Elementos del DOM
    const asientosContainer = document.getElementById("asientos");
    const reservarButton = document.getElementById("reservar");
    const seleccionadosLista = document.querySelector(".seleccionados__lista");
    const totalPagarContainer = document.getElementById("total-pagar");

    let asientosSeleccionados = [];
    let preciosSeleccionados = [];

    // Función para obtener parámetros de la URL
    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        const valor = params.get(nombre);
        console.log(`Parámetro obtenido de la URL: ${nombre} = ${valor}`); // Log del parámetro obtenido
        return valor;
    }

    // Obtener `funcionId` y `peliculaId` de la URL
    const funcionId = obtenerParametroUrl("funcionId");
    const peliculaId = obtenerParametroUrl("peliculaId");

    if (!funcionId || !peliculaId) {
        console.error("No se proporcionaron los parámetros necesarios en la URL.");
        alert("Faltan datos para cargar la página. Verifica la URL.");
        return;
    }

    console.log(`ID de la función: ${funcionId}, ID de la película: ${peliculaId}`); // Confirmación de IDs

    // Deshabilitar botón de reservar inicialmente
    reservarButton.disabled = true;

    // Cargar los asientos
    cargarAsientos();

    async function cargarAsientos() {
        const apiUrl = `http://localhost:5028/api/asiento/Todos/${funcionId}`;
        console.log(`Cargando asientos desde: ${apiUrl}`); // Log de la URL de la API

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error al cargar los asientos: ${response.statusText}`);
            const asientos = await response.json();
            console.log("Asientos obtenidos de la API:", asientos); // Log de los datos obtenidos
            mostrarAsientos(asientos);
        } catch (error) {
            console.error("Error al cargar los asientos:", error.message);
            alert("No se pudieron cargar los asientos. Intenta nuevamente.");
        }
    }

    function mostrarAsientos(asientos) {
        asientosContainer.innerHTML = "";
        console.log(`Mostrando ${asientos.length} asientos en el DOM.`); // Número de asientos

        if (asientos.length === 0) {
            console.warn("No hay asientos disponibles para esta función.");
            asientosContainer.innerHTML = "<p>No hay asientos disponibles.</p>";
            return;
        }

        asientos.forEach((asiento) => {
            const div = document.createElement("div");
            div.className = `asiento ${asiento.disponible ? "disponible" : "ocupado"}`;
            div.textContent = asiento.numero;

            if (asiento.disponible) {
                const precio = parseFloat(asiento.precio);
                div.addEventListener("click", () => seleccionarAsiento(asiento.numero, precio, div));
                console.log(`Asiento disponible agregado: Número = ${asiento.numero}, Precio = ${precio}`); // Log por asiento
            } else {
                console.log(`Asiento ocupado omitido: Número = ${asiento.numero}`); // Log de asiento ocupado
            }

            asientosContainer.appendChild(div);
        });
    }

    function seleccionarAsiento(numero, precio, div) {
        console.log(`Clic en asiento: Número = ${numero}, Precio = ${precio}`); // Log al hacer clic

        if (asientosSeleccionados.includes(numero)) {
            console.log(`Deseleccionando asiento: ${numero}`); // Log al deseleccionar
            asientosSeleccionados = asientosSeleccionados.filter((n) => n !== numero);
            preciosSeleccionados = preciosSeleccionados.filter((p) => p !== precio);
            div.classList.remove("seleccionado");
        } else {
            console.log(`Seleccionando asiento: ${numero}`); // Log al seleccionar
            asientosSeleccionados.push(numero);
            preciosSeleccionados.push(precio);
            div.classList.add("seleccionado");
        }

        console.log("Asientos seleccionados:", asientosSeleccionados); // Log de los asientos seleccionados
        console.log("Precios seleccionados:", preciosSeleccionados); // Log de los precios seleccionados

        actualizarAsientosSeleccionados();
        actualizarTotal();
        reservarButton.disabled = asientosSeleccionados.length === 0;
    }

    function actualizarAsientosSeleccionados() {
        seleccionadosLista.textContent = asientosSeleccionados.join(", ");
        console.log("Lista de asientos seleccionados actualizada en el DOM."); // Log de actualización del DOM
    }

    function actualizarTotal() {
        const total = preciosSeleccionados.reduce((sum, precio) => sum + precio, 0);
        totalPagarContainer.textContent = `Total: ${total.toFixed(2)}€`;
        console.log(`Total actualizado: ${total.toFixed(2)}€`); // Log del total actualizado
    }

    reservarButton.addEventListener("click", async () => {
        if (asientosSeleccionados.length === 0) {
            alert("Selecciona al menos un asiento.");
            return;
        }
    
        const apiUrl = `http://localhost:5028/api/asiento/Elegir/${funcionId}`;
        console.log("Enviando asientos seleccionados para reservar:", asientosSeleccionados);
    
        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(asientosSeleccionados),
            });
    
            if (!response.ok) {
                const error = await response.json();
                alert(`Error al reservar asientos: ${error.message || "Error desconocido"}`);
                console.log("Error al reservar asientos:", error);
                return;
            }
    
            alert("Asientos reservados con éxito.");
            console.log("Asientos reservados correctamente.");
    
            // Redirigir a la página de pago o confirmación
            const queryParams = new URLSearchParams({
                funcionId,
                peliculaId,
                asientosSeleccionados: asientosSeleccionados.join(","),
            }).toString();
    
            console.log("Redirigiendo a la página de pago con parámetros:", queryParams);
    
            window.location.href = `../html/pago.html?${queryParams}`; // Cambia la ruta según la estructura de tu proyecto
        } catch (error) {
            console.error("Error al realizar la reserva:", error.message);
            alert("Ocurrió un error al procesar la reserva. Intenta nuevamente.");
        }
    });
    
});
