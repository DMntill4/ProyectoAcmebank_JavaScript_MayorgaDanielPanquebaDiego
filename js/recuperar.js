// ==============================
// LÓGICA DE RECUPERACIÓN DE CONTRASEÑA
//
// Este flujo tiene 2 pasos:
//   Paso 1: El usuario ingresa tipo ID + número + email
//           Si los datos coinciden con una cuenta, avanza al paso 2
//   Paso 2: El usuario escribe su nueva contraseña
//           Si es válida, se guarda y se redirige al login
// ==============================

// Esta variable guarda al usuario encontrado en el paso 1
// para usarla luego en el paso 2
// La declaramos aquí (fuera de las funciones) para que ambas funciones
// puedan acceder a ella
let usuarioVerificado = null;

// ==============================
// PASO 1: Verificar identidad
// Se llama cuando el usuario hace clic en "Verificar"
// ==============================
function verificarIdentidad() {
    // 1. Limpiar mensajes anteriores
    document.getElementById("mensajeVerificar").style.display = "none";

    // 2. Validar que todos los campos estén llenos
    let esValido = true;

    if (!validarCampo("recTipoId", "errRecTipoId", "Seleccione un tipo de identificación")) esValido = false;
    if (!validarCampo("recNumId", "errRecNumId", "Ingrese su número de identificación")) esValido = false;
    if (!validarCampo("recEmail", "errRecEmail", "Ingrese su correo electrónico")) esValido = false;

    if (!esValido) return;

    // 3. Obtener los valores ingresados
    const tipoId = document.getElementById("recTipoId").value;
    const numId = document.getElementById("recNumId").value.trim();
    const email = document.getElementById("recEmail").value.trim().toLowerCase();
    // .toLowerCase() para que "Correo@Email.com" y "correo@email.com" sean iguales

    // 4. Validar formato del email
    if (!validarEmail(email)) {
        document.getElementById("errRecEmail").textContent = "Ingrese un correo electrónico válido";
        document.getElementById("recEmail").classList.add("input-error");
        return;
    }

    // 5. Buscar el usuario en localStorage
    const usuarios = obtenerUsuarios();

    // find() busca el PRIMER usuario que cumpla TODAS las condiciones
    const usuarioEncontrado = usuarios.find(function(u) {
        return (
            u.tipoId === tipoId &&
            u.numId === numId &&
            u.email.toLowerCase() === email
        );
    });

    // 6. Si no se encontró ningún usuario con esos datos
    if (!usuarioEncontrado) {
        mostrarAlerta(
            "mensajeVerificar",
            "No encontramos una cuenta con esa información. Verifique el tipo de ID, número y correo.",
            "error"
        );
        return;
    }

    // 7. Guardamos el usuario encontrado para usarlo en el paso 2
    usuarioVerificado = usuarioEncontrado;

    // 8. Ocultamos el formulario del paso 1 y mostramos el paso 2
    document.getElementById("formVerificar").style.display = "none";
    document.getElementById("formNuevaPass").style.display = "block";
}

// ==============================
// PASO 2: Cambiar la contraseña
// Se llama cuando el usuario hace clic en "Cambiar Contraseña"
// ==============================
function cambiarContrasena() {
    // Seguridad: si por alguna razón no hay usuario verificado, redirigir
    if (!usuarioVerificado) {
        window.location.href = "recuperar.html";
        return;
    }

    // 1. Validar que los campos estén llenos
    let esValido = true;

    if (!validarCampo("nuevaPass", "errNuevaPass", "Ingrese su nueva contraseña")) esValido = false;
    if (!validarCampo("confirmarNuevaPass", "errConfirmarNuevaPass", "Confirme su contraseña")) esValido = false;

    if (!esValido) return;

    // 2. Obtener los valores
    const nuevaPass = document.getElementById("nuevaPass").value;
    const confirmarPass = document.getElementById("confirmarNuevaPass").value;

    // 3. Validar que tenga mínimo 8 caracteres
    if (!validarFormatoPassword(nuevaPass)) {
        document.getElementById("errNuevaPass").textContent = "La contraseña debe tener mínimo 8 caracteres";
        document.getElementById("nuevaPass").classList.add("input-error");
        return;
    }

    // 4. Validar que las dos contraseñas sean iguales
    if (nuevaPass !== confirmarPass) {
        document.getElementById("errConfirmarNuevaPass").textContent = "Las contraseñas no coinciden";
        document.getElementById("confirmarNuevaPass").classList.add("input-error");
        return;
    }

    // 5. Buscar y actualizar la contraseña en localStorage
    const usuarios = obtenerUsuarios();

    // findIndex() retorna la POSICIÓN del usuario en el array (-1 si no existe)
    const indice = usuarios.findIndex(function(u) {
        return u.tipoId === usuarioVerificado.tipoId && u.numId === usuarioVerificado.numId;
    });

    // Si por algún motivo el usuario ya no existe (caso extremo)
    if (indice === -1) {
        mostrarAlerta("mensajeCambio", "Ocurrió un error inesperado. Intente nuevamente.", "error");
        return;
    }

    // 6. Actualizamos la contraseña
    usuarios[indice].password = nuevaPass;
    guardarUsuarios(usuarios); // Guardamos los cambios en localStorage

    // 7. Mostramos mensaje de éxito
    mostrarAlerta(
        "mensajeCambio",
        "Contraseña actualizada correctamente. Redirigiendo al inicio de sesión...",
        "success"
    );

    // 8. Limpiamos el usuario verificado (buena práctica de seguridad)
    usuarioVerificado = null;

    // 9. Redirigimos al login después de 2.5 segundos
    // setTimeout ejecuta una función después de esperar el tiempo indicado (en milisegundos)
    setTimeout(function() {
        window.location.href = "index.html";
    }, 2500);
}

// ==============================
// VALIDACIÓN EN TIEMPO REAL
// Limpiamos los errores mientras el usuario escribe
// ==============================
document.addEventListener("DOMContentLoaded", function() {
    const campos = document.querySelectorAll("#formVerificar input, #formVerificar select");

    campos.forEach(function(campo) {
        campo.addEventListener("input", function() {
            // Limpiar el error de este campo cuando el usuario empiece a corregirlo
            const errorSpan = this.parentElement.querySelector(".error-msg");
            if (errorSpan) {
                errorSpan.textContent = "";
            }
            this.classList.remove("input-error");
        });
    });
});
