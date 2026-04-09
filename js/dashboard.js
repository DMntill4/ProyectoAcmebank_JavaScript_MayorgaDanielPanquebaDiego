// ==============================
// LÓGICA DEL DASHBOARD
// Aquí está toda la funcionalidad bancaria
// ==============================

// --- VERIFICAR SESIÓN ---
// Lo primero que hacemos es verificar que haya un usuario logueado
// Si no hay sesión, redirigir al login
const usuarioActual = obtenerUsuarioActual();

if (!usuarioActual) {
    // No hay sesión activa, mandamos al login
    window.location.href = "index.html";
}

// ==============================
// INICIALIZAR EL DASHBOARD
// ==============================

function inicializarDashboard() {
    // Mostrar la fecha actual en el header
    document.getElementById("fechaActual").textContent = formatearSoloFecha(new Date().toISOString());

    // Nombre en el sidebar
    document.getElementById("sidebarNombre").textContent =
        `${usuarioActual.nombres} ${usuarioActual.apellidos}`;

    // Cargar el resumen de cuenta
    actualizarResumen();
}

// --- ACTUALIZAR EL RESUMEN DE CUENTA ---
// Esta función se llama cada vez que cambia el saldo
function actualizarResumen() {
    // Obtener datos frescos del localStorage (por si el saldo cambió)
    const usuario = obtenerUsuarioActual();

    // Resumen principal
    document.getElementById("dashNumeroCuenta").textContent = usuario.numeroCuenta;
    document.getElementById("dashSaldo").textContent = formatearMoneda(usuario.saldo);
    document.getElementById("dashTitular").textContent =
        `${usuario.nombres} ${usuario.apellidos}`;
    document.getElementById("dashFechaCreacion").textContent =
        formatearSoloFecha(usuario.fechaCreacion);
}

// ==============================
// NAVEGACIÓN ENTRE SECCIONES
// ==============================

function navegarA(seccion) {
    // 1. Ocultar TODAS las secciones
    // querySelectorAll selecciona todos los elementos que coincidan
    const secciones = document.querySelectorAll(".seccion");
    secciones.forEach((s) => (s.style.display = "none"));

    // 2. Quitar clase 'active' de todos los items del menú
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => item.classList.remove("active"));

    // 3. Mostrar la sección seleccionada
    const seccionElement = document.getElementById(`seccion-${seccion}`);
    if (seccionElement) {
        seccionElement.style.display = "block";
    }

    // 4. Marcar como activo el item del menú
    const navActivo = document.getElementById(`nav-${seccion}`);
    if (navActivo) {
        navActivo.classList.add("active");
    }

    // 5. Actualizar título
    const titulos = {
        resumen: "Resumen de Cuenta",
        transacciones: "Resumen de Transacciones",
        consignacion: "Consignación Electrónica",
        retiro: "Retiro de Dinero",
        servicios: "Pago de Servicios Públicos",
        certificado: "Certificado Bancario",
    };
    document.getElementById("tituloPagina").textContent = titulos[seccion] || "Dashboard";

    // 6. Cargar datos específicos de cada sección
    const usuario = obtenerUsuarioActual();
    const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`;

    switch (seccion) {
        case "resumen":
            actualizarResumen();
            break;

        case "transacciones":
            cargarTransacciones();
            break;

        case "consignacion":
            document.getElementById("consigCuenta").textContent = usuario.numeroCuenta;
            document.getElementById("consigTitular").textContent = nombreCompleto;
            document.getElementById("montoConsignacion").value = "";
            document.getElementById("resumenConsignacion").style.display = "none";
            break;

        case "retiro":
            document.getElementById("retiroCuenta").textContent = usuario.numeroCuenta;
            document.getElementById("retiroTitular").textContent = nombreCompleto;
            document.getElementById("retiroSaldo").textContent = formatearMoneda(usuario.saldo);
            document.getElementById("montoRetiro").value = "";
            document.getElementById("resumenRetiro").style.display = "none";
            break;

        case "servicios":
            document.getElementById("servicioCuenta").textContent = usuario.numeroCuenta;
            document.getElementById("servicioTitular").textContent = nombreCompleto;
            document.getElementById("servicioSaldo").textContent = formatearMoneda(usuario.saldo);
            document.getElementById("tipoServicio").value = "";
            document.getElementById("referenciaServicio").value = "";
            document.getElementById("montoServicio").value = "";
            document.getElementById("resumenServicio").style.display = "none";
            break;

        case "certificado":
            generarCertificado();
            break;
    }

    // Cerrar sidebar en móvil
    document.getElementById("sidebar").classList.remove("open");
}

// ==============================
// CARGAR TRANSACCIONES
// ==============================

function cargarTransacciones() {
    const usuario = obtenerUsuarioActual();
    const tbody = document.getElementById("tablaTransacciones");
    const sinTrans = document.getElementById("sinTransacciones");

    // Limpiar tabla
    tbody.innerHTML = "";

    if (usuario.transacciones.length === 0) {
        sinTrans.style.display = "block";
        return;
    }

    sinTrans.style.display = "none";

    // Obtener las últimas 10 transacciones
    // slice(-10) toma los últimos 10 elementos
    // reverse() los pone de más reciente a más antiguo
    const ultimas10 = usuario.transacciones.slice(-10).reverse();

    // Crear una fila por cada transacción
    ultimas10.forEach((trans) => {
        const fila = document.createElement("tr");

        // Determinar si es positivo (consignación) o negativo (retiro/pago)
        const esPositivo = trans.tipo === "Consignación";
        const claseValor = esPositivo ? "valor-positivo" : "valor-negativo";
        const signo = esPositivo ? "+" : "-";

        // innerHTML nos permite insertar HTML directamente
        fila.innerHTML = `
            <td>${formatearFecha(trans.fecha)}</td>
            <td>${trans.referencia}</td>
            <td>${trans.tipo}</td>
            <td>${trans.concepto}</td>
            <td class="${claseValor}">${signo} ${formatearMoneda(trans.valor)}</td>
        `;

        tbody.appendChild(fila);
    });
}

// ==============================
// CONSIGNACIÓN ELECTRÓNICA
// ==============================

function realizarConsignacion() {
    // 1. Validar monto
    const montoInput = document.getElementById("montoConsignacion");
    const errorEl = document.getElementById("errConsignacion");
    const monto = parseFloat(montoInput.value);

    if (!monto || monto <= 0) {
        errorEl.textContent = "Ingrese un monto válido mayor a 0";
        return;
    }
    errorEl.textContent = "";

    // 2. Crear el registro de la transacción
    const transaccion = {
        fecha: new Date().toISOString(),
        referencia: generarReferencia(),
        tipo: "Consignación",
        concepto: "Consignación por canal electrónico",
        valor: monto,
    };

    // 3. Actualizar saldo y agregar transacción
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex((u) => u.numId === usuarioActual.numId);

    // findIndex retorna la posición del usuario en el array
    usuarios[indice].saldo += monto; // Sumar al saldo
    usuarios[indice].transacciones.push(transaccion);
    guardarUsuarios(usuarios);

    // 4. Mostrar resumen
    document.getElementById("resumenConsignacionContent").innerHTML = `
        <h3>✅ Consignación Exitosa</h3>
        <p><strong>Fecha:</strong> ${formatearFecha(transaccion.fecha)}</p>
        <p><strong>Referencia:</strong> ${transaccion.referencia}</p>
        <p><strong>Tipo:</strong> ${transaccion.tipo}</p>
        <p><strong>Concepto:</strong> ${transaccion.concepto}</p>
        <p><strong>Valor:</strong> ${formatearMoneda(transaccion.valor)}</p>
        <p><strong>Nuevo saldo:</strong> ${formatearMoneda(usuarios[indice].saldo)}</p>
    `;
    document.getElementById("resumenConsignacion").style.display = "block";

    // 5. Limpiar input
    montoInput.value = "";
}

// ==============================
// RETIRO DE DINERO
// ==============================

function realizarRetiro() {
    const montoInput = document.getElementById("montoRetiro");
    const errorEl = document.getElementById("errRetiro");
    const monto = parseFloat(montoInput.value);

    if (!monto || monto <= 0) {
        errorEl.textContent = "Ingrese un monto válido mayor a 0";
        return;
    }

    // Verificar que tenga saldo suficiente
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex((u) => u.numId === usuarioActual.numId);

    if (monto > usuarios[indice].saldo) {
        errorEl.textContent = "Saldo insuficiente para realizar el retiro";
        return;
    }
    errorEl.textContent = "";

    const transaccion = {
        fecha: new Date().toISOString(),
        referencia: generarReferencia(),
        tipo: "Retiro",
        concepto: "Retiro de dinero",
        valor: monto,
    };

    usuarios[indice].saldo -= monto; // Restar del saldo
    usuarios[indice].transacciones.push(transaccion);
    guardarUsuarios(usuarios);

    document.getElementById("resumenRetiroContent").innerHTML = `
        <h3>✅ Retiro Exitoso</h3>
        <p><strong>Fecha:</strong> ${formatearFecha(transaccion.fecha)}</p>
        <p><strong>Referencia:</strong> ${transaccion.referencia}</p>
        <p><strong>Tipo:</strong> ${transaccion.tipo}</p>
        <p><strong>Concepto:</strong> ${transaccion.concepto}</p>
        <p><strong>Valor:</strong> ${formatearMoneda(transaccion.valor)}</p>
        <p><strong>Nuevo saldo:</strong> ${formatearMoneda(usuarios[indice].saldo)}</p>
    `;
    document.getElementById("resumenRetiro").style.display = "block";

    // Actualizar saldo mostrado
    document.getElementById("retiroSaldo").textContent = formatearMoneda(usuarios[indice].saldo);
    montoInput.value = "";
}

// ==============================
// PAGO DE SERVICIOS PÚBLICOS
// ==============================

function pagarServicio() {
    let esValido = true;

    // Validar servicio seleccionado
    const servicio = document.getElementById("tipoServicio").value;
    if (!servicio) {
        document.getElementById("errTipoServicio").textContent = "Seleccione un servicio";
        esValido = false;
    } else {
        document.getElementById("errTipoServicio").textContent = "";
    }

    // Validar referencia
    const referenciaPago = document.getElementById("referenciaServicio").value.trim();
    if (!referenciaPago) {
        document.getElementById("errReferenciaServicio").textContent = "Ingrese la referencia";
        esValido = false;
    } else {
        document.getElementById("errReferenciaServicio").textContent = "";
    }

    // Validar monto
    const monto = parseFloat(document.getElementById("montoServicio").value);
    if (!monto || monto <= 0) {
        document.getElementById("errMontoServicio").textContent = "Ingrese un valor válido";
        esValido = false;
    } else {
        document.getElementById("errMontoServicio").textContent = "";
    }

    if (!esValido) return;

    // Verificar saldo
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex((u) => u.numId === usuarioActual.numId);

    if (monto > usuarios[indice].saldo) {
        document.getElementById("errMontoServicio").textContent = "Saldo insuficiente";
        return;
    }

    const transaccion = {
        fecha: new Date().toISOString(),
        referencia: generarReferencia(),
        tipo: "Retiro",
        concepto: `Pago de servicio público ${servicio}`,
        valor: monto,
    };

    usuarios[indice].saldo -= monto;
    usuarios[indice].transacciones.push(transaccion);
    guardarUsuarios(usuarios);

    document.getElementById("resumenServicioContent").innerHTML = `
        <h3>✅ Pago Exitoso</h3>
        <p><strong>Fecha:</strong> ${formatearFecha(transaccion.fecha)}</p>
        <p><strong>Referencia:</strong> ${transaccion.referencia}</p>
        <p><strong>Tipo:</strong> ${transaccion.tipo}</p>
        <p><strong>Concepto:</strong> ${transaccion.concepto}</p>
        <p><strong>Ref. de pago:</strong> ${referenciaPago}</p>
        <p><strong>Valor:</strong> ${formatearMoneda(transaccion.valor)}</p>
        <p><strong>Nuevo saldo:</strong> ${formatearMoneda(usuarios[indice].saldo)}</p>
    `;
    document.getElementById("resumenServicio").style.display = "block";

    document.getElementById("servicioSaldo").textContent = formatearMoneda(usuarios[indice].saldo);
    document.getElementById("tipoServicio").value = "";
    document.getElementById("referenciaServicio").value = "";
    document.getElementById("montoServicio").value = "";
}

// ==============================
// CERTIFICADO BANCARIO
// ==============================

function generarCertificado() {
    const usuario = obtenerUsuarioActual();
    const tiposId = {
        CC: "Cédula de Ciudadanía",
        TI: "Tarjeta de Identidad",
        CE: "Cédula de Extranjería",
        PP: "Pasaporte",
    };

    document.getElementById("certFechaExpedicion").textContent =
        `Fecha de expedición: ${formatearSoloFecha(new Date().toISOString())}`;
    document.getElementById("certTitular").textContent =
        `${usuario.nombres} ${usuario.apellidos}`;
    document.getElementById("certTipoId").textContent = tiposId[usuario.tipoId] || usuario.tipoId;
    document.getElementById("certNumId").textContent = usuario.numId;
    document.getElementById("certNumeroCuenta").textContent = usuario.numeroCuenta;
    document.getElementById("certFechaApertura").textContent =
        formatearSoloFecha(usuario.fechaCreacion);
}

// ==============================
// CERRAR SESIÓN
// ==============================

function cerrarSesion() {
    // Eliminar la sesión del sessionStorage
    sessionStorage.removeItem("acmebank_sesion");
    // Redirigir al login
    window.location.href = "index.html";
}

// ==============================
// SIDEBAR RESPONSIVE (MÓVIL)
// ==============================

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
}

// Cerrar sidebar al hacer clic fuera (en móvil)
document.getElementById("mainContent").addEventListener("click", function () {
    document.getElementById("sidebar").classList.remove("open");
});

// ==============================
// EJECUTAR AL CARGAR LA PÁGINA
// ==============================
inicializarDashboard();