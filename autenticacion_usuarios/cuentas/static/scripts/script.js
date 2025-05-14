function home() {
// Mostrar alerta con opciones
Swal.fire({
    title: "Bienvenido a la Direcciòn General de Patrimonio",
    text: "¿Desea registrar usuario o continuar?",
    imageUrl: "/static/img/favi_patrimonio.png",
    imageWidth: 100,
    imageHeight: 100,
    showCancelButton: true,
    confirmButtonText: "Ingresar",
    cancelButtonText: "Registrar"
}).then((result) => {
    if (result.isConfirmed) {
       window.location.href = "/login/"; // Redirigir a la página de bienvenida
    } else {
        window.location.href = "/register/";  // Redirigir a la página de registro
    }
});
}

function access() {
    const email = document.getElementById('emailBox').value.trim();
    const password = document.getElementById('passBox').value.trim();

    if (email === "" || password === "") {
        Swal.fire({
            icon: "error",
            title: "Ups",
            text: "Debes completar los campos."
        });
        return;
    }

    // Enviar solicitud al backend
    fetch("/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.redirect) {
            window.location.href = data.redirect;
        } else {
            Swal.fire({
                icon: "error",
                title: "Ups",
                text: data.error
            });
        }
    })
    .catch(error => {
        console.error("Error en la autenticación:", error);
    });
}

document.getElementById("loginBtn").addEventListener("click", function(event) {
    event.preventDefault();
    access();
});


document.addEventListener("DOMContentLoaded", function () {
    const registerBtn = document.getElementById("registerBtn");

    if (registerBtn) {
        registerBtn.addEventListener("click", function (event) {
            event.preventDefault(); // Evita la recarga de la página
            agregarUsuario(); // Llama a la función de registro
        });
    }
});

function agregarUsuario() {
    console.log("Botón de registro presionado"); // Prueba en la consola para ver si funciona

    // Obtener valores del formulario
    const dni = document.getElementById("dni").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("email").value;
    const password = document.getElementById("pass").value;
    const area = document.getElementById("area").value;

    // Validar que los campos no estén vacíos
    if (!dni || !nombre || !apellido || !correo || !password || !area) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Todos los campos son obligatorios.",
        });
        return;
    }

    // Crear objeto con los datos
    const data = {
        dni: dni,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        password: password,
        area: area
    };

    // Enviar datos al servidor
    fetch("/registro/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.success) {
            Swal.fire({
                icon: "success",
                title: "Registro exitoso",
                text: "Usuario registrado correctamente.",
            }).then(() => {
                window.location.href = "/home/"; // Redirigir al home después del registro
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: responseData.error || "Hubo un problema al registrar el usuario.",
            });
        }
    })
    .catch(error => {
        console.error("Error:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo conectar con el servidor.",
        });
    });
}

// Función para obtener el token CSRF en Django
function getCSRFToken() {
    return document.cookie.split(";")
        .map(cookie => cookie.trim().split("="))
        .find(cookie => cookie[0] === "csrftoken")?.[1] || "";
}
