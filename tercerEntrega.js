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
    let nombre = document.getElementById("nombre").value;
    let contraseña = document.getElementById("pass").value;

    let getDatos = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];

    let usuario = getDatos.find(
      (usuario) =>
        usuario.nombre === nombre && usuario.contraseña === contraseña
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
    let nombre = document.getElementById("nombreReg").value;
    let apellido = document.getElementById("apellidoReg").value;
    let contraseña = document.getElementById("passReg").value;
    let edad = document.getElementById("edad").value;
    let localidad = document.getElementById("localidad").value;

    let mensajeErrorNombre = document.getElementById("mensajeErrorNombre");
    let mensajeErrorPass = document.getElementById("mensajeErrorPass");
    let mensajeErrorEdad = document.getElementById("mensajeErrorEdad");
    let mensajeErrorLocalidad = document.getElementById("mensajeErrorLocalidad");

    if (nombre.length < 4) {
      mensajeErrorNombre.style.display = "block";
      return;
    } else {
      mensajeErrorNombre.style.display = "none";
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

    if (!localidad.match(/^[a-zA-Z\s]*$/)) {
      mensajeErrorLocalidad.style.display = "block";
      return;
    } else {
      mensajeErrorLocalidad.style.display = "none";
    }

    let usuario = { nombre, apellido, contraseña, edad, localidad };
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

  const mostrarBotonesUsuario = () => {
    let userButtons = document.getElementById("userButtons");
    userButtons.innerHTML = `
      <button class="btnInSesion" id="miCuenta">Mi Cuenta</button>
      <button class="btnRegist" id="cerrarSesion">Cerrar Sesión</button>`;

    let btnMiCuenta = document.getElementById("miCuenta");
    btnMiCuenta.addEventListener("click", miCuenta);


    let btnCerrarSesion = document.getElementById("cerrarSesion");
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "./index.html";
    });
  };

  let usuarioRegistrado = JSON.parse(localStorage.getItem("loggedInUser"));

  if (usuarioRegistrado) {
    document.getElementById("nombrePerfil").innerHTML = `<strong>Nombre: </strong>${usuarioRegistrado.nombre}`;
    document.getElementById("apellidoPerfil").innerHTML = `<strong>Apellido: </strong>${usuarioRegistrado.apellido}`;
  }

  let mostrarMensajeError = (mensajeErrorUsuario, mensajeErrorCont) => {
    let nombre = document.getElementById("nombre").value;
    let contraseña = document.getElementById("pass").value;

    if (!nombre || !contraseña) {
      return;
    }

    let getDatos = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];
    let usuario = getDatos.find((usuario) => usuario.nombre === nombre);

    if (!usuario) {
      mensajeErrorUsuario.style.display = "block";
      mensajeErrorCont.style.display = "none";
    } else if (usuario.contraseña !== contraseña) {
      mensajeErrorCont.style.display = "block";
      mensajeErrorUsuario.style.display = "none";
    }
  };

  let btnIniciarSesion = document.getElementById("btnIniciarSesion");
  btnIniciarSesion.addEventListener("click", (mostrarFormularioLogin = () => {
      home.style.display = "none";
      registroForm.style.display = "none";
      loginForm.style.display = "block";
    })
  );

  let btnRegist = document.getElementById("btnRegist");
  btnRegist.addEventListener("click",(mostrarFormularioRegistro = () => {
      home.style.display = "none";
      registroForm.style.display = "block";
      loginForm.style.display = "none";
    })
  );

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

  

  let btnComprar = document.querySelectorAll(".btnComprar");

  btnComprar.forEach((boton) => {
    boton.addEventListener("click", function (event) {
      if (!isLoggedIn()) {
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
      document.getElementById("modal-precio").textContent = `Precio: ${precioString}`;

      document.getElementById("cantidadCompra").addEventListener("input", function () {
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
  let cantidad = parseInt(document.getElementById("cantidadCompra").value);

  let saldoActual = parseFloat(localStorage.getItem("saldoActual")) || 0;
  let totalCompra = precio * cantidad;

  if (totalCompra > saldoActual) {
    Swal.fire({
      title: "Error",
      text: "Saldo insuficiente para realizar esta compra",
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

  let miCuenta = () => {
    document.getElementById("homeSec").classList.add("invisible");
    perfilSec.style.display = "block";

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
    saldoActualModalRetiro.textContent = `$${saldo.toLocaleString("es-AR")} ARS`;
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
  const modalDeposito = new bootstrap.Modal(document.getElementById("modalDeposito"));
  modalDeposito.show();

  const btnAceptarDeposito = document.getElementById("btnAceptarDeposito");
  btnAceptarDeposito.addEventListener("click", function () {
    const montoDeposito = parseFloat(document.getElementById("montoDeposito").value);
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
  const modalRetiro = new bootstrap.Modal(document.getElementById("modalRetiro"));
  modalRetiro.show();

  const btnAceptarRetiro = document.getElementById("btnAceptarRetiro");
  btnAceptarRetiro.addEventListener("click", function () {
    const montoRetiro = parseFloat(document.getElementById("montoRetiro").value);

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

let btnVolver = document.getElementById("btnVolver");
btnVolver.addEventListener("click", () => {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser) {
    let home = document.getElementById("home");
    let perfilSec = document.getElementById("perfilSec");

    homeSec.classList.remove("invisible");
    perfilSec.style.display = "none";
  } else {
    alert("no anda");
  }
});


});
