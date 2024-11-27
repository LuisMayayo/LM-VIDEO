document.addEventListener("DOMContentLoaded", function () {
    const formPago = document.getElementById("form-pago");

    // Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const funcionId = params.get("funcionId");
    const peliculaId = params.get("peliculaId");
    const asientosSeleccionados = params.get("asientosSeleccionados");

    console.log("Datos obtenidos para el pago:", {
        funcionId,
        peliculaId,
        asientosSeleccionados
    });

    formPago.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Recopilar datos del formulario
        const datosCliente = {
            nombre: formPago.nombre.value,
            apellido: formPago.apellido.value,
            direccion: formPago.direccion.value,
            codigoPostal: formPago["codigo-postal"].value,
            ciudad: formPago.ciudad.value,
            correoElectronico: formPago["correo-electronico"].value,
            telefono: formPago.telefono.value
        };

        // Preparar el cuerpo del pago
        const datosPago = {
            funcionId: parseInt(funcionId),
            peliculaId: parseInt(peliculaId),
            asientosSeleccionados: asientosSeleccionados.split(",").map(Number),
            ...datosCliente
        };

        console.log("Enviando datos del pago:", datosPago);

        try {
            // Llamar a la API de pagos
            const response = await fetch("http://localhost:5028/api/pagos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosPago)
            });

            if (!response.ok) {
                throw new Error("Error al registrar el pago.");
            }

            const resultado = await response.json();
            alert("Pago registrado exitosamente.");
            console.log("Resultado del pago:", resultado);

            // Redirigir a una página de confirmación
            window.location.href = `/confirmacion-pago.html?pagoId=${resultado.id}`;
        } catch (error) {
            alert("Ocurrió un error al procesar el pago. Por favor, intenta nuevamente.");
            console.error("Error al enviar los datos del pago:", error.message);
        }
    });
});
