document.addEventListener("DOMContentLoaded", () => {
    let nuevoUsuario = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];

    const registroForm = () => {
        const nombre = document.getElementById("nombreReg").value;
        const contraseña = document.getElementById("passReg").value;
        const edad = parseInt(document.getElementById("edad").value);
        const localidad = document.getElementById("localidad").value;
        const mensajeErrorNombre = document.getElementById("mensajeErrorNombre");
        const mensajeErrorPass = document.getElementById("mensajeErrorPass");
        const mensajeErrorEdad = document.getElementById("mensajeErrorEdad");
        const mensajeErrorLocalidad = document.getElementById("mensajeErrorLocalidad");

        if (nombre.trim() === '' || contraseña.trim() === '' || isNaN(edad) || localidad.trim() === '') {
            mensajeErrorNombre.classList.add("invisible");
            mensajeErrorPass.classList.add("invisible");
            mensajeErrorEdad.classList.add("invisible");
            mensajeErrorLocalidad.classList.add("invisible");
            return;
        }

        let isValid = true;
        if (nombre.length < 4) {
            mensajeErrorNombre.classList.remove("invisible");
            isValid = false;
        } else {
            mensajeErrorNombre.classList.add("invisible");
        }

        if (contraseña.length < 8) {
            mensajeErrorPass.classList.remove("invisible");
            isValid = false;
        } else {
            mensajeErrorPass.classList.add("invisible");
        }

        if (edad < 18) {
            mensajeErrorEdad.classList.remove("invisible");
            isValid = false;
        } else {
            mensajeErrorEdad.classList.add("invisible");
        }

        if (!localidad.match(/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]*$/)) {
            mensajeErrorLocalidad.classList.remove("invisible");
            isValid = false;
        } else {
            mensajeErrorLocalidad.classList.add("invisible");
        }

        if (!isValid) {
            return;
        }

        nuevoUsuario.push({ nombre, contraseña, edad, localidad });
        localStorage.setItem("nuevoUsuario", JSON.stringify(nuevoUsuario));
        window.location.href = "./index.html";
    };

    const loginForm = () => {
        const nombre = document.getElementById("nombre").value;
        const contraseña = document.getElementById("pass").value;
        const mensajeErrorUsuario = document.getElementById("mensajeErrorUsuario");
        const mensajeErrorCont = document.getElementById("mensajeErrorCont");

        if (nombre.trim() === '' || contraseña.trim() === '') {
            mensajeErrorUsuario.classList.add("invisible");
            mensajeErrorCont.classList.add("invisible");
            return;
        }

        let usuario = nuevoUsuario.find(user => user.nombre === nombre);

        if (usuario) {
            if (usuario.contraseña === contraseña) {
                window.location.href = "./index.html";
            } else {
                mensajeErrorCont.classList.remove("invisible");
                mensajeErrorUsuario.classList.add("invisible");
            }
        } else {
            mensajeErrorUsuario.classList.remove("invisible");
            mensajeErrorCont.classList.add("invisible");
        }

        return false;
    };

    const realizarCompra = (event) => {
        event.preventDefault();

        const cantidad = parseFloat(document.getElementById("cantidadCompra").value);
        const criptoSeleccionada = document.getElementById("criptoCompra").value;
        const metodoPago = document.getElementById("metodoPagoCompra").value;

        let cotizacion;
        if (criptoSeleccionada === "bitcoin") {
            cotizacion = 59337;
        } else if (criptoSeleccionada === "ethereum") {
            cotizacion = 3253;
        } else if (criptoSeleccionada === "binance coin") {
            cotizacion = 542.55;
        } else if (criptoSeleccionada === "solana") {
            cotizacion = 0.69;
        } else if (criptoSeleccionada === "ripple") {
            cotizacion = 0.446;
        } else {
            cotizacion = 0;
        }

        if (!isNaN(cantidad) && cantidad > 0 && cotizacion > 0) {
            const total = cotizacion * cantidad;

            document.getElementById("totalEstimadoCompra").textContent = `Total Estimado: $${total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            const nuevoMovimiento = {
                fecha: new Date().toLocaleString(),
                tipo: 'Compra',
                cantidad,
                precioUnitario: cotizacion,
                total,
                metodoPago,
                criptomoneda: criptoSeleccionada.charAt(0).toUpperCase() + criptoSeleccionada.slice(1)
            };
            mostrarCompraConfirmada(nuevoMovimiento);
        } else {
            console.error("Error: Cantidad inválida o cotización no definida.");
        }
    };

    const mostrarCompraConfirmada = (detalleCompra) => {
        const comprarContainer = document.getElementById("detalleCompra");

        const innerHTMLContent = `
            <h2>Compra Confirmada</h2>
            <div>
                <p><strong>Fecha:</strong> ${detalleCompra.fecha}</p>
                <p><strong>Tipo:</strong> ${detalleCompra.tipo}</p>
                <p><strong>Cantidad:</strong> ${detalleCompra.cantidad}</p>
                <p><strong>Precio Unitario:</strong> $${detalleCompra.precioUnitario.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Total:</strong> $${detalleCompra.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Método de Pago:</strong> ${detalleCompra.metodoPago}</p>
                <p><strong>Criptomoneda:</strong> ${detalleCompra.criptomoneda}</p>
            </div>
            <div>
            <div id="btnComprobante">
            <button id="btnVolver">Volver</button>
            <button id="btnPerfil">Perfil</button>
        </div>
        </div>
        `;

        comprarContainer.innerHTML = innerHTMLContent;
    };

    const realizarVenta = (event) => {
        event.preventDefault();
        const cantidad = parseFloat(document.getElementById("cantidadVenta").value);
        const metodoPago = document.getElementById("metodoPagoVenta").value;

        let cotizacion;
        const criptoSeleccionada = document.getElementById("criptoVenta").value;

        if (criptoSeleccionada === "bitcoin") {
            cotizacion = 59337;
        } else if (criptoSeleccionada === "ethereum") {
            cotizacion = 3253;
        } else if (criptoSeleccionada === "binance coin") {
            cotizacion = 3253;
        } else {
            cotizacion = 0;
        }

        if (!isNaN(cantidad) && cantidad > 0 && cotizacion > 0) {
            const total = cotizacion * cantidad;

            document.getElementById("totalEstimadoVenta").textContent = `Total Estimado: $${total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            const nuevoMovimiento = {
                fecha: new Date().toLocaleString(),
                tipo: 'Venta',
                cantidad,
                precioUnitario: cotizacion,
                total,
                metodoPago,
                criptomoneda: criptoSeleccionada.charAt(0).toUpperCase() + criptoSeleccionada.slice(1)
            };

            mostrarVentaConfirmada(nuevoMovimiento);
        } else {
            console.error("Error: Cantidad inválida o cotización no definida.");
        }
    };

    const mostrarVentaConfirmada = (detalleVenta) => {
        const ventaContainer = document.getElementById("detalleVenta");

        const innerHTMLContent = `
            <h2>Venta Confirmada</h2>
            <div>
                <p><strong>Fecha:</strong> ${detalleVenta.fecha}</p>
                <p><strong>Tipo:</strong> ${detalleVenta.tipo}</p>
                <p><strong>Cantidad:</strong> ${detalleVenta.cantidad}</p>
                <p><strong>Precio Unitario:</strong> $${detalleVenta.precioUnitario.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Total:</strong> $${detalleVenta.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Método de Pago:</strong> ${detalleVenta.metodoPago}</p>
                <p><strong>Criptomoneda:</strong> ${detalleVenta.criptomoneda}</p>
            </div>
            <div id="btnComprobante">
            <button id="btnVolver">Volver</button>
            <button id="btnPerfil">Perfil</button>
        </div>
        `;

        ventaContainer.innerHTML = innerHTMLContent;
    };

    document.getElementsByClassName("btnInSesion").addEventListener("click", loginForm);
    document.getElementsByClassName("btnRegist").addEventListener("click", registroForm);
    document.getElementById("formComprar").addEventListener("submit", realizarCompra);
    document.getElementById("formVender").addEventListener("submit", realizarVenta);
});
