// Variables globales

// obtener saldo guardado en localStorage
let $saldo = localStorage.getItem("saldo");
if ($saldo == null) { // si no existe saldo, inicializar en $800.000
    $saldo = 800000;
} else {
    $saldo = parseInt($saldo);
}

//contactos iniciales
const contactosIniciales = [
    ["Gregorio Milagros Ramos", "Banco de Chile", "Cuenta: 751945138"],
    ["Ana María López", "Banco Estado", "Cuenta: 602341279"],
    ["Luis Fernando García", "Banco Santander", "Cuenta: 459812673"]
];
// guardar contactos iniciales en localStorage si no existen
if (localStorage.getItem("contactos") == null) {
    localStorage.setItem("contactos", JSON.stringify(contactosIniciales));
}

// obtener historial guardado en localStorage
if (localStorage.getItem("historial") == null) {
    let historialInicial = [[]]; // historial vacio
    localStorage.setItem("historial", JSON.stringify(historialInicial));
}

// funciones

// validar formulario de login
function validateForm() {
    // obtener valores de los campos
    const user = document.forms["checkLogin"]["logUser"].value;
    const pass = document.forms["checkLogin"]["logPass"].value;

    // validar usuario y contraseña
    if (user != "admin@python.com" || pass != "admin123") {
        alert("Usuario no registrado");
        return false;
    }
}

// Depositar dinero
function depositMoney() {
    // obtener monto a depositar
    monto = parseInt(document.forms["deposit"]["monto"].value);

    // actualizar saldo
    $saldo = $saldo + monto;
    newSaldo();

    // agregar al historial
    tipoTransaccion = "Deposito";
    destinatario = "Cuenta Propia";
    addHistory(tipoTransaccion, destinatario, monto);

    // mostrar alerta de confirmacion
    alert("Has depositado: $" + monto + "\nTu nuevo saldo es: $" + $saldo);
    return false; // evitar recarga de pagina
}

// Retirar dinero
function withdrawMoney() {
    // obtener monto a retirar
    monto = parseInt(document.forms["withdraw"]["monto"].value);

    // validar saldo suficiente
    if (monto > $saldo) {
        alert("Saldo insuficiente para realizar el retiro.");
        return false; // evitar recarga de pagina
    } else {
        // actualizar saldo
        $saldo = $saldo - monto;
        newSaldo();

        // agregar al historial
        tipoTransaccion = "Retiro";
        destinatario = "Cuenta Propia";
        addHistory(tipoTransaccion, destinatario, monto);

        // mostrar alerta de confirmacion
        alert("Has retirado: $" + monto + "\nTu nuevo saldo es: $" + $saldo);
        return false; // evitar recarga de pagina
    }
}

// Agregar contacto nuevo
function addContact() {
    // obtener valores del formulario
    const nombre = document.forms["formAgregarContacto"]["nuevoNombre"].value;
    const banco = document.forms["formAgregarContacto"]["nuevoBanco"].value;
    const cuenta = document.forms["formAgregarContacto"]["nuevaCuenta"].value;

    // crear nuevo contacto y guardarlo en localStorage
    const nuevoContacto = [nombre, banco, "Cuenta: " + cuenta];
    const tablaContactos = JSON.parse(localStorage.getItem("contactos"));
    tablaContactos.push(nuevoContacto);
    localStorage.setItem("contactos", JSON.stringify(tablaContactos));

    // mostrar alerta de confirmacion
    alert("Contacto agregado exitosamente.");
    return false; // evitar recarga de pagina
}

// Generar lista de contactos
function generateContacts(contactos) {
    const lista = document.getElementById('listaContactos');
    lista.innerHTML = ""; // Limpiamos el contenedor antes de agregar nuevos contactos

    // Verificar si hay contactos
    if (contactos.length === 0) {
        lista.innerHTML = `<div class="col-12 text-center text-muted">No se encontraron contactos.</div>`;
        return;
    }

    // Recorrer cada contacto y crear su tarjeta
    contactos.forEach(([nombre, banco, cuenta]) => {
        // 1. Crear el contenedor principal de la tarjeta
        const card = document.createElement('div');
        card.className = 'card text-bg-success m-3 col';
        card.style.maxWidth = '20rem';

        // 2. Crear el Header (Nombre)
        const header = document.createElement('div');
        header.className = 'card-header';
        header.textContent = nombre;

        // 3. Crear el Body
        const body = document.createElement('div');
        body.className = 'card-body';

        // 4. Crear Título (Banco), Texto (Cuenta) y Botón
        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = banco;

        const text = document.createElement('p');
        text.className = 'card-text';
        text.textContent = cuenta;

        const btnContainer = document.createElement('div');
        btnContainer.className = 'd-grid gap-2';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline-light btn-enviar-dinero';
        btn.textContent = 'Enviar dinero';

        // 5. Ensamblar las piezas (como un Lego)
        btnContainer.appendChild(btn);
        body.appendChild(title);
        body.appendChild(text);
        body.appendChild(btnContainer);

        card.appendChild(header);
        card.appendChild(body);

        // Asignar evento de transferencia al botón
        // Buscamos el botón dentro de la tarjeta recién creada
        const btnEnv = card.querySelector('.btn-enviar-dinero');

        // Asignamos el evento 
        btnEnv.addEventListener('click', () => {
            // 1. Ponemos el nombre del contacto en el input "readonly"
            inputDestinatario.value = nombre;
            // 2. Limpiamos el monto por si hubo un envío previo
            document.getElementById('inputMonto').value = "";
            // 3. Mostramos el modal
            elModal.show();
        });

        // 6. Inyectar en el contenedor principal
        lista.appendChild(card);
    });
}


// Transferir dinero
function sendMoney() {
    // obtener valores del formulario
    destinatario = document.forms["formTransferencia"]["inputDestinatario"].value;
    monto = parseInt(document.forms["formTransferencia"]["inputMonto"].value);

    // validar saldo suficiente
    if (monto > $saldo) {
        alert("Saldo insuficiente para realizar la transferencia.");
        return false; // evitar recarga de pagina
    } else {
        // actualizar saldo
        $saldo = $saldo - monto;
        newSaldo();

        // agregar al historial
        tipoTransaccion = "Transferencia";
        addHistory(tipoTransaccion, destinatario, monto);

        // mostrar alerta de confirmacion
        alert("Has transferido: $" + monto + " a " + destinatario + "\nTu nuevo saldo es: $" + $saldo);

        // Cerrar el modal manualmente
        elModal.hide();
        return false; // evitar recarga de pagina
    }
}

// Obtener fecha y hora para el historial
function getFechaHora() {
    // Obtener la fecha y hora actual
    const ahora = new Date();

    // Extraemos los componentes
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');

    const dia = ahora.getDate().toString().padStart(2, '0');
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve meses de 0 a 11, por eso sumamos 1
    const anio = ahora.getFullYear();

    // Construimos la cadena con el formato solicitado
    // Formato sugerido: HH:mm:ss - DD/MM/YYYY
    const fechaFinal = `${horas}:${minutos}:${segundos} - ${dia}/${mes}/${anio}`;
    const fecha = fechaFinal.toString();
    return fecha;
}

// Agregar al historial de transacciones
function addHistory() {
    // obtener fecha y hora con formato HH:mm:ss - DD/MM/YYYY
    const fecha = getFechaHora();

    // crear nuevo registro y guardarlo en localStorage
    const newHistorial = [fecha, tipoTransaccion, destinatario, "$" + monto];
    const newTablaHistorial = JSON.parse(localStorage.getItem("historial"));
    newTablaHistorial.unshift(newHistorial); // agregar al inicio del array con unshift
    localStorage.setItem("historial", JSON.stringify(newTablaHistorial));
}

// guardar nuevo saldo en localStorage
function newSaldo() {
    localStorage.setItem("saldo", $saldo);
}


// ------------- funciones de prueba y depuracion -------------
function pruebaSaldo() {
    $saldo = $saldo + 100000;
    newSaldo();
    document.getElementById("miSaldo").innerHTML = "$" + $saldo;
}

function resetSaldo() {
    $saldo = 800000;
    newSaldo();
    document.getElementById("miSaldo").innerHTML = "$" + $saldo;
}

function resetHistorial() {
    let resetHistorial = [[]];
    localStorage.setItem("historial", JSON.stringify(resetHistorial));
}

function borrarLocalStorage() {
    localStorage.clear();
}