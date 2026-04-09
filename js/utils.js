// ==============================
// UTILIDADES COMPARTIDAS
// Estas funciones se usan en todas las páginas
// ==============================

// --- FORMATEAR MONEDA ---
// Recibe un número y lo muestra como dinero colombiano
// Ejemplo: formatearMoneda(50000) => "$ 50.000,00"
function formatearMoneda(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(valor);
}

// --- FORMATEAR FECHA ---
// Convierte un string de fecha a formato legible
// Ejemplo: formatearFecha("2025-04-09T...") => "9 de abril de 2025, 10:30 a.m."
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// --- FORMATEAR SOLO FECHA (sin hora) ---
function formatearSoloFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// --- GENERAR NÚMERO DE CUENTA ---
// Crea un número de cuenta aleatorio de 10 dígitos
// Empieza con "40" (como si fuera el código del banco)
function generarNumeroCuenta() {
    // Math.random() genera un decimal entre 0 y 1
    // Lo multiplicamos y convertimos a string para obtener dígitos
    const random = Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, "0"); // padStart rellena con ceros si hace falta
    return "40" + random;
}

// --- GENERAR NÚMERO DE REFERENCIA ---
// Crea un código de referencia para las transacciones
// Ejemplo: "REF-A3B7C2D1"
function generarReferencia() {
    // Tomamos parte del timestamp y caracteres aleatorios
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let referencia = "REF-";
    for (let i = 0; i < 8; i++) {
        // charAt obtiene el carácter en una posición
        // Math.random() * length nos da una posición aleatoria
        const indice = Math.floor(Math.random() * caracteres.length);
        referencia += caracteres.charAt(indice);
    }
    return referencia;
}

// --- MOSTRAR/OCULTAR CONTRASEÑA ---
// Cambia el tipo del input entre "password" y "text"
function togglePassword(inputId, boton) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        boton.textContent = "🙈";
    } else {
        input.type = "password";
        boton.textContent = "👁";
    }
}

// --- VALIDAR QUE UN CAMPO NO ESTÉ VACÍO ---
// Retorna true si es válido, false si está vacío
// También muestra/oculta el mensaje de error
function validarCampo(inputId, errorId, mensaje) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    const valor = input.value.trim(); // trim() quita espacios al inicio y final

    if (valor === "") {
        error.textContent = mensaje;
        input.classList.add("input-error");
        return false;
    } else {
        error.textContent = "";
        input.classList.remove("input-error");
        return true;
    }
}

// --- VALIDAR EMAIL ---
// Usa una expresión regular (regex) para verificar el formato
function validarEmail(email) {
    // Esta regex verifica: texto@texto.texto
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// --- VALIDAR CONTRASEÑA ---
// Mínimo 8 caracteres, al menos 1 número y 1 letra
function validarFormatoPassword(password) {
    return password.length >= 8;
}

// --- OBTENER USUARIOS DE LOCALSTORAGE ---
// LocalStorage guarda todo como texto (string)
// JSON.parse convierte ese texto de vuelta a un array/objeto
function obtenerUsuarios() {
    const datos = localStorage.getItem("acmebank_usuarios");
    // Si no hay datos, retorna un array vacío
    return datos ? JSON.parse(datos) : [];
}

// --- GUARDAR USUARIOS EN LOCALSTORAGE ---
// JSON.stringify convierte el array/objeto a texto
function guardarUsuarios(usuarios) {
    localStorage.setItem("acmebank_usuarios", JSON.stringify(usuarios));
}

// --- OBTENER USUARIO LOGUEADO ---
// Cuando el usuario inicia sesión, guardamos su ID en sessionStorage
function obtenerUsuarioActual() {
    const id = sessionStorage.getItem("acmebank_sesion");
    if (!id) return null;

    const usuarios = obtenerUsuarios();
    // find() busca el primer elemento que cumpla la condición
    return usuarios.find((u) => u.numId === id) || null;
}

// --- MOSTRAR ALERTA ---
function mostrarAlerta(elementId, mensaje, tipo) {
    const el = document.getElementById(elementId);
    el.textContent = mensaje;
    el.className = `alert alert-${tipo}`;
    el.style.display = "block";
}

// --- IMPRIMIR UNA SECCIÓN ESPECÍFICA ---
// Crea una ventana nueva solo con el contenido a imprimir
function imprimirSeccion(seccionId) {
    const contenido = document.getElementById(seccionId).innerHTML;
    const ventana = window.open("", "_blank");
    ventana.document.write(`
        <html>
        <head>
            <title>Banco Acme - Impresión</title>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'DM Sans', sans-serif; padding: 40px; color: #1e293b; }
                h2, h3 { font-family: 'Outfit', sans-serif; }
                table { width: 100%; border-collapse: collapse; margin: 16px 0; }
                th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem; }
                th { background: #f8fafc; font-weight: 600; color: #475569; }
                p { margin: 8px 0; }
                .valor-positivo { color: #16a34a; }
                .valor-negativo { color: #dc2626; }
                .logo-icon { display: inline-flex; width: 36px; height: 36px; background: #1a56db; color: white; border-radius: 8px; align-items: center; justify-content: center; font-weight: 700; }
            </style>
        </head>
        <body>${contenido}</body>
        </html>
    `);
    ventana.document.close();
    // Esperamos un momento para que carguen las fuentes
    setTimeout(() => ventana.print(), 500);
}