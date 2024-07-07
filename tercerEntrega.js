document.addEventListener("DOMContentLoaded", () => {
  let nuevoUsuario = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];

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
    let mensajeErrorLocalidad = document.getElementById(
      "mensajeErrorLocalidad"
    );

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

  let mostrarHome = () => {
    registroForm.style.display = "none";
    loginForm.style.display = "none";
    home.style.display = "block";
    home.classList.add("d-flex");

    let userButtons = document.getElementById("userButtons");
    userButtons.innerHTML = `
    <button class="btnInSesion" id="miCuenta">Mi Cuenta</button>
    <button class="btnRegist" id="cerrarSesion">Cerrar Sesión</button>`;

    let btnMiCuenta = document.getElementById("miCuenta");
    btnMiCuenta.addEventListener("click",(mostrarFormularioLogin = () => {
      miCuenta();
    })
  );
  };

    let usuarioRegistrado = JSON.parse(localStorage.getItem("loggedInUser"));

      if (usuarioRegistrado) {
          document.getElementById('nombreReg').innerHTML = `<strong>Nombre: </strong>${usuarioRegistrado.nombre}`;
          document.getElementById('apellidoReg').innerHTML = `<strong>Apellido: </strong>${usuarioRegistrado.apellido}`;
          
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
  btnIniciarSesion.addEventListener("click",(mostrarFormularioLogin = () => {
      home.style.display = "none";
      registroForm.style.display = "none";
      loginForm.style.display = "block";
    })
  );

  let btnRegist = document.getElementById("btnRegist");
  btnRegist.addEventListener("click",(mostrarFormularioLogin = () => {
      home.style.display = "none";
      registroForm.style.display = "block";
      loginForm.style.display = "none";
    })
  );

  document.getElementById("btnRegistro").addEventListener("click", (event) => {
    event.preventDefault();
    mostrarFormularioRegistro();
  });

  document
    .getElementById("formRegistro")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      registroUsuarios();
    });

  document.getElementById("btnLogin").addEventListener("click", (event) => {
    event.preventDefault();
    loginUsuario();
  });

  let isLoggedIn = () => {
    return localStorage.getItem("loggedInUser") !== null;
  };

  let btnComprar = document.querySelectorAll(".btnComprar");

  btnComprar.forEach((boton) => {
    boton.addEventListener("click", function (event) {
      if (!isLoggedIn()) {
        home.style.display = "none";
        loginForm.style.display = "block";
        registroForm.style.display = "none";
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
            document.getElementById("cotizacionValor").textContent = `$${cotizacion} ARS`;
          } 
          else {document.getElementById("cotizacionValor").textContent = "";
          }
        });

      let modal = new bootstrap.Modal(document.getElementById("modal-compra"));
      modal.show();

      document.getElementById("confirmarCompra").addEventListener("click", function () {
          let formaPago = document.getElementById("formaPago").value;
          let cantidad = parseInt(document.getElementById("cantidadCompra").value);

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
              }, 2500);
            },
          });
        });
    });
  });


  let miCuenta = () => {
    document.getElementById("homeSec").classList.add("invisible");
    perfilSec.style.display = "block";

    };
  

  






});
