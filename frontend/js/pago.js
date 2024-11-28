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
    const preciosSeleccionados = obtenerParametroUrl("preciosSeleccionados");

    console.log("Parámetros obtenidos de la URL:", {
        peliculaId,
        funcionId,
        asientosSeleccionados,
        preciosSeleccionados,
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
            document.querySelector(".pelicula__title").textContent = pelicula.titulo;
            document.querySelector(".pelicula__description").textContent = pelicula.descripcion;
            document.querySelector(".pelicula__duration").textContent = `Duración: ${pelicula.duracion}`;
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
        const preciosArray = preciosSeleccionados ? preciosSeleccionados.split(",") : [];
        let total = 0;

        preciosArray.forEach(precio => {
            total += parseFloat(precio);
        });

        // Mostrar el precio total en el DOM
        document.querySelector("#precioTotal").textContent = `Total: ${total.toFixed(2)}€`;
        console.log("Total calculado:", total);
    }

    // Llamar a las funciones con los datos
    await obtenerPelicula(peliculaId);
    await obtenerFuncion(funcionId);
    mostrarAsientos(asientosSeleccionados);

    document.getElementById("botonPago").addEventListener("click", async function () {
        const formData = {
          funcionId: obtenerParametroUrl("funcionId"),
          peliculaId: obtenerParametroUrl("peliculaId"),
          asientosSeleccionados: obtenerParametroUrl("asientosSeleccionados").split(",").map(Number),
          nombre: document.getElementById("nombre").value,
          apellido: document.getElementById("apellido").value,
          direccion: document.getElementById("direccion").value,
          codigoPostal: document.getElementById("codigoPostal").value,
          ciudad: document.getElementById("ciudad").value,
          correoElectronico: document.getElementById("correoElectronico").value,
          telefono: document.getElementById("telefono").value,
        };
      
        try {
          const response = await fetch("http://localhost:5028/api/pagos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
      
          if (!response.ok) throw new Error("Error al procesar el pago");
      
          const pago = await response.json();
          console.log("Pago registrado:", pago);
      
          // Redirigir a la página de ticket con el ID del pago
          window.location.href = `../html/ticket.html?pagoId=${pago.id}`;
        } catch (error) {
          console.error("Error en el pago:", error.message);
          alert("Hubo un problema al procesar el pago. Inténtalo de nuevo.");
        }
      });
      
});
