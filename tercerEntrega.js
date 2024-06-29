document.addEventListener("DOMContentLoaded", () => {
    let nuevoUsuario = JSON.parse(localStorage.getItem("nuevoUsuario")) || []; 

    const registroUsuarios = () => {
        const nombre = document.getElementById("nombreReg").value;
        const contraseña = document.getElementById("passReg").value;
        const edad = parseInt(document.getElementById("edad").value); 
        const localidad = document.getElementById("localidad").value;
        const mensajeErrorNombre = document.getElementById("mensajeErrorNombre"); 
        const mensajeErrorPass = document.getElementById("mensajeErrorPass");
        const mensajeErrorEdad = document.getElementById("mensajeErrorEdad"); 
    
        if (nombre.length < 4) {
            mensajeErrorNombre.classList.remove('invisible');
            return; 
        } else {
            mensajeErrorNombre.classList.add('invisible');
        }
    
        if (contraseña.length <= 8) {
            mensajeErrorPass.classList.remove('invisible');
            return;
        } else {
            mensajeErrorPass.classList.add('invisible');
        }
    
        if (edad < 18) {
            mensajeErrorEdad.classList.remove('invisible');
            return;
        } else {
            mensajeErrorEdad.classList.add('invisible');
        }
    
        const usuario = { nombre, contraseña, edad, localidad };
        nuevoUsuario.push(usuario);
    
        localStorage.setItem("nuevoUsuario", JSON.stringify(nuevoUsuario));
        mostrarMensajeBienvenida(usuario.nombre);
    };

    const loginUsuario = () => {
        const nombre = document.getElementById("nombre").value;
        const contraseña = document.getElementById("pass").value;

        const getDatos = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];

        const usuario = getDatos.find(usuario => usuario.nombre === nombre && usuario.contraseña === contraseña);

        if (usuario) {
            mostrarMensajeBienvenida(usuario.nombre);
        } else {
            mostrarMensajeError();
        }
    };

    const mostrarMensajeBienvenida = (nombreUsuario) => {
        document.getElementById("loginForm").classList.add('invisible');
        document.getElementById("registroForm").classList.add('invisible');
        document.getElementById("home").classList.remove('invisible');
    
        let titulo = document.getElementById("tituloHome");
        titulo.textContent = `¡Hola ${nombreUsuario}!`;
    };

    const mostrarMensajeError = () => {
        document.body.innerHTML = `<h1>Usuario no encontrado</h1>
        <a href="index.html">Volver</a>`;
    };

    const mostrarFormularioRegistro = () => {
        document.getElementById("loginForm").classList.add('invisible');
        document.getElementById("registroForm").classList.remove('invisible');
    };

    document.getElementById("btnRegistro").addEventListener("click", (event) => {
        event.preventDefault();
        mostrarFormularioRegistro();
    });

    document.getElementById("formRegistro").addEventListener("submit", (event) => {
        event.preventDefault();
        registroUsuarios();
    });

    document.getElementById("btnLogin").addEventListener("click", (event) => {
        event.preventDefault();
        loginUsuario();
    });

    const actualizarTotalesEstimados = (totalCompra, totalVenta) => {
        document.getElementById("totalEstimadoCompra").innerText = `Total estimado: $${totalCompra.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        document.getElementById("totalEstimadoVenta").innerText = `Total estimado: $${totalVenta.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const actualizarTotal = () => {
        const cantidadCompra = parseFloat(document.getElementById("cantidadCompra").value) || 0;
        const cantidadVenta = parseFloat(document.getElementById("cantidadVenta").value) || 0;
        
        let cotizacionCompra = 0;
        let cotizacionVenta = 0;

        const criptoSeleccionadaCompra = document.getElementById("criptoCompra").value;
        const criptoSeleccionadaVenta = document.getElementById("criptoVenta").value;

        if (criptoSeleccionadaCompra === "bitcoin") {
            cotizacionCompra = 50000; 
        } else if (criptoSeleccionadaCompra === "ethereum") {
            cotizacionCompra = 40000; 
        }

        if (criptoSeleccionadaVenta === "bitcoin") {
            cotizacionVenta = 48000; 
        } else if (criptoSeleccionadaVenta === "ethereum") {
            cotizacionVenta = 38000; 
        }

        if (!isNaN(cotizacionCompra) && !isNaN(cotizacionVenta)) {
            const totalCompra = cotizacionCompra * cantidadCompra;
            const totalVenta = cotizacionVenta * cantidadVenta;
    
            actualizarTotalesEstimados(totalCompra, totalVenta);
        } else {
            console.error("Error: Cantidad inválida o cotización no definida.");
        }
    };

    const realizarCompra = (event) => {
        event.preventDefault();
    
        const cantidad = parseFloat(document.getElementById("cantidadCompra").value);
        const criptoSeleccionada = document.getElementById("criptoCompra").value;
        const metodoPago = document.getElementById("metodoPagoCompra").value;
    
        let cotizacion;
        if (criptoSeleccionada === "bitcoin") {
            cotizacion = 50000; 
        } else if (criptoSeleccionada === "ethereum") {
            cotizacion = 40000; 
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
                criptomoneda: criptoSeleccionada.charAt(0).toUpperCase() + criptoSeleccionada.slice(1) // Formatear nombre de la criptomoneda
            };
    
            document.getElementById("home").classList.add('invisible');
            document.getElementById("detalleCompra").classList.remove('invisible');
            mostrarCompraConfirmada(nuevoMovimiento);
        } else {
            console.error("Error: Cantidad inválida o cotización no definida.");
        }
    };

    const mostrarCompraConfirmada = (detalleCompra) => {
        const homeContainer = document.getElementById("detalleCompra");
    
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
        `;
    
        homeContainer.innerHTML = innerHTMLContent;
    };

    const realizarVenta = (event) => {
        event.preventDefault();
        const cantidad = parseFloat(document.getElementById("cantidadVenta").value);
        const metodoPago = document.getElementById("metodoPagoVenta").value;
    
        let cotizacion;
        const criptoSeleccionada = document.getElementById("criptoVenta").value;

        if (criptoSeleccionada === "bitcoin") {
            cotizacion = 48000; 
        } else if (criptoSeleccionada === "ethereum") {
            cotizacion = 38000; 
        } else {
            cotizacion = 0; 
        }
    
        if (!isNaN(cantidad) && cantidad > 0 && cotizacion > 0) {
            const total = cotizacion * cantidad;
    
            document.getElementById("totalEstimadoVenta").textContent = `Total Estimado: $${total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
            const nuevaVenta = {
                fecha: new Date().toLocaleString(),
                tipo: 'Venta',
                cantidad,
                precioUnitario: cotizacion,
                total,
                metodoPago,
                criptomoneda: criptoSeleccionada.charAt(0).toUpperCase() + criptoSeleccionada.slice(1) // Formatear nombre de la criptomoneda
            };
    
            document.getElementById("home").classList.add('invisible');
            document.getElementById("detalleCompra").classList.remove('invisible');
            mostrarVentaConfirmada(nuevaVenta);
        } else {
            console.error("Error: Cantidad inválida o cotización no definida.");
        }
    };

    const mostrarVentaConfirmada = (detalleVenta) => {
        const homeContainer = document.getElementById("detalleCompra");
    
        const innerHTMLContent = `
            <h2>Venta Confirmada</h2>
            <div class="detalleCompraContent">
                <p><strong>Fecha:</strong> ${detalleVenta.fecha}</p>
                <p><strong>Tipo:</strong> ${detalleVenta.tipo}</p>
                <p><strong>Cantidad:</strong> ${detalleVenta.cantidad}</p>
                <p><strong>Precio Unitario:</strong> $${detalleVenta.precioUnitario.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Total:</strong> $${detalleVenta.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Método de Pago:</strong> ${detalleVenta.metodoPago}</p>
                <p><strong>Criptomoneda:</strong> ${detalleVenta.criptomoneda}</p>
            </div>
        `;
    
        homeContainer.innerHTML = innerHTMLContent;
    };

    document.getElementById("formComprar").addEventListener("submit", realizarCompra);
    document.getElementById("formVenta").addEventListener("submit", realizarVenta);
    document.getElementById("cantidadCompra").addEventListener("input", actualizarTotal);
    document.getElementById("cantidadVenta").addEventListener("input", actualizarTotal);

    actualizarTotal();
});
