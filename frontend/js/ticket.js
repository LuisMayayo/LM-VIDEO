document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM completamente cargado.");

    // Obtener el ID del pago y el total desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pagoId = urlParams.get("pagoId");
    const totalPagado = parseFloat(urlParams.get("totalPagado"));

    console.log("totalPagado desde URL:", totalPagado);

    if (!pagoId) {
        alert("ID de pago no encontrado.");
        return;
    }

    // Verificar que el totalPagado es un número válido
    if (isNaN(totalPagado)) {
        console.error("El totalPagado no es un número válido.");
        alert("Error: El total de pago no es válido.");
        return;
    }

    // Función para obtener el nombre de la película
    async function obtenerNombrePelicula(peliculaId) {
        const apiUrl = `http://localhost:5028/api/pelicula/${peliculaId}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error al obtener la película: ${response.statusText}`);
            const pelicula = await response.json();
            return pelicula.titulo;
        } catch (error) {
            console.error("Error al cargar el nombre de la película:", error.message);
            return "Desconocido";
        }
    }

    // Función para obtener detalles de la función (fecha y hora)
    async function obtenerDetallesFuncion(funcionId) {
        const apiUrl = `http://localhost:5028/api/funcion/${funcionId}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error al obtener la función: ${response.statusText}`);
            const funcion = await response.json();

            // Formatear fecha y hora
            const fecha = new Date(funcion.fecha).toLocaleDateString();
            const hora = funcion.hora.slice(0, 5); // Solo tomar los primeros 5 caracteres (HH:mm)
            return { fecha, hora, salaId: funcion.salaId };
        } catch (error) {
            console.error("Error al cargar los detalles de la función:", error.message);
            return { fecha: "Desconocida", hora: "Desconocida", salaId: "Desconocida" };
        }
    }

    try {
        // Obtener los detalles del pago
        const apiUrl = `http://localhost:5028/api/pagos/${pagoId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error("No se pudo cargar el ticket.");

        const pago = await response.json();
        console.log("Detalles del pago obtenidos:", pago);

        // Obtener el nombre de la película
        const nombrePelicula = await obtenerNombrePelicula(pago.peliculaId);

        // Obtener los detalles de la función
        const detallesFuncion = await obtenerDetallesFuncion(pago.funcionId);

        // Renderizar los datos en el ticket
        const ticketInfo = document.getElementById("ticketInfo");
        ticketInfo.innerHTML = `
            <h1 class="ticket__title">Ticket de Pago</h1>
            <p class="ticket__movie"><strong>Película:</strong> ${nombrePelicula}</p>
            <p><strong>Fecha:</strong> ${detallesFuncion.fecha}</p>
            <p><strong>Hora:</strong> ${detallesFuncion.hora}</p>
            <p><strong>Sala:</strong> ${detallesFuncion.salaId}</p>
            <p><strong>Asientos:</strong> ${pago.asientosSeleccionados.join(", ")}</p>
            <p><strong>Total Pagado:</strong> ${totalPagado.toFixed(2)}€</p>
            <h2>Datos del Cliente</h2>
            <p><strong>Nombre:</strong> ${pago.cliente.nombre} ${pago.cliente.apellido}</p>
            <p><strong>Dirección:</strong> ${pago.cliente.direccion}, ${pago.cliente.ciudad}, ${pago.cliente.codigoPostal}</p>
            <p><strong>Correo Electrónico:</strong> ${pago.cliente.correoElectronico}</p>
            <p><strong>Teléfono:</strong> ${pago.cliente.telefono}</p>
            <div class="ticket__actions">
              <button class="btn" onclick="window.location.href='home.html'">Volver al Inicio</button>
            </div>
        `;
    } catch (error) {
        console.error("Error al cargar el ticket:", error.message);
        alert("No se pudo cargar el ticket.");
    }
});
