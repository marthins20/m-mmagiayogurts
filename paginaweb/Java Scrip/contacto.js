document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        alert('¡Mensaje enviado con éxito!');
        form.reset();
      } else {
        alert('Hubo un problema al enviar tu mensaje.');
      }
    })
    .catch(() => {
      alert('Error de conexión al enviar el mensaje.');
    });
});
