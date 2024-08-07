document.addEventListener("DOMContentLoaded", () => {
  var globalExchangeRate = 0;
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
    let contrasea = document.getElementById("pass").value;

    let getDatos = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];

    let usuario = getDatos.find(usuario => usuario.dni === dni && usuario.contrasea === contrasea);

    let mensajeErrorUsuario = document.getElementById("mensajeErrorUsuario");
    let mensajeErrorCont = document.getElementById("mensajeErrorCont");

    if (usuario) {
      localStorage.setItem("loggedInUser", JSON.stringify(usuario));
      mostrarHome(usuario);
    } else {
      mostrarMensajeError(dni, contrasea, getDatos, mensajeErrorUsuario, mensajeErrorCont);
    }
  };

  let mostrarMensajeError = (dni, contrasea, getDatos, mensajeErrorUsuario, mensajeErrorCont) => {
    if (!dni || !contrasea) {
      return;
    }

    let usuario = getDatos.find(usuario => usuario.dni === dni);

    if (!usuario) {
      mensajeErrorUsuario.style.display = "block";
      mensajeErrorCont.style.display = "none";
    } else if (usuario.contrasea !== contrasea) {
      mensajeErrorCont.style.display = "block";
      mensajeErrorUsuario.style.display = "none";
    }
  };

  let registroUsuarios = () => {
    let dni = document.getElementById("dniReg").value.trim();
    let nombre = document.getElementById("nombreReg").value.trim();
    let apellido = document.getElementById("apellidoReg").value.trim();
    let contrasea = document.getElementById("passReg").value.trim();
    let edad = document.getElementById("edad").value.trim();
    let localidad = document.getElementById("localidad").value.trim();

    const mensajesError = {
      mensajeErrorDni: {
        elem: document.getElementById("mensajeErrorDni"),
        condition: !/^\d{8,9}$/.test(dni),
      },
      mensajeErrorNombre: {
        elem: document.getElementById("mensajeErrorNombre"),
        condition: nombre.length < 4,
      },
      mensajeErrorApellido: {
        elem: document.getElementById("mensajeErrorApellido"),
        condition: apellido.length < 4,
      },
      mensajeErrorPass: {
        elem: document.getElementById("mensajeErrorPass"),
        condition: contrasea.length < 8,
      },
      mensajeErrorEdad: {
        elem: document.getElementById("mensajeErrorEdad"),
        condition: isNaN(parseInt(edad)) || parseInt(edad) <= 18,
      },
      mensajeErrorLocalidad: {
        elem: document.getElementById("mensajeErrorLocalidad"),
        condition: !/^[a-zA-Z\s]+$/.test(localidad) || localidad === "",
      },
    };

    let valid = true;
    Object.values(mensajesError).forEach(msg => {
      if (msg.condition) {
        msg.elem.style.display = "block";
        valid = false;
      } else {
        msg.elem.style.display = "none";
      }
    });

    if (!valid) return;

    let usuario = { dni, nombre, apellido, contrasea, edad, localidad, saldo: 0 };
    nuevoUsuario.push(usuario);
    localStorage.setItem("nuevoUsuario", JSON.stringify(nuevoUsuario));
    localStorage.setItem("loggedInUser", JSON.stringify(usuario));
    mostrarHome(usuario);
  };

  let mostrarHome = usuario => {
    registroForm.style.display = "none";
    loginForm.style.display = "none";
    home.style.display = "block";
    home.classList.add("d-flex");

    if (usuario) {
      mostrarBotonesUsuario();
      document.getElementById("saldoActual").textContent = `$${usuario.saldo.toLocaleString("es-AR")} ARS`;
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
      console.log("cerrando sesion");
      localStorage.removeItem("loggedInUser");
      window.location.href = "./index.html";
    });
  };

  let btnIniciarSesion = document.getElementById("btnIniciarSesion");
  btnIniciarSesion.addEventListener(
    "click",
    (mostrarFormularioLogin = () => {
      home.style.display = "none";
      registroForm.style.display = "none";
      loginForm.style.display = "block";
    }),
  );

  let btnRegist = document.getElementById("btnRegist");
  btnRegist.addEventListener(
    "click",
    (mostrarFormularioRegistro = () => {
      home.style.display = "none";
      registroForm.style.display = "block";
      loginForm.style.display = "none";
    }),
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

  document.getElementById("formRegistro").addEventListener("submit", event => {
    event.preventDefault();
    registroUsuarios();
  });

  document.getElementById("btnLogin").addEventListener("click", event => {
    event.preventDefault();
    loginUsuario();
  });

  document.getElementById("btnRegistro").addEventListener("click", event => {
    event.preventDefault();
    mostrarFormularioRegistro();
  });

  document.getElementById("btnVolver").addEventListener("click", () => {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
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
        "nombrePerfil",
      ).innerHTML = `<strong>Nombre: </strong>${usuarioRegistrado.nombre}`;
      document.getElementById(
        "apellidoPerfil",
      ).innerHTML = `<strong>Apellido: </strong>${usuarioRegistrado.apellido}`;

      let movimientosHtml = (usuarioRegistrado.movimientos || [])
        .map(
          movimiento => `
        <tr>
          <td>${movimiento.titulo}</td>
          <td>${movimiento.cantidad}</td>
          <td>$${movimiento.total.toLocaleString("es-AR")} ARS</td>
          <td>${movimiento.fecha}</td>
        </tr>`,
        )
        .join("");
      document.getElementById("movimientosTabla").innerHTML = movimientosHtml;

      actualizarSaldo(usuarioRegistrado.saldo);
    }
  };

  const actualizarSaldoEnAlmacenamiento = usuarioActualizado => {
    let nuevoUsuario = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];
    nuevoUsuario = nuevoUsuario.map(usuario =>
      usuario.dni === usuarioActualizado.dni ? usuarioActualizado : usuario,
    );
    localStorage.setItem("nuevoUsuario", JSON.stringify(nuevoUsuario));
    localStorage.setItem("loggedInUser", JSON.stringify(usuarioActualizado));
  };

  const actualizarSaldo = nuevoSaldo => {
    let usuario = JSON.parse(localStorage.getItem("loggedInUser"));
    if (usuario) {
      usuario.saldo = nuevoSaldo;
      actualizarSaldoEnAlmacenamiento(usuario);
      document.getElementById("saldoActual").textContent = `$${nuevoSaldo.toLocaleString("es-AR")} ARS`;
    }
  };

  document.getElementById("btnDepositarPerfil").addEventListener("click", function () {
    const modalDeposito = new bootstrap.Modal(document.getElementById("modalDeposito"));
    modalDeposito.show();
  });

  document.getElementById("btnAceptarDeposito").addEventListener("click", function () {
    const montoDeposito = parseFloat(document.getElementById("montoDeposito").value);
    const metodoPago = document.getElementById("metodoPago").value;

    if (isNaN(montoDeposito) || montoDeposito <= 0 || metodoPago === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, complete todos los campos correctamente.",
      });
      return;
    }

    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      if (loggedInUser) {
        loggedInUser.saldo += montoDeposito;
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        actualizarSaldo(loggedInUser.saldo);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Saldo inválido. Por favor, intente nuevamente.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo recuperar la información del usuario.",
      });
    }

    const modalDeposito = bootstrap.Modal.getInstance(document.getElementById("modalDeposito"));
    modalDeposito.hide();

    Swal.fire({
      title: "Éxito",
      text: "Depósito realizado correctamente",
      icon: "success",
      background: "#333333",
      color: "white",
    });
  });

  document.getElementById("btnRetirar").addEventListener("click", function () {
    const modalRetiro = new bootstrap.Modal(document.getElementById("modalRetiro"));
    modalRetiro.show();
  });

  document.getElementById("btnAceptarRetiro").addEventListener("click", function () {
    const montoRetiro = parseFloat(document.getElementById("montoRetiro").value);
    if (!montoRetiro || isNaN(montoRetiro)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor ingrese un monto válido para el retiro",
      });
      return;
    }

    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.saldo >= montoRetiro) {
      loggedInUser.saldo -= montoRetiro;
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      actualizarSaldo(loggedInUser.saldo);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Saldo insuficiente para realizar el retiro.",
      });
    }

    const modalRetiro = bootstrap.Modal.getInstance(document.getElementById("modalRetiro"));
    modalRetiro.hide();

    Swal.fire({
      title: "¡Retiro realizado con éxito!",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  });


  const cryptoApiUrl =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,usd-coin,ripple,toncoin&vs_currencies=usd&include_24hr_change=true";
  const exchangeApiUrl = "https://api.exchangerate-api.com/v4/latest/USD";

  async function fetchExchangeRate() {
    try {
      const response = await fetch(exchangeApiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }
      const data = await response.json();
      return data.rates.ARS; 
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return 1; 
    }
  }

  function updatePrices(data, exchangeRate) {
    const prices = {
      BTC: {
        price: data.bitcoin ? data.bitcoin.usd : "N/A",
        change: data.bitcoin ? data.bitcoin.usd_24h_change : "N/A",
      },
      ETH: {
        price: data.ethereum ? data.ethereum.usd : "N/A",
        change: data.ethereum ? data.ethereum.usd_24h_change : "N/A",
      },
      USDT: {
        price: data.tether ? data.tether.usd : "N/A",
        change: data.tether ? data.tether.usd_24h_change : "N/A",
      },
      BNB: {
        price: data.binancecoin ? data.binancecoin.usd : "N/A",
        change: data.binancecoin ? data.binancecoin.usd_24h_change : "N/A",
      },
      SOL: {
        price: data.solana ? data.solana.usd : "N/A",
        change: data.solana ? data.solana.usd_24h_change : "N/A",
      },
      USDC: {
        price: data["usd-coin"] ? data["usd-coin"].usd : "N/A",
        change: data["usd-coin"] ? data["usd-coin"].usd_24h_change : "N/A",
      },
      XRP: {
        price: data.ripple ? data.ripple.usd : "N/A",
        change: data.ripple ? data.ripple.usd_24h_change : "N/A",
      },
    };

    globalExchangeRate = exchangeRate;

    for (const [crypto, { price, change }] of Object.entries(prices)) {
      const priceInARS = price !== "N/A" ? (parseFloat(price) * exchangeRate).toFixed(2) : "N/A";
      updateCryptoElement(crypto, price, change, priceInARS);
    }
  }

  async function fetchCryptoPrices() {
    try {
      const [cryptoResponse, exchangeRate] = await Promise.all([fetch(cryptoApiUrl), fetchExchangeRate()]);

      if (!cryptoResponse.ok) {
        throw new Error("Failed to fetch crypto prices");
      }

      const cryptoData = await cryptoResponse.json();
      updatePrices(cryptoData, exchangeRate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function updateCryptoElement(crypto, price, change, priceInARS) {
    const priceElement = document.querySelector(`tr[data-crypto="${crypto}"] .precio`);
    const changeElement = document.querySelector(
      `tr[data-crypto="${crypto}"] .porcentage, tr[data-crypto="${crypto}"] .porcentageRed`,
    );
    const priceInARSElement = document.querySelector(`tr[data-crypto="${crypto}"] .precioARS`);

    if (priceElement) {
      priceElement.textContent = formatPrice(price);
    }

    if (changeElement) {
      changeElement.textContent = formatPercentageChange(change);
      if (parseFloat(change) < 0) {
        changeElement.classList.toggle("porcentageRed", true);
        changeElement.classList.toggle("porcentage", false);
      } else {
        changeElement.classList.toggle("porcentage", true);
        changeElement.classList.toggle("porcentageRed", false);
      }
    }

    if (priceInARSElement) {
      priceInARSElement.textContent = formatPrice(priceInARS) + " ARS";
    }
  }

  function formatPrice(price) {
    if (price === "N/A") return "N/A";
    return `$${parseFloat(price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} USD`;
  }

  function formatPercentageChange(change) {
    if (change === "N/A") return "N/A";
    return `${parseFloat(change).toFixed(2)}%`;
  }

  fetchCryptoPrices();


    //ASIDE (lo puse aparte para no romper nadda de lo de arriba)
  const newCryptoApiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
const trendingCryptoApiUrl = 'https://api.coingecko.com/api/v3/coins/markets';

async function fetchNewCryptos() {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 3,
    page: 2
  });

  try {
    const response = await fetch(`${newCryptoApiUrl}?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch new cryptos');
    }
    const newCryptos = await response.json();
    localStorage.setItem('newCryptos', JSON.stringify(newCryptos));
    return newCryptos;
  } catch (error) {
    console.error('Error al obtener criptomonedas nuevas:', error);
    return [];
  }
}

async function fetchTrendingCryptos() {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'percent_change_24h_desc',
    per_page: 3,
    page: 1
  });

  try {
    const response = await fetch(`${trendingCryptoApiUrl}?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch trending cryptos');
    }
    const trendingCryptos = await response.json();
    localStorage.setItem('trendingCryptos', JSON.stringify(trendingCryptos));
    return trendingCryptos;
  } catch (error) {
    console.error('Error al obtener criptomonedas en alza:', error);
    return [];
  }
}

function displayCryptos(newCryptos, trendingCryptos) {
  const newCryptosContainer = document.getElementById('new-cryptos');
  const trendingCryptosContainer = document.getElementById('trending-cryptos');

  newCryptosContainer.innerHTML = '';
  trendingCryptosContainer.innerHTML = '';

  newCryptos.forEach(crypto => {
    const cryptoDiv = document.createElement('div');
    cryptoDiv.className = 'criptomoneda';
    cryptoDiv.innerHTML = `
      <h4>${crypto.name}</h4>
      <div class="infoCripto">
        <p class="price">${formatPrice(crypto.current_price)}</p>
      </div>
    `;
    newCryptosContainer.appendChild(cryptoDiv);
  });

  trendingCryptos.forEach(crypto => {
    const cryptoDiv = document.createElement('div');
    cryptoDiv.className = 'criptomoneda';
    cryptoDiv.innerHTML = `
      <h4>${crypto.name}</h4>
      <div class="infoCripto">
        <p class="price">${formatPrice(crypto.current_price)}</p>
      </div>
    `;
    trendingCryptosContainer.appendChild(cryptoDiv);
  });
}

function formatPrice(price) {
  if (price === "N/A") return "N/A";
  return `$${parseFloat(price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} USD`;
}

async function loadCryptos() {
  const storedNewCryptos = JSON.parse(localStorage.getItem('newCryptos'));
  const storedTrendingCryptos = JSON.parse(localStorage.getItem('trendingCryptos'));

  if (storedNewCryptos && storedTrendingCryptos) {
    displayCryptos(storedNewCryptos, storedTrendingCryptos);
  } else {
    const [newCryptos, trendingCryptos] = await Promise.all([fetchNewCryptos(), fetchTrendingCryptos()]);
    displayCryptos(newCryptos, trendingCryptos);
  }
}

loadCryptos();


  let btnComprar = document.querySelectorAll(".btnComprar");

  btnComprar.forEach(boton => {
    boton.addEventListener("click", function (event) {
      if (!isLoggedIn()) {
        mostrarFormularioLogin();
        return;
      }
      let fila = event.target.closest("tr");
      let titulo = fila.querySelector(".subtituloTable").textContent.trim();
      let precioString = fila.querySelector(".precio").textContent.trim();
      let precio = 0;
      const match = precioString.match(/(\d+\.\d+)/);
      if (match) {
        precio = parseFloat(match[1]);
      }

      document.getElementById("modal-titulo").textContent = titulo;
      document.getElementById("modal-precio").textContent = `Precio: ${precioString}`;
      document.getElementById("cantidadCompra").addEventListener("input", function () {
        let cantidad = parseInt(this.value);
        if (!isNaN(cantidad) && cantidad > 0) {
          let cotizacion = (globalExchangeRate * (precio * cantidad)).toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          document.getElementById("cotizacionValor").textContent = `$${cotizacion} ARS`;
        } else {
          document.getElementById("cotizacionValor").textContent = "";
        }
      });
      let modal = new bootstrap.Modal(document.getElementById("modal-compra"));
      modal.show();
    });
  });

  document.getElementById("confirmarCompra").addEventListener("click", function () {
    debugger;
    let cantidad = parseInt(document.getElementById("cantidadCompra").value);
    let precioString = document.getElementById("modal-precio").textContent.replace("Precio: ", "");
    let precio = 0;
    
    const match = precioString.match(/(\d+\.\d+)/);
    if (match) {
      precio = parseFloat(match[1]);
    }

    let totalCompra = globalExchangeRate * (precio * cantidad);

    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (isNaN(cantidad) || cantidad <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, ingrese una cantidad válida",
      });
      return;
    }

    if (!loggedInUser) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe iniciar sesión para realizar la compra.",
      });
      return;
    }

    if (totalCompra > loggedInUser.saldo) {
      Swal.fire({
        icon: "error",
        title: "Saldo insuficiente",
        text: "No tienes suficiente saldo para realizar esta compra.",
      });
      return;
    }

    let movimientos = loggedInUser.movimientos || [];
    movimientos.push({
      titulo: document.getElementById("modal-titulo").textContent,
      cantidad: cantidad,
      total: totalCompra,
      fecha: new Date().toLocaleDateString(),
    });
    loggedInUser.movimientos = movimientos;

    loggedInUser.saldo -= totalCompra;
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    actualizarSaldo(loggedInUser.saldo);

    let usuarios = JSON.parse(localStorage.getItem("nuevoUsuario")) || [];
    let index = usuarios.findIndex(u => u.dni === loggedInUser.dni);
    if (index !== -1) {
      usuarios[index].movimientos = movimientos;
      usuarios[index].saldoActual = loggedInUser.saldo;
      localStorage.setItem("nuevoUsuario", JSON.stringify(usuarios));
    }

    Swal.fire({
      title: "Éxito",
      text: "Compra realizada correctamente",
      icon: "success",
      background: "#333333",
      color: "white",
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById("modal-compra"));
    modal.hide();
  });

  function mostrarFormularioLogin() {
    document.getElementById("loginSec").classList.remove("invisible");
    document.getElementById("homeSec").classList.add("invisible");
  }

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

  let logo = document.getElementById("logo");
  logo.addEventListener("click", () => {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      let homeSec = document.getElementById("homeSec");
      let perfilSec = document.getElementById("perfilSec");
      homeSec.classList.remove("invisible");
      perfilSec.style.display = "none";
    } else {
      window.location.href = "./index.html";
    }
  });

  if (isLoggedIn()) {
    let usuarioRegistrado = JSON.parse(localStorage.getItem("loggedInUser"));
    mostrarHome(usuarioRegistrado);
  } 


});