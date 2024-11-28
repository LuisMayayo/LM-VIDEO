document.addEventListener("DOMContentLoaded", async function () {
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

    console.log("DOM completamente cargado.");

    // Función para obtener parámetros de la URL
    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        const valor = params.get(nombre);
        console.log(`Parámetro obtenido: ${nombre} = ${valor}`);
        return valor;
    }

    // Obtener parámetros de la URL
    const peliculaId = obtenerParametroUrl("peliculaId");
    const funcionId = obtenerParametroUrl("funcionId");
    const asientosSeleccionados = obtenerParametroUrl("asientosSeleccionados");

    console.log("Parámetros obtenidos de la URL:", {
        peliculaId,
        funcionId,
        asientosSeleccionados,
    });

    if (!peliculaId || !funcionId) {
        console.error("Faltan parámetros necesarios en la URL.");
        return;
    }

    // Mostrar información de la película
    async function obtenerPelicula(peliculaId) {
        console.log(`Consultando información de la película con ID: ${peliculaId}`);
        const apiUrl = `http://localhost:5028/api/pelicula/${peliculaId}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error al obtener la película: ${response.statusText}`);
            const pelicula = await response.json();
            console.log("Datos de la película recibidos:", pelicula);

            // Mostrar los datos de la película
            document.querySelector(".pelicula__title").textContent = pelicula.titulo;
            document.querySelector(".pelicula__description").textContent = pelicula.descripcion;
            document.querySelector(".pelicula__duration").textContent = `Duración: ${pelicula.duracion} `;
            document.querySelector(".pelicula__image").src = pelicula.fotoUrl;
        } catch (error) {
            console.error("Error al cargar los datos de la película:", error.message);
        }
    }

    // Mostrar información de la función
    async function obtenerFuncion(funcionId) {
        console.log(`Consultando información de la función con ID: ${funcionId}`);
        const apiUrl = `http://localhost:5028/api/funcion/${funcionId}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error al obtener la función: ${response.statusText}`);
            const funcion = await response.json();
            console.log("Datos de la función recibidos:", funcion);

            // Convertir la hora de la función y mostrarla
            const hora = funcion.hora.slice(0, 5); // Solo tomar los primeros 5 caracteres (HH:mm)
            const horario = new Date(funcion.fecha).toLocaleDateString() + " " + hora;

            document.querySelector("#funcionHorario").textContent = `Horario: ${horario}`;
            document.querySelector("#funcionSala").textContent = `Sala: ${funcion.salaId}`;
        } catch (error) {
            console.error("Error al cargar los datos de la función:", error.message);
        }
    }

    // Mostrar asientos seleccionados y calcular el total a pagar
    function mostrarAsientos(asientos) {
        const asientosTexto = asientos ? asientos.split(",").join(", ") : "No se seleccionaron asientos.";
        document.querySelector("#asientosSeleccionados").textContent = asientosTexto;

        // Calcular el precio total
        const preciosArray = asientos ? asientos.split(",").map(() => 6.00) : []; // Precio fijo de 6.00 para cada asiento
        let total = preciosArray.reduce((sum, precio) => sum + precio, 0);

        // Mostrar el precio total en el DOM
        document.querySelector("#precioTotal").textContent = `Total: ${total.toFixed(2)}€`;
        console.log("Total calculado:", total);

        // Pasar el total a la URL para el ticket
        return total;
    }

    // Llamar a las funciones con los datos
    await obtenerPelicula(peliculaId);
    await obtenerFuncion(funcionId);
    const totalPagado = mostrarAsientos(asientosSeleccionados);

    // Validación de los campos del formulario
    function validarFormulario() {
        let esValido = true;
        const nombre = document.getElementById("nombre");
        const apellido = document.getElementById("apellido");
        const direccion = document.getElementById("direccion");
        const codigoPostal = document.getElementById("codigoPostal");
        const ciudad = document.getElementById("ciudad");
        const correoElectronico = document.getElementById("correoElectronico");
        const telefono = document.getElementById("telefono");

        // Validar nombre
        if (nombre.value.trim() === "") {
            alert("Por favor, ingresa tu nombre.");
            esValido = false;
        }

        // Validar apellido
        if (apellido.value.trim() === "") {
            alert("Por favor, ingresa tu apellido.");
            esValido = false;
        }

        // Validar dirección
        if (direccion.value.trim() === "") {
            alert("Por favor, ingresa tu dirección.");
            esValido = false;
        }

        // Validar código postal
        if (codigoPostal.value.trim() === "") {
            alert("Por favor, ingresa tu código postal.");
            esValido = false;
        }

        // Validar ciudad
        if (ciudad.value.trim() === "") {
            alert("Por favor, ingresa tu ciudad.");
            esValido = false;
        }

        // Validar correo electrónico
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(correoElectronico.value.trim())) {
            alert("Por favor, ingresa un correo electrónico válido.");
            esValido = false;
        }

        // Validar teléfono (9 dígitos o más)
        const telefonoRegex = /^[0-9]{9,}$/;
        if (!telefonoRegex.test(telefono.value.trim())) {
            alert("Por favor, ingresa un número de teléfono válido (9 dígitos o más).");
            esValido = false;
        }

        return esValido;
    }

    // Al hacer clic en el botón de pago
    document.getElementById("botonPago").addEventListener("click", async function () {
        // Validar formulario
        if (!validarFormulario()) {
            return; // Detener el envío si hay errores
        }

        const asientosSeleccionadosArray = obtenerParametroUrl("asientosSeleccionados") ? obtenerParametroUrl("asientosSeleccionados").split(",").map(Number) : [];

        const formData = {
            funcionId: obtenerParametroUrl("funcionId"),
            peliculaId: obtenerParametroUrl("peliculaId"),
            asientosSeleccionados: asientosSeleccionadosArray,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            direccion: document.getElementById("direccion").value,
            codigoPostal: document.getElementById("codigoPostal").value,
            ciudad: document.getElementById("ciudad").value,
            correoElectronico: document.getElementById("correoElectronico").value,
            telefono: document.getElementById("telefono").value,
            totalPagado: totalPagado, // Agregar el total pagado a los datos del pago
        };

        try {
            // Enviar la solicitud POST para procesar el pago
            const response = await fetch("http://localhost:5028/api/pagos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error al procesar el pago");

            const pago = await response.json();
            console.log("Pago registrado:", pago);

            // Redirigir a la página de ticket con el ID del pago
            window.location.href = `../html/ticket.html?pagoId=${pago.id}&totalPagado=${totalPagado}`;
        } catch (error) {
            console.error("Error en el pago:", error.message);
            alert("Hubo un problema al procesar el pago. Inténtalo de nuevo.");
        }
    });
});
