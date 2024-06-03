document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;

    if (loginUsername && loginPassword) {
        console.log('Login Usuario:', loginUsername);
        console.log('Login Contraseña:', loginPassword);
        alert('Inicio de sesión exitoso!');
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const registerUsername = document.getElementById('registerUsername').value;
    const registerPassword = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerEmail = document.getElementById('registerEmail').value;

    if (fullName && registerUsername && registerPassword && confirmPassword && registerEmail) {
        if (registerPassword === confirmPassword) {
            console.log('Nombre Completo:', fullName);
            console.log('Usuario:', registerUsername);
            console.log('Contraseña:', registerPassword);
            console.log('Correo Electrónico:', registerEmail);
            alert('Registro exitoso!');
        } else {
            alert('Las contraseñas no coinciden.');
        }
    } else {
        alert('Por favor, completa todos los campos.');
    }
});
