document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado.");
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

    const asientosContainer = document.querySelector(".asientos__grid");
    const reservarButton = document.querySelector(".asientos__boton");
    const seleccionadosLista = document.querySelector(".asientos__seleccionados-lista");

    let asientosSeleccionados = []; // Array para guardar los números de los asientos seleccionados

    function obtenerParametroUrl(nombre) {
        const params = new URLSearchParams(window.location.search);
        return params.get(nombre);
    }

    const funcionId = obtenerParametroUrl("funcionId");
    const peliculaId = obtenerParametroUrl("peliculaId");

    if (!funcionId || !peliculaId) {
        alert("Faltan datos para cargar la página. Verifica la URL.");
        return;
    }

    // Deshabilitar botón de compra inicialmente
    reservarButton.disabled = true;

    cargarAsientos();

    async function cargarAsientos() {
        const apiUrl = `http://44.214.164.222:5028/api/asiento/Todos/${funcionId}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error al cargar los asientos: ${response.statusText}`);
            const asientos = await response.json();
            console.log(`Total de asientos cargados: ${asientos.length}`);
            mostrarAsientos(asientos);
        } catch (error) {
            console.error("Error al cargar los asientos:", error.message);
        }
    }

    function mostrarAsientos(asientos) {
        asientosContainer.innerHTML = "";

        if (asientos.length === 0) {
            asientosContainer.innerHTML = "<p>No hay asientos disponibles.</p>";
            return;
        }

        let asientosOcupados = 0;
        let asientosDisponibles = 0;

        asientos.forEach((asiento) => {
            const div = document.createElement("div");
            div.className = `asientos__grid__asiento ${asiento.disponible ? "asientos__grid__asiento--disponible" : "asientos__grid__asiento--ocupado"}`;
            div.textContent = asiento.numero;

            if (asiento.disponible) {
                asientosDisponibles++;
                div.addEventListener("click", () => seleccionarAsiento(asiento.numero, div));
            } else {
                asientosOcupados++;
            }

            asientosContainer.appendChild(div);
        });

        console.log(`Asientos disponibles: ${asientosDisponibles}`);
        console.log(`Asientos ocupados: ${asientosOcupados}`);
    }

    function seleccionarAsiento(numero, div) {
        if (asientosSeleccionados.includes(numero)) {
            asientosSeleccionados = asientosSeleccionados.filter((n) => n !== numero);
            div.classList.remove("asientos__grid__asiento--seleccionado");
        } else {
            asientosSeleccionados.push(numero);
            div.classList.add("asientos__grid__asiento--seleccionado");
        }

        console.log("Asientos seleccionados:", asientosSeleccionados);

        actualizarAsientosSeleccionados();
        actualizarBotonReservar(); // Actualiza el estado del botón
    }

    function actualizarAsientosSeleccionados() {
        seleccionadosLista.textContent = asientosSeleccionados.length > 0
            ? `${asientosSeleccionados.join(", ")}`
            : "No hay asientos seleccionados.";
    }

    function actualizarBotonReservar() {
        reservarButton.disabled = asientosSeleccionados.length === 0;
    }

    reservarButton.addEventListener("click", () => {
        if (asientosSeleccionados.length === 0) {
            alert("Selecciona al menos un asiento.");
            return;
        }

        // Redirección con parámetros a la siguiente página
        const queryParams = new URLSearchParams({
            funcionId,
            peliculaId,
            asientosSeleccionados: asientosSeleccionados.join(","),
        }).toString();

        console.log("Redirigiendo a la página de confirmación...");
        console.log("Parámetros enviados:", {
            funcionId,
            peliculaId,
            asientosSeleccionados,
        });

        window.location.href = `../html/pago.html?${queryParams}`;
    });
});
