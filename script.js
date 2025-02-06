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
        "¿De verdad de la buena?",
        "Piénsalo mejor...",
        "¿No te gustaría reconsiderarlo?",
        "Una última oportunidad...",
        "¿Estás completamente segura?",
        "Mira que te vas a arrepentir...",
        "¿De verdad me vas a decir que no? 🥺",
        "No acepto un no por respuesta 😊"
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
        }
    });

    // Cargar imagen aleatoria
    const cargarImagenAleatoria = () => {
        const randomImage = document.getElementById('randomImage');
        // Aquí normalmente se usaría una API de imágenes, pero para el ejemplo
        // usamos un placeholder. En producción, podrías usar algo como:
        // randomImage.src = `https://source.unsplash.com/400x300/?love,valentine`;
        randomImage.src = '/api/placeholder/400/300';
    };

    cargarImagenAleatoria();
});