document.addEventListener("DOMContentLoaded", async function () {
    const pagoId = new URLSearchParams(window.location.search).get("pagoId");
    if (!pagoId) {
        alert("ID de pago no encontrado.");
        return;
    }

    async function obtenerNombrePelicula(peliculaId) {
        const apiUrl = `http://localhost:5028/api/pelicula/${peliculaId}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error al obtener la película: ${response.statusText}`);
            const pelicula = await response.json();
            return pelicula.titulo; // Devuelve el nombre de la película
        } catch (error) {
            console.error("Error al cargar el nombre de la película:", error.message);
            return "Desconocido"; // Valor predeterminado si falla la solicitud
        }
    }

    function calcularPrecioTotal(asientos) {
        const precioPorAsiento = 8; // Precio fijo por asiento
        return asientos.length * precioPorAsiento;
    }

    try {
        const response = await fetch(`http://localhost:5028/api/pagos/${pagoId}`);
        if (!response.ok) throw new Error("No se pudo cargar el ticket.");

        const pago = await response.json();
        console.log("Detalles del pago:", pago);

        const nombrePelicula = await obtenerNombrePelicula(pago.peliculaId);

        const ticketInfo = document.getElementById("ticketInfo");
        ticketInfo.innerHTML = `
            <p class="ticket__movie">Película: <strong>${nombrePelicula}</strong></p>
            <p><strong>Nombre:</strong> ${pago.cliente.nombre} ${pago.cliente.apellido}</p>
            <p><strong>Dirección:</strong> ${pago.cliente.direccion}, ${pago.cliente.ciudad}, ${pago.cliente.codigoPostal}</p>
            <p><strong>Teléfono:</strong> ${pago.cliente.telefono}</p>
            <p><strong>Correo Electrónico:</strong> ${pago.cliente.correoElectronico}</p>
            <p><strong>Función:</strong> Sala ${pago.funcionId}</p>
            <p><strong>Asientos:</strong> ${pago.asientosSeleccionados.join(", ")}</p>
            <p class="ticket__price">Total Pagado: <strong>${calcularPrecioTotal(pago.asientosSeleccionados)}€</strong></p>
        `;
    } catch (error) {
        console.error("Error al cargar el ticket:", error.message);
        alert("No se pudo cargar el ticket.");
    }
});
