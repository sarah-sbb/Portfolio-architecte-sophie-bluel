document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const loginBtn = document.getElementById('loginBtn');
    const catchAPIurl = "http://localhost:5678/api";

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${catchAPIurl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                window.location.href = 'index.html';
            } else {
                alert('Email ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    });
});
