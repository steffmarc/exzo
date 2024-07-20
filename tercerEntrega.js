document.addEventListener("DOMContentLoaded", () => {
  let nuevoUsuario = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];

  let homeSec = document.getElementById("homeSec");
  let loginForm = document.getElementById("loginForm");
  let registroForm = document.getElementById("registroForm");
  let perfilSec = document.getElementById("perfilSec");

  let isLoggedIn = () => {
    return localStorage.getItem("loggedInUser") !== null;
  };

  let loginUsuario = () => {
    let dni = document.getElementById("dni").value;
    let contraseña = document.getElementById("pass").value;

    let getDatos = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];

    let usuario = getDatos.find(
      (usuario) =>
        usuario.dni === dni && usuario.contraseña === contraseña
    );

    let mensajeErrorUsuario = document.getElementById("mensajeErrorUsuario");
    let mensajeErrorCont = document.getElementById("mensajeErrorCont");

    if (usuario) {
      localStorage.setItem("loggedInUser", JSON.stringify(usuario));
      mostrarHome(usuario);
    } else {
      mostrarMensajeError(mensajeErrorUsuario, mensajeErrorCont);
    }
  };

  let registroUsuarios = () => {
    let dni = document.getElementById("dniReg").value.trim();
    let nombre = document.getElementById("nombreReg").value.trim();
    let apellido = document.getElementById("apellidoReg").value.trim();
    let contraseña = document.getElementById("passReg").value.trim();
    let edad = document.getElementById("edad").value.trim();
    let localidad = document.getElementById("localidad").value.trim();

    let mensajeErrorDni = document.getElementById("mensajeErrorDni");
    let mensajeErrorNombre = document.getElementById("mensajeErrorNombre");
    let mensajeErrorApellido = document.getElementById("mensajeErrorApellido");
    let mensajeErrorPass = document.getElementById("mensajeErrorPass");
    let mensajeErrorEdad = document.getElementById("mensajeErrorEdad");
    let mensajeErrorLocalidad = document.getElementById(
      "mensajeErrorLocalidad"
    );

    if (!/^\d{8,9}$/.test(dni)) {
      mensajeErrorDni.style.display = "block";
      return;
    } else {
      mensajeErrorDni.style.display = "none";
    }

    if (nombre.length < 4) {
      mensajeErrorNombre.style.display = "block";
      return;
    } else {
      mensajeErrorNombre.style.display = "none";
    }

    if (apellido.length < 4) {
      mensajeErrorApellido.style.display = "block";
      return;
    } else {
      mensajeErrorApellido.style.display = "none";
    }

    if (contraseña.length < 8) {
      mensajeErrorPass.style.display = "block";
      return;
    } else {
      mensajeErrorPass.style.display = "none";
    }

    let edadNum = parseInt(edad);
    if (isNaN(edadNum) || edadNum <= 18) {
      mensajeErrorEdad.style.display = "block";
      return;
    } else {
      mensajeErrorEdad.style.display = "none";
    }

    if (!localidad.match(/^[a-zA-Z\s]*$/) || localidad === "") {
      mensajeErrorLocalidad.style.display = "block";
      return;
    } else {
      mensajeErrorLocalidad.style.display = "none";
    }

    let usuario = { dni, nombre, apellido, contraseña, edad, localidad };
    nuevoUsuario.push(usuario);
    localStorage.setItem("nuevoUsuario", JSON.stringify(nuevoUsuario));
    localStorage.setItem("loggedInUser", JSON.stringify(usuario));
    mostrarHome(usuario);
  };

  let mostrarHome = (usuario) => {
    registroForm.style.display = "none";
    loginForm.style.display = "none";
    home.style.display = "block";
    home.classList.add("d-flex");

    if (usuario) {
      mostrarBotonesUsuario();
    }
  };

  const mostrarBotonesUsuario = () => {
    let userButtons = document.getElementById("userButtons");
    userButtons.innerHTML = `
          <button class="btn btn-outline-primary btnInSesion" id="miCuenta">Mi Cuenta</button>
          <button class="btn btn-primary btnRegist" id="cerrarSesion">Cerrar Sesión</button>`;

    let btnMiCuenta = document.getElementById("miCuenta");
    btnMiCuenta.addEventListener("click", miCuenta);

    let btnCerrarSesion = document.getElementById("cerrarSesion");
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "./index.html";
    });
  };

  let mostrarMensajeError = (mensajeErrorUsuario, mensajeErrorCont) => {
    let dni = document.getElementById("dni").value;
    let contraseña = document.getElementById("pass").value;

    if (!dni || !contraseña) {
      return;
    }

    let getDatos = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];
    let usuario = getDatos.find((usuario) => usuario.dni === dni);

    if (!usuario) {
      mensajeErrorUsuario.style.display = "block";
      mensajeErrorCont.style.display = "none";
    } else if (usuario.contraseña !== contraseña) {
      mensajeErrorCont.style.display = "block";
      mensajeErrorUsuario.style.display = "none";
    }
  };

  let btnIniciarSesion = document.getElementById("btnIniciarSesion");
  btnIniciarSesion.addEventListener(
    "click",
    (mostrarFormularioLogin = () => {
      home.style.display = "none";
      registroForm.style.display = "none";
      loginForm.style.display = "block";
    })
  );

  let btnRegist = document.getElementById("btnRegist");
  btnRegist.addEventListener(
    "click",
    (mostrarFormularioRegistro = () => {
      home.style.display = "none";
      registroForm.style.display = "block";
      loginForm.style.display = "none";
    })
  );

  document.getElementById("navHome").addEventListener("click", () => {
    let usuarioRegistrado = JSON.parse(localStorage.getItem("loggedInUser"));

    if (usuarioRegistrado) {
      homeSec.style.display = "block";
      perfilSec.style.display = "none";
      mostrarBotonesUsuario(usuarioRegistrado);
    } else {
      window.location.href = "./index.html";
    }
  });

  document.getElementById("formRegistro").addEventListener("submit", (event) => {
      event.preventDefault();
      registroUsuarios();
    });

  document.getElementById("btnLogin").addEventListener("click", (event) => {
    event.preventDefault();
    loginUsuario();
  });

  document.getElementById("btnRegistro").addEventListener("click", (event) => {
    event.preventDefault();
    mostrarFormularioRegistro();
  });

  let btnVolver = document.getElementById("btnVolver");
  btnVolver.addEventListener("click", () => {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
      let homeSec = document.getElementById("homeSec");
      let perfilSec = document.getElementById("perfilSec");

      homeSec.classList.remove("invisible");
      perfilSec.style.display = "none";
    }
  });

  let miCuenta = () => {
    document.getElementById("homeSec").classList.add("invisible");
    perfilSec.style.display = "block";

    let usuarioRegistrado = JSON.parse(localStorage.getItem("loggedInUser"));

    if (usuarioRegistrado) {
      document.getElementById(
        "nombrePerfil"
      ).innerHTML = `<strong>Nombre: </strong>${usuarioRegistrado.nombre}`;
      document.getElementById(
        "apellidoPerfil"
      ).innerHTML = `<strong>Apellido: </strong>${usuarioRegistrado.apellido}`;
    }

    let movimientosHtml = "";
    movimientos.forEach((movimiento) => {
      movimientosHtml += `
            <tr>
              <td>${movimiento.titulo}</td>
              <td>${movimiento.cantidad}</td>
              <td>$${movimiento.total.toLocaleString("es-AR")} ARS</td>
              <td>${movimiento.fecha}</td>
            </tr>`;
    });

    document.getElementById("movimientosTabla").innerHTML = movimientosHtml;
  };

  function actualizarSaldo(saldo) {
    const saldoActualElem = document.getElementById("saldoActual");
    if (saldoActualElem) {
      saldoActualElem.textContent = `$${saldo.toLocaleString("es-AR")} ARS`;
    }

    const saldoActualModalRetiro = document.getElementById("saldoActualValor");
    if (saldoActualModalRetiro) {
      saldoActualModalRetiro.textContent = `$${saldo.toLocaleString(
        "es-AR"
      )} ARS`;
    }
  }

  function actualizarSaldoDesdeLocalStorage() {
    const saldoGuardado = localStorage.getItem("saldoActual");
    if (saldoGuardado) {
      const saldoActual = parseFloat(saldoGuardado);
      actualizarSaldo(saldoActual);
    }
  }

  actualizarSaldoDesdeLocalStorage();

  document.getElementById("btnDepositarPerfil").addEventListener("click", function () {
      const modalDeposito = new bootstrap.Modal(
        document.getElementById("modalDeposito")
      );
      modalDeposito.show();

      const btnAceptarDeposito = document.getElementById("btnAceptarDeposito");
      btnAceptarDeposito.addEventListener("click", function () {
        const montoDeposito = parseFloat(
          document.getElementById("montoDeposito").value
        );
        const metodoPago = document.getElementById("metodoPago").value;

        if (!montoDeposito || metodoPago === "") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor complete todos los campos",
          });
          return;
        }

        let saldoActual = parseFloat(localStorage.getItem("saldoActual")) || 0;
        saldoActual += montoDeposito;

        localStorage.setItem("saldoActual", saldoActual.toString());

        actualizarSaldo(saldoActual);

        modalDeposito.hide();

        Swal.fire({
          title: "Éxito",
          text: "Depósito realizado correctamente",
          icon: "success",
          background: "#333333",
          color: "white",
        });
      });
    });

  document.getElementById("btnRetirar").addEventListener("click", function () {
    const modalRetiro = new bootstrap.Modal(
      document.getElementById("modalRetiro")
    );
    modalRetiro.show();

    const btnAceptarRetiro = document.getElementById("btnAceptarRetiro");
    btnAceptarRetiro.addEventListener("click", function () {
      const montoRetiro = parseFloat(
        document.getElementById("montoRetiro").value
      );

      if (!montoRetiro || isNaN(montoRetiro)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor ingrese un monto válido para el retiro",
        });
        return;
      }

      let saldoActual = parseFloat(localStorage.getItem("saldoActual")) || 0;

      if (montoRetiro > saldoActual) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Fondos insuficientes",
        });
        return;
      }

      saldoActual -= montoRetiro;

      localStorage.setItem("saldoActual", saldoActual.toString());

      actualizarSaldo(saldoActual);

      Swal.fire({
        title: "Éxito",
        text: "Retiro realizado correctamente",
        icon: "success",
        background: "#333333",
        color: "white",
      });

      modalRetiro.hide();
    });
  });



  const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,usd-coin,ripple,toncoin&vs_currencies=usd&include_24hr_change=true';

async function fetchCryptoPrices() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    updatePrices(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function formatPrice(price) {
  if (price === 'N/A') return 'N/A';
  return `$${parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
}

function formatPercentageChange(change) {
  if (change === 'N/A') return 'N/A';
  return `${parseFloat(change).toFixed(2)}%`;
}

function updatePrices(data) {
  const prices = {
    BTC: {
      price: data.bitcoin ? data.bitcoin.usd : 'N/A',
      change: data.bitcoin ? data.bitcoin.usd_24h_change : 'N/A'
    },
    ETH: {
      price: data.ethereum ? data.ethereum.usd : 'N/A',
      change: data.ethereum ? data.ethereum.usd_24h_change : 'N/A'
    },
    USDT: {
      price: data.tether ? data.tether.usd : 'N/A',
      change: data.tether ? data.tether.usd_24h_change : 'N/A'
    },
    BNB: {
      price: data.binancecoin ? data.binancecoin.usd : 'N/A',
      change: data.binancecoin ? data.binancecoin.usd_24h_change : 'N/A'
    },
    SOL: {
      price: data.solana ? data.solana.usd : 'N/A',
      change: data.solana ? data.solana.usd_24h_change : 'N/A'
    },
    USDC: {
      price: data['usd-coin'] ? data['usd-coin'].usd : 'N/A',
      change: data['usd-coin'] ? data['usd-coin'].usd_24h_change : 'N/A'
    },
    XRP: {
      price: data.ripple ? data.ripple.usd : 'N/A',
      change: data.ripple ? data.ripple.usd_24h_change : 'N/A'
    },
  };

  updateCryptoElement('BTC', prices.BTC.price, prices.BTC.change);
  updateCryptoElement('ETH', prices.ETH.price, prices.ETH.change);
  updateCryptoElement('USDT', prices.USDT.price, prices.USDT.change);
  updateCryptoElement('BNB', prices.BNB.price, prices.BNB.change);
  updateCryptoElement('SOL', prices.SOL.price, prices.SOL.change);
  updateCryptoElement('USDC', prices.USDC.price, prices.USDC.change);
  updateCryptoElement('XRP', prices.XRP.price, prices.XRP.change);
}

function updateCryptoElement(crypto, price, change) {
  const priceElement = document.querySelector(`tr[data-crypto="${crypto}"] .precio`);
  const changeElement = document.querySelector(`tr[data-crypto="${crypto}"] .porcentage, tr[data-crypto="${crypto}"] .porcentageRed`);

  if (priceElement) {
    priceElement.textContent = formatPrice(price);
  }

  if (changeElement) {
    changeElement.textContent = formatPercentageChange(change);
    if (parseFloat(change) < 0) {
      changeElement.classList.add('porcentageRed');
      changeElement.classList.remove('porcentage');
    } else {
      changeElement.classList.add('porcentage');
      changeElement.classList.remove('porcentageRed');
    }
  }
}

fetchCryptoPrices();













let btnComprar = document.querySelectorAll(".btnComprar");

btnComprar.forEach((boton) => {
    boton.addEventListener("click", function (event) {
        let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        function isLoggedInUser() {
            return loggedInUser !== null; 
        }

        if (!isLoggedInUser()) {
            mostrarFormularioLogin();
            return;
        }

        let fila = event.target.closest("tr");
        let titulo = fila.querySelector(".subtituloTable").textContent.trim();
        let precioString = fila.querySelector(".precio").textContent.trim();
        let precio = parseFloat(
            precioString.replace(/[^0-9,-]+/g, "").replace(",", ".")
        );

        document.getElementById("modal-titulo").textContent = titulo;
        document.getElementById(
            "modal-precio"
        ).textContent = `Precio: ${precioString}`;

        document
            .getElementById("cantidadCompra")
            .addEventListener("input", function () {
                let cantidad = parseInt(this.value);
                if (!isNaN(cantidad) && cantidad > 0) {
                    let cotizacion = (precio * cantidad).toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                    document.getElementById(
                        "cotizacionValor"
                    ).textContent = `$${cotizacion} ARS`;
                } else {
                    document.getElementById("cotizacionValor").textContent = "";
                }
            });

        let modal = new bootstrap.Modal(document.getElementById("modal-compra"));
        modal.show();

        document.getElementById("confirmarCompra").addEventListener("click", function () {
            let formaPago = document.getElementById("formaPago").value;
            let cantidad = parseInt(
                document.getElementById("cantidadCompra").value
            );

            let saldoActual =
                parseFloat(localStorage.getItem("saldoActual")) || 0;
            let totalCompra = precio * cantidad;

            if (totalCompra > saldoActual) {
                Swal.fire({
                    title: "Error",
                    text: "Saldo insuficiente para realizar esta compra, podes recargar tu saldo desde Mi Cuenta.",
                    icon: "error",
                });
                return;
            }

            saldoActual -= totalCompra;

            localStorage.setItem("saldoActual", saldoActual.toString());
            actualizarSaldo(saldoActual);

            agregarMovimientoCompra(titulo, cantidad, totalCompra);

            Swal.fire({
                title: "Procesando compra...",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    setTimeout(() => {
                        Swal.close();
                        Swal.fire({
                            title: "¡Compra realizada con éxito!",
                            icon: "success",
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false,
                        });
                        modal.hide();
                        miCuenta();
                    }, 2500);
                },
            });
        });
    });
});


  let movimientos = JSON.parse(localStorage.getItem("movimientosCompra")) || [];

  const agregarMovimientoCompra = (titulo, cantidad, total) => {
    let nuevoMovimiento = {
      titulo: titulo,
      cantidad: cantidad,
      total: total,
      fecha: new Date().toLocaleString("es-AR"),
    };

    movimientos.push(nuevoMovimiento);
    localStorage.setItem("movimientosCompra", JSON.stringify(movimientos));
  };


});
