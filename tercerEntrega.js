document.addEventListener("DOMContentLoaded", () => {
    let nuevoUsuario = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];


    const loginUsuario = () => {
        const nombre = document.getElementById("nombre").value;
        const contraseña = document.getElementById("pass").value;

        const getDatos = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];

        const usuario = getDatos.find(usuario => usuario.nombre === nombre && usuario.contraseña === contraseña);

        const mensajeErrorUsuario = document.getElementById("mensajeErrorUsuario");
        const mensajeErrorCont = document.getElementById("mensajeErrorCont");

        if (usuario) {
            mostrarHome(usuario);
        } else {
            mostrarMensajeError(mensajeErrorUsuario, mensajeErrorCont);
        }
    };

    const registroUsuarios = () => {
        const nombre = document.getElementById("nombreReg").value;
        const contraseña = document.getElementById("passReg").value;
        const edad = document.getElementById("edad").value;
        const localidad = document.getElementById("localidad").value;

        const usuario = { nombre, contraseña, edad, localidad };
        nuevoUsuario.push(usuario);

        localStorage.setItem("nuevoUsuario", JSON.stringify(nuevoUsuario));
        mostrarHome(usuario);
    };

    const mostrarHome = () => {
        registroForm.style.display = "none";
        loginForm.style.display = "none";
        home.style.display = "block";
        home.classList.add("d-flex");

        let nav = document.getElementById("nav");
        nav.innerHTML = `<nav id="nav">
        <div class="logo">
          <img src="../multimedia/logoMostaza.png" alt="Logo Exzo" />
        </div>
        <ul class="navLinks">
          <li><a href="./index.html" id="navHome">Home</a></li>
          <li><a href="./pages/informacion.html" id="navInfo">Información</a></li>
          <li><a href="./pages/perfil.html" id="navPerfil">Perfil</a></li>
        </ul>
        <div>
          <button class="btnInSesion" id="miCuenta">Mi Cuenta</button>
          <button class="btnRegist" id="cerrarSesion">Cerrar Sesión</button>
        </div>
      </nav>`;
    };

    const mostrarMensajeError = (mensajeErrorUsuario, mensajeErrorCont) => {
        const nombre = document.getElementById("nombre").value;
        const contraseña = document.getElementById("pass").value;
    
        if (!nombre || !contraseña) {
            return;
        }
    
        const getDatos = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];
        const usuario = getDatos.find(usuario => usuario.nombre === nombre);
    
        if (!usuario) {
            mensajeErrorUsuario.style.display = "block";
            mensajeErrorCont.style.display = "none";
        } else if (usuario.contraseña !== contraseña) {
            mensajeErrorCont.style.display = "block";
            mensajeErrorUsuario.style.display = "none";
        }
    };

    let btnIniciarSesion = document.getElementById("btnIniciarSesion");
    btnIniciarSesion.addEventListener("click", mostrarFormularioLogin = () => {
        home.style.display = "none";
        loginForm.style.display = "block";
        registroForm.style.display = "none";
    });

    let btnRegist = document.getElementById("btnRegist");
    btnRegist.addEventListener("click", mostrarFormularioLogin = () => {
        home.style.display = "none";
        registroForm.style.display = "block";
        loginForm.style.display = "none";
    });

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

    


    });
