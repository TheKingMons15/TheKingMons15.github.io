document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos
    const pantallas = {
        inicial: document.getElementById('inicial'),
        pregunta: document.getElementById('pregunta'),
        respuestaPositiva: document.getElementById('respuestaPositiva')
    };
    
    const dialogo = {
        contenedor: document.getElementById('dialogoPersonalizado'),
        mensaje: document.getElementById('dialogoMensaje'),
        btnNo: document.getElementById('dialogoNo')
    };

    // Mensajes para el diálogo de rechazo
    const mensajesRechazo = [
        "¿Segura?",
        "¿Segurisima?",
        "Analiza muy bien!",
        "Piénsalo mejor...",
        "¿Pamela no te gustaría reconsiderarlo?",
        "¿Mi amorcito corazón estás completamente segura?",
        "Mira que te vas a arrepentir...",
        "¿Mensa de verdad me vas a decir que no? 🥺",
        "No acepto un no por respuesta jajaja😊"
    ];
    
    const textosBoton = [
        "Si...", 
        "Siguiente..", 
        "Ajam", 
        "Ya pense", 
        "NO", 
        "Si Segura", 
        "Nop... ", 
        "Última oportunidad...", 
        "¡Lo pensaste bien, verdad?"
    ];

    let indiceRechazo = 0;

    // Función para cambiar entre pantallas
    function mostrarPantalla(pantallaId) {
        Object.values(pantallas).forEach(pantalla => {
            pantalla.classList.remove('active');
        });
        pantallas[pantallaId].classList.add('active');
    }

    // Función para mostrar el diálogo
    function mostrarDialogo() {
        dialogo.contenedor.classList.add('active');
        dialogo.mensaje.textContent = mensajesRechazo[indiceRechazo];
        dialogo.btnNo.textContent = textosBoton[indiceRechazo]; // Cambiar el texto del botón
    }

    // Función para ocultar el diálogo
    function ocultarDialogo() {
        dialogo.contenedor.classList.remove('active');
        indiceRechazo = 0;
    }

    // Event Listeners
    document.getElementById('btnSiguiente').addEventListener('click', () => {
        mostrarPantalla('pregunta');
    });

    document.getElementById('btnSi').addEventListener('click', () => {
        mostrarPantalla('respuestaPositiva');
    });

    document.getElementById('btnNo').addEventListener('click', () => {
        mostrarDialogo();
    });

    dialogo.btnNo.addEventListener('click', () => {
        indiceRechazo++;
        if (indiceRechazo >= mensajesRechazo.length) {
            ocultarDialogo();
            mostrarPantalla('respuestaPositiva');
        } else {
            dialogo.mensaje.textContent = mensajesRechazo[indiceRechazo];
            dialogo.btnNo.textContent = textosBoton[indiceRechazo]; // Cambiar el texto del botón según el índice
        }
    });

    // Cargar imagen aleatoria
    const cargarImagenAleatoria = () => {
        const randomImage = document.getElementById('randomImage');
        randomImage.src = '/api/placeholder/400/300'; // Imagen de prueba
    };

    cargarImagenAleatoria();
});
