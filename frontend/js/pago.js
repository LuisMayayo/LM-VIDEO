document.addEventListener("DOMContentLoaded", async function () {
    // Navbar Toggle
    const toggleButton = document.querySelector(".navbar__toggle");
    const closeButton = document.querySelector(".navbar__close");
    const menu = document.querySelector(".navbar__menu");

    if (toggleButton) {
        toggleButton.addEventListener("click", () => menu.classList.add("is-active"));
    }

    if (closeButton) {
        closeButton.addEventListener("click", () => menu.classList.remove("is-active"));
    }

    // Utilidades
    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        return params.get(nombre);
    }

    function obtenerAsientosSeleccionados(asientos) {
        return asientos ? asientos.split(",").map(Number) : [];
    }

    async function obtenerDatos(url, callback) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            const datos = await response.json();
            callback(datos);
        } catch (error) {
            console.error("Error al cargar datos:", error.message);
        }
    }

    // Parámetros de la URL
    const peliculaId = obtenerParametroUrl("peliculaId");
    const funcionId = obtenerParametroUrl("funcionId");
    const asientosSeleccionados = obtenerParametroUrl("asientosSeleccionados");

    if (!peliculaId || !funcionId) {
        alert("Faltan datos necesarios. Por favor, selecciona una película y un horario.");
        return;
    }

    // Mostrar datos de la película
    obtenerDatos(`http://localhost:5028/api/pelicula/${peliculaId}`, (pelicula) => {
        document.querySelector(".pelicula__title").textContent = pelicula.titulo;
        document.querySelector(".pelicula__description").textContent = pelicula.descripcion;
        document.querySelector(".pelicula__duration").textContent = `Duración: ${pelicula.duracion}`;
        document.querySelector(".pelicula__image").src = pelicula.fotoUrl;
    });

    // Mostrar datos de la función
    obtenerDatos(`http://localhost:5028/api/funcion/${funcionId}`, (funcion) => {
        const hora = funcion.hora.slice(0, 5);
        const horario = new Date(funcion.fecha).toLocaleDateString() + " " + hora;
        document.querySelector("#funcionHorario").textContent = `Horario: ${horario}`;
        document.querySelector("#funcionSala").textContent = `Sala: ${funcion.salaId}`;
    });

    // Mostrar asientos seleccionados y calcular total
    let totalPagado = 0;
    function mostrarAsientos(asientos) {
        const asientosTexto = asientos ? asientos.split(",").join(", ") : "No se seleccionaron asientos.";
        document.querySelector("#asientosSeleccionados").textContent = asientosTexto;

        const preciosArray = obtenerAsientosSeleccionados(asientos).map(() => 6.00);
        totalPagado = preciosArray.reduce((sum, precio) => sum + precio, 0);
        document.querySelector("#precioTotal").textContent = `Total: ${totalPagado.toFixed(2)}€`;
    }

    mostrarAsientos(asientosSeleccionados);

    // Validación del formulario
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const telefonoRegex = /^[0-9]{9,}$/;

    function validarFormulario() {
        const errores = [];

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const codigoPostal = document.getElementById("codigoPostal").value.trim();
        const ciudad = document.getElementById("ciudad").value.trim();
        const correoElectronico = document.getElementById("correoElectronico").value.trim();
        const telefono = document.getElementById("telefono").value.trim();

        // Validar nombre
        if (nombre === "") {
            errores.push("• Nombre");
        }

        // Validar apellido
        if (apellido === "") {
            errores.push("• Apellido");
        }

        // Validar dirección
        if (direccion === "") {
            errores.push("• Dirección");
        }

        // Validar código postal
        if (codigoPostal === "") {
            errores.push("• Código Postal");
        }

        // Validar ciudad
        if (ciudad === "") {
            errores.push("• Ciudad");
        }

        // Validar correo electrónico
        if (!emailRegex.test(correoElectronico)) {
            errores.push("• Correo Electrónico válido");
        }

        // Validar teléfono
        if (!telefonoRegex.test(telefono)) {
            errores.push("• Teléfono válido (9 dígitos o más)");
        }

        if (errores.length > 0) {
            const mensaje = "Por favor, corrige los siguientes campos:\n" + errores.join("\n");
            alert(mensaje);
            return false;
        }

        return true;
    }

    // Procesar el pago
    document.getElementById("botonPago").addEventListener("click", async function () {
        if (!validarFormulario()) return;

        const formData = {
            funcionId,
            peliculaId,
            asientosSeleccionados: obtenerAsientosSeleccionados(asientosSeleccionados),
            nombre: document.getElementById("nombre").value.trim(),
            apellido: document.getElementById("apellido").value.trim(),
            direccion: document.getElementById("direccion").value.trim(),
            codigoPostal: document.getElementById("codigoPostal").value.trim(),
            ciudad: document.getElementById("ciudad").value.trim(),
            correoElectronico: document.getElementById("correoElectronico").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            totalPagado,
        };

        try {
            const response = await fetch("http://localhost:5028/api/pagos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error al procesar el pago");

            const pago = await response.json();
            window.location.href = `../html/ticket.html?pagoId=${pago.id}&totalPagado=${totalPagado}`;
        } catch (error) {
            console.error("Error en el pago:", error.message);
            alert("Hubo un problema al procesar el pago. Inténtalo de nuevo.");
        }
    });
});
