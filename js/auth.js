// ==============================
// LÓGICA DE INICIO DE SESIÓN
// ==============================

// Esta función se ejecuta cuando el usuario hace clic en "Iniciar Sesión"
function iniciarSesion() {
    // 1. Limpiar mensajes de error previos
    document.getElementById("mensajeError").style.display = "none";

    // 2. Validar que todos los campos estén llenos
    let esValido = true;

    // validarCampo retorna false si el campo está vacío
    if (!validarCampo("tipoId", "errorTipoId", "Seleccione un tipo")) esValido = false;
    if (!validarCampo("numId", "errorNumId", "Ingrese su número")) esValido = false;
    if (!validarCampo("password", "errorPassword", "Ingrese su contraseña")) esValido = false;

    // Si algún campo falló, no continuar
    if (!esValido) return;

    // 3. Obtener los valores de los campos
    const tipoId = document.getElementById("tipoId").value;
    const numId = document.getElementById("numId").value.trim();
    const password = document.getElementById("password").value;

    // 4. Buscar el usuario en localStorage
    const usuarios = obtenerUsuarios();

    // find() busca el primer usuario que coincida con TODOS los criterios
    const usuario = usuarios.find(
        (u) => u.tipoId === tipoId && u.numId === numId && u.password === password
    );

    // 5. Verificar resultado
    if (usuario) {
        // ¡Credenciales correctas!
        // Guardamos el ID del usuario en sessionStorage para mantener la sesión
        // sessionStorage se borra cuando se cierra el navegador
        sessionStorage.setItem("acmebank_sesion", usuario.numId);

        // Redirigir al dashboard
        window.location.href = "dashboard.html";
    } else {
        // Credenciales incorrectas
        mostrarAlerta(
            "mensajeError",
            "No se pudo validar su identidad. Verifique sus datos e intente nuevamente.",
            "error"
        );
    }
}

// --- VALIDACIÓN EN TIEMPO REAL ---
// Escuchamos el evento "input" en cada campo para validar mientras escribe
document.getElementById("numId").addEventListener("input", function () {
    // Si el usuario empieza a escribir, limpiar el error
    if (this.value.trim() !== "") {
        document.getElementById("errorNumId").textContent = "";
        this.classList.remove("input-error");
    }
});

document.getElementById("password").addEventListener("input", function () {
    if (this.value !== "") {
        document.getElementById("errorPassword").textContent = "";
        this.classList.remove("input-error");
    }
});

// Permitir enviar con Enter
document.getElementById("password").addEventListener("keydown", function (e) {
    if (e.key === "Enter") iniciarSesion();
});