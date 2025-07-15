const precios = {
  "Durazno": 13000,
  "Maracuyá": 13000,
  "Mora": 13000,
  "Fresa": 13000,
  "Café": 13000,
  "Arequipe con pasas": 13000
};

let carrito = [];

// Recuperar el carrito y los datos del formulario del localStorage
if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
  actualizarCarrito();
}

// Recuperar los datos del formulario si existen en localStorage
document.getElementById("nombre").value = localStorage.getItem("nombre") || "";
document.getElementById("telefono").value = localStorage.getItem("telefono") || "";
document.getElementById("direccion").value = localStorage.getItem("direccion") || "";
document.getElementById("ciudad").value = localStorage.getItem("ciudad") || "";
document.getElementById("pago").value = localStorage.getItem("pago") || "Efectivo";
document.getElementById("diaEntrega").value = localStorage.getItem("diaEntrega") || "Jueves";

// Agregar producto al carrito
function agregarAlCarrito(producto) {
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardar en localStorage
  actualizarCarrito();
  mostrarCarritoFlotante();
}

// Actualizar lista del carrito con cantidades
function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";

  window.conteoProductos = {};
  carrito.forEach(producto => {
    conteoProductos[producto] = (conteoProductos[producto] || 0) + 1;
  });

  let total = 0;
  for (let producto in conteoProductos) {
    const cantidad = conteoProductos[producto];
    const precioUnitario = precios[producto];
    const subtotal = precioUnitario * cantidad;
    total += subtotal;

    const li = document.createElement("li");
    li.innerHTML = `
      ${producto} x${cantidad} - $${subtotal.toLocaleString()} COP
      <button onclick="eliminarProducto('${producto}')">🗑️</button>
    `;
    lista.appendChild(li);
  }

  const totalLi = document.createElement("li");
  totalLi.style.fontWeight = "bold";
  totalLi.textContent = `TOTAL: $${total.toLocaleString()} COP`;
  lista.appendChild(totalLi);

  document.getElementById("contador-carrito").textContent = carrito.length;
}
// Mostrar carrito flotante
function mostrarCarritoFlotante() {
  const carritoDiv = document.getElementById("carrito-flotante");
  carritoDiv.classList.remove("oculto");

  // Ocultar automáticamente después de 8 segundos
  setTimeout(() => {
    carritoDiv.classList.add("oculto");
  }, 30000);
}

// Vaciar carrito
function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  actualizarCarrito();
}
function eliminarProducto(nombreProducto) {
  // Elimina solo UNA instancia del producto (si hay más de uno)
  const index = carrito.indexOf(nombreProducto);
  if (index > -1) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
  }
}

// Enviar pedido por WhatsApp
function enviarWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const direccion = document.getElementById("direccion").value;
  const ciudad = document.getElementById("ciudad").value;
  const pago = document.getElementById("pago").value;
  const diaEntrega = document.getElementById("diaEntrega").value;

  if (!nombre || !telefono || !direccion || !ciudad) {
    alert("Por favor completa todos los campos.");
    return;
  }

  // Guardar los datos del formulario en localStorage
  localStorage.setItem("nombre", nombre);
  localStorage.setItem("telefono", telefono);
  localStorage.setItem("direccion", direccion);
  localStorage.setItem("ciudad", ciudad);
  localStorage.setItem("pago", pago);
  localStorage.setItem("diaEntrega", diaEntrega);

  let mensaje = "Hola, Quiero realizar el siguinte pedido de yogurt:%0A";
  for (let producto in conteoProductos) {
    const cantidad = conteoProductos[producto];
    const subtotal = precios[producto] * cantidad;
    mensaje += `- ${producto} x${cantidad}: $${subtotal.toLocaleString()} COP%0A`;
  }

  const total = carrito.reduce((sum, producto) => sum + precios[producto], 0);
  mensaje += `%0ATOTAL: $${total.toLocaleString()} COP%0A%0A`;
  mensaje += `Datos del cliente:%0A`;
  mensaje += `Nombre: ${nombre}%0A`;
  mensaje += `Teléfono: ${telefono}%0A`;
  mensaje += `Dirección: ${direccion}%0A`;
  mensaje += `Ciudad: ${ciudad}%0A`;
  mensaje += `Medio de pago: ${pago}%0A`;
  mensaje += `Día de entrega: ${diaEntrega}%0A`;

  const numeroWhatsApp = "573043877555";
  const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

  window.open(url, "_blank");

  // Limpiar carrito después de enviar
  localStorage.removeItem("carrito");
  carrito = [];
  actualizarCarrito();
}
// Recuperar el carrito y los datos del formulario del localStorage
if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
  actualizarCarrito();
} else {
  document.getElementById("contador-carrito").textContent = 0;
}
function cerrarCarrito() {
  document.getElementById('carrito-flotante').classList.add('oculto');
}

const carrit = document.getElementById('carrito-flotante');
const barra = carrito.querySelector('.barra-superior');

 offsetX, offsetY, isDragging = false;

barra.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - carrito.offsetLeft;
  offsetY = e.clientY - carrito.offsetTop;
  document.body.style.userSelect = 'none';let // Evita seleccionar texto
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    carrito.style.left = (e.clientX - offsetX) + 'px';
    carrito.style.top = (e.clientY - offsetY) + 'px';
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.userSelect = ''; // Restaura selección
});
