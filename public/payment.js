document.getElementById('payButton').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = 'Creando pago...';

  try {
    const response = await fetch('/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (data.url) {
      status.textContent = 'Redirigiendo al banco demo...';
      window.location.href = data.url;
    } else {
      status.textContent = 'Error al crear el pago.';
      console.error(data);
    }
  } catch (err) {
    status.textContent = 'Error al conectar con el servidor.';
    console.error('Error:', err);
  }
});



  