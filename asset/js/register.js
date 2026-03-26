// registrar usuario
const registerForm = document.getElementById('registerForm')
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:8000/api/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert("¡Usuario creado con éxito! Ahora puedes iniciar sesión.");
            window.location.href = "/index.html"; // Redirigir al login
        } else {
            // Manejo de errores específicos (ej: el email ya existe)
            let errorMsg = "";
            for (const field in result) {
                errorMsg += `${field}: ${result[field]}\n`;
            }
            alert("Error en el registro:\n" + errorMsg);
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor de Django.");
    }
});