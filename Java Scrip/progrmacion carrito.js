// ==================== CONFIGURACIÓN ====================
        const precios = {
            "Durazno": 13000,
            "Maracuyá": 13000,
            "Mora": 13000,
            "Fresa": 13000,
            "Café": 13000,
            "Arequipe con pasas": 13000
        };

        let carrito = [];

        // Recuperar carrito del localStorage
        if (localStorage.getItem("carrito")) {
            carrito = JSON.parse(localStorage.getItem("carrito"));
        }

        // Recuperar datos del formulario
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById("nombre").value = localStorage.getItem("nombre") || "";
            document.getElementById("telefono").value = localStorage.getItem("telefono") || "";
            document.getElementById("direccion").value = localStorage.getItem("direccion") || "";
            document.getElementById("ciudad").value = localStorage.getItem("ciudad") || "";
            document.getElementById("pago").value = localStorage.getItem("pago") || "Efectivo";
            document.getElementById("diaEntrega").value = localStorage.getItem("diaEntrega") || "Jueves";
            
            // Renderizar carrito al cargar
            actualizarCarrito();
        });

        // ==================== FUNCIONES ORIGINALES (adaptadas) ====================
        window.agregarAlCarrito = function(producto) {
            carrito.push(producto);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarCarrito();
            mostrarCarritoFlotante();
        };

        function actualizarCarrito() {
            // Actualizar lista del carrito flotante (original)
            const lista = document.getElementById("lista-carrito");
            if (lista) {
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
                        <button onclick="eliminarProducto('${producto}')" class="ml-2 text-red-500">🗑️</button>
                    `;
                    lista.appendChild(li);
                }

                const totalLi = document.createElement("li");
                totalLi.style.fontWeight = "bold";
                totalLi.textContent = `TOTAL: $${total.toLocaleString()} COP`;
                lista.appendChild(totalLi);
            }

            // Actualizar contador
            document.getElementById("contador-carrito").textContent = carrito.length;

            // Actualizar vista moderna
            renderizarProductosModernos();
        }

        function mostrarCarritoFlotante() {
            const carritoDiv = document.getElementById("carrito-flotante");
            carritoDiv.classList.remove("oculto");
            setTimeout(() => {
                carritoDiv.classList.add("oculto");
            }, 60000); // 3 segundos
        }

        window.vaciarCarrito = function() {
            carrito = [];
            localStorage.removeItem("carrito");
            actualizarCarrito();
        };

        window.eliminarProducto = function(nombreProducto) {
            const index = carrito.indexOf(nombreProducto);
            if (index > -1) {
                carrito.splice(index, 1);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarCarrito();
            }
        };

        window.cerrarCarrito = function() {
            document.getElementById('carrito-flotante').classList.add('oculto');
        };

        window.volverAlInicio = function() {
            window.location.href = "index.html";
        };

        // ==================== FUNCIÓN MODERNA: RENDERIZAR PRODUCTOS ====================
        function renderizarProductosModernos() {
            const container = document.getElementById('cart-items-container');
            if (!container) return;

            if (carrito.length === 0) {
                container.innerHTML = `
                    <div class="p-8 text-center text-gray-500">
                        <i class="fas fa-shopping-cart text-4xl mb-4 opacity-30"></i>
                        <p class="text-lg">Tu carrito está vacío</p>
                        <p class="text-sm">Agrega productos desde la tienda</p>
                    </div>
                `;
                document.getElementById('subtotal').textContent = '$0';
                document.getElementById('total').textContent = '$0';
                return;
            }

            // Agrupar productos
            const conteo = {};
            carrito.forEach(prod => {
                conteo[prod] = (conteo[prod] || 0) + 1;
            });

            let html = '';
            let subtotalGlobal = 0;

            for (const [producto, cantidad] of Object.entries(conteo)) {
                const precioUnitario = precios[producto] || 0;
                const subtotal = precioUnitario * cantidad;
                subtotalGlobal += subtotal;

                // Determinar imagen (ajusta según tus nombres de archivo)
                let imagenSrc = 'imagenes/';
                const prodKey = producto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (prodKey.includes('durazno')) imagenSrc += 'durazno.png';
                else if (prodKey.includes('maracuya')) imagenSrc += 'maracuyá.png';
                else if (prodKey.includes('mora')) imagenSrc += 'mora.png';
                else if (prodKey.includes('fresa')) imagenSrc += 'fresa.png';
                else if (prodKey.includes('cafe')) imagenSrc += 'café.png';
                else if (prodKey.includes('arequipe')) imagenSrc += 'arequipe.png';
                else imagenSrc += 'default.png'; // placeholder

                html += `
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 md:p-6" data-producto="${producto}">
                        <!-- Producto: imagen + detalles -->
                        <div class="md:col-span-6 flex items-center gap-4">
                            <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img src="${imagenSrc}" alt="${producto}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/80'">
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-800">${producto}</h3>
                                <p class="text-sm text-gray-500">Precio unitario: $${precioUnitario.toLocaleString()}</p>
                            </div>
                        </div>

                        <!-- Cantidad -->
                        <div class="md:col-span-2 flex md:justify-center items-center gap-2">
                            <label class="text-sm text-gray-500 md:hidden">Cantidad:</label>
                            <select class="quantity-select border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none" onchange="cambiarCantidadProducto('${producto}', this.value)">
                                ${Array.from({ length: 50 }, (_, i) => `<option value="${i+1}" ${cantidad === i+1 ? 'selected' : ''}>${i+1}</option>`).join('')}
                            </select>
                        </div>

                        <!-- Subtotal -->
                        <div class="md:col-span-2 flex md:justify-center items-center gap-2">
                            <span class="text-sm text-gray-500 md:hidden">Subtotal:</span>
                            <span class="font-medium text-gray-800">$${subtotal.toLocaleString()}</span>
                        </div>

                        <!-- Acción (eliminar una unidad) -->
                        <div class="md:col-span-2 flex md:justify-center">
                            <button onclick="eliminarProducto('${producto}')" class="remove-btn text-gray-400 hover:text-red-600 transition p-1">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                `;
            }

            container.innerHTML = html;
            document.getElementById('subtotal').textContent = `$${subtotalGlobal.toLocaleString()}`;
            document.getElementById('total').textContent = `$${subtotalGlobal.toLocaleString()}`;
        }

        // ==================== FUNCIONES PARA CAMBIAR CANTIDAD ====================
        window.cambiarCantidadProducto = function(producto, nuevaCantidad) {
            nuevaCantidad = parseInt(nuevaCantidad);
            const cantidadActual = carrito.filter(p => p === producto).length;

            if (nuevaCantidad > cantidadActual) {
                // Agregar copias
                for (let i = 0; i < nuevaCantidad - cantidadActual; i++) {
                    carrito.push(producto);
                }
            } else if (nuevaCantidad < cantidadActual) {
                // Eliminar copias (desde el final)
                let eliminados = 0;
                for (let i = carrito.length - 1; i >= 0; i--) {
                    if (carrito[i] === producto && eliminados < cantidadActual - nuevaCantidad) {
                        carrito.splice(i, 1);
                        eliminados++;
                    }
                }
            }

            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarCarrito();
        };

        // ==================== ENVÍO POR WHATSAPP (original mejorado) ====================
        window.enviarWhatsApp = function() {
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

            // Guardar datos
            localStorage.setItem("Nombre", nombre);
            localStorage.setItem("Telefono", telefono);
            localStorage.setItem("Direccion", direccion);
            localStorage.setItem("Ciudad", ciudad);
            localStorage.setItem("Pago", pago);
            localStorage.setItem("DiaEntrega", diaEntrega);

            // Calcular conteo (usar el mismo objeto de actualizarCarrito)
            const conteo = {};
            carrito.forEach(p => conteo[p] = (conteo[p] || 0) + 1);

            let mensaje = "Hola, Quiero realizar el siguiente pedido de yogurt:%0A";
            for (let producto in conteo) {
                const cantidad = conteo[producto];
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

            const numeroWhatsApp = "573006582031";
            window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, "_blank");

            // Limpiar carrito
            localStorage.removeItem("carrito");
            carrito = [];
            actualizarCarrito();
        };

        // ==================== ARRASTRE DEL CARRITO FLOTANTE (corregido) ====================
        (function() {
            const carritoFlotante = document.getElementById('carrito-flotante');
            if (!carritoFlotante) return;
            const barra = carritoFlotante.querySelector('.barra-superior');
            if (!barra) return;

            let offsetX, offsetY, isDragging = false;

            barra.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - carritoFlotante.offsetLeft;
                offsetY = e.clientY - carritoFlotante.offsetTop;
                document.body.style.userSelect = 'none';
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    carritoFlotante.style.left = (e.clientX - offsetX) + 'px';
                    carritoFlotante.style.top = (e.clientY - offsetY) + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.body.style.userSelect = '';
            });
        })();
        

     // Función para cancelar la compra (vacía el carrito y vuelve al inicio)
window.cancelarCompra = function() {
    if (carrito.length > 0) {
        if (confirm('¿Estás seguro de que deseas cancelar la compra? Se eliminarán todos los productos del carrito.')) {
            vaciarCarrito(); // Vacía el carrito (ya está definida)
            volverAlInicio(); // Redirige a index.html
        }
    } else {
        volverAlInicio(); // Si el carrito está vacío, solo redirige
    }
};