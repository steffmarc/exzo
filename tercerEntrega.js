document.addEventListener("DOMContentLoaded", () => {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    let nuevoUsuario = JSON.parse(localStorage.getItem("nuevoUsuario")) || {};

    const mostrarSeccion = (seccion) => {
        const secciones = ["home", "comprarSec", "venderSec", "loginForm", "registroForm","detalleCompra", "perfil"];
        secciones.forEach(s => {
            const el = document.getElementById(s);
            if (el) {
                if (s === seccion) {
                    el.classList.remove('invisible');
                } else {
                    el.classList.add('invisible');
                }
            }
        });
    };

    mostrarSeccion("home");

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
        mostrarSeccion("home");
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
                loggedInUser = usuario;
                localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
                mostrarSeccion("home");
            } else {
                mensajeErrorCont.classList.remove("invisible");
                mensajeErrorUsuario.classList.add("invisible");
            }
        } else {
            mensajeErrorUsuario.classList.remove("invisible");
            mensajeErrorCont.classList.add("invisible");
        }
    };

    


    document.querySelectorAll(".navLink").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const section = link.dataset.section;
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

            if ((section === "perfil" || section === "depositar" || section === "loginForm") && !loggedInUser) {
                mostrarSeccion("loginForm"); 
            } else {
                mostrarSeccion(section); 
            }
        });
    });

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
                criptomoneda: criptoSeleccionada.charAt(0).toUpperCase() + criptoSeleccionada.slice(1)
            };
            mostrarSeccion("detalleCompra");
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
        `;
        mostrarSeccion("detalleCompra");
        comprarContainer.innerHTML = innerHTMLContent;
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

            const nuevoMovimiento = {
                fecha: new Date().toLocaleString(),
                tipo: 'Venta',
                cantidad,
                precioUnitario: cotizacion,
                total,
                metodoPago,
                criptomoneda: criptoSeleccionada.charAt(0).toUpperCase() + criptoSeleccionada.slice(1)
            };
            mostrarSeccion("detalleCompra");
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
        `;

        ventaContainer.innerHTML = innerHTMLContent;
    };


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

    document.getElementById("iniciarSesion").addEventListener("click", (event) => {
        event.preventDefault();
        mostrarSeccion("loginForm");
        loginForm();
    });

    document.getElementById("depositar").addEventListener("click", (event) => {
        event.preventDefault();
        
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
        if (loggedInUser) {
            mostrarSeccion("depositar");
        } else {
            mostrarSeccion("loginForm");
            loginForm();
        }
    });

    document.getElementById("btnRegistro").addEventListener("click", (event) => {
        event.preventDefault();
        mostrarSeccion("registroForm");
        registroForm(); 
    });
    
    document.getElementById("btnLogin").addEventListener("click", (event) => {
        event.preventDefault();
        mostrarSeccion("home"); 
    });

    document.getElementById("navHome").addEventListener("click", (event) => {
        event.preventDefault();
        mostrarSeccion("home");
    });
    
    document.getElementById("navComprar").addEventListener("click", (event) => {
        event.preventDefault();
        mostrarSeccion("comprarSec");
    });
    
    document.getElementById("navVender").addEventListener("click", (event) => {
        event.preventDefault();
        mostrarSeccion("venderSec");
    });
    
    document.getElementById("btnComprar").addEventListener("click", (event) => {
        event.preventDefault();
        realizarCompra(event);
    });
    
    document.getElementById("btnVender").addEventListener("click", (event) => {
        event.preventDefault();
        realizarVenta(event);
    });

    document.getElementById("cantidadCompra").addEventListener("input", actualizarTotal);
    document.getElementById("cantidadVenta").addEventListener("input", actualizarTotal);

    document.getElementById("criptoCompra").addEventListener("change", actualizarTotal);
    document.getElementById("criptoVenta").addEventListener("change", actualizarTotal);

    actualizarTotal();
});
