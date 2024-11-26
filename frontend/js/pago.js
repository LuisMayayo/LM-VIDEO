document.getElementById("pago-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const pedido = JSON.parse(localStorage.getItem("pedido"));

    if (!pedido) {
        alert("No hay datos del pedido.");
        return;
    }

    // Datos del cliente
    const nombreCliente = document.getElementById("nombre").value;
    const correoCliente = document.getElementById("correo").value;

    // Crear el payload
    const payload = {
        nombreCliente,
        correoCliente,
        pelicula: pedido.pelicula,
        funcion: pedido.funcion,
        asientos: pedido.asientos,
        montoTotal: pedido.precio,
        metodo: "Tarjeta de Crédito", // Método fijo por ahora
        transaccionExitosa: true
    };

    try {
        const response = await fetch("http://localhost:5028/api/pago", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Pago realizado con éxito.");
            localStorage.removeItem("pedido");
            window.location.href = "index.html"; // Redirigir a la página principal
        } else {
            const error = await response.json();
            alert(`Error en el pago: ${error.message}`);
        }
    } catch (err) {
        console.error("Error al realizar el pago:", err);
        alert("No se pudo realizar el pago. Inténtalo más tarde.");
    }
});
