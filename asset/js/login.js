// validar formulario de login (forma remota)
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // FormData captura automáticamente los campos 'email' y 'password'
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:8000/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Caso 1: Requiere MFA (Doble factor)
            if (result.mfa_required) {
                // Guardamos el email temporalmente para la verificación
                localStorage.setItem('pending_email', result.email);
                alert("Código enviado. Revisa la consola de Docker.");
                window.location.href = "verify_mfa.html"; 
            } 
            // Caso 2: Login directo exitoso
            else {
                alert("¡Bienvenido " + result.user.nombres + "!");
                // Guardamos datos básicos del usuario
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = "/asset/page/menu.html"; 
            }
        } else {
            // Manejo de errores del backend (Credenciales inválidas, etc.)
            alert("Error: " + (result.detail || "Revisa tus datos"));
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor.");
    }
});