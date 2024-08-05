document.addEventListener('DOMContentLoaded', () => {
  // Variables y elementos del DOM para index.html
  const nombreInput = document.getElementById('nombre');
  const apellidoInput = document.getElementById('apellido');
  const submitUserInfoButton = document.getElementById('submit-user-info');
  const mensajeBienvenidaDiv = document.getElementById('mensaje-bienvenida');

  // Verifica si estamos en index.html o en cart.html
  if (document.getElementById('user-info')) {
    // Código para index.html
    submitUserInfoButton.addEventListener('click', () => {
      const nombre = nombreInput.value.trim().toUpperCase();
      const apellido = apellidoInput.value.trim().toUpperCase();

      if (nombre && apellido) {
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('apellido', apellido);

        // Mostrar mensaje de bienvenida
        mensajeBienvenidaDiv.textContent = `¡Hola ${nombre}! Bienvenido a la tienda Yonkys`;
        mensajeBienvenidaDiv.classList.remove('d-none');

        // Redirigir a la página del carrito de compras después de un breve tiempo
        setTimeout(() => {
          window.location.href = 'cart.html';
        }, 2000); // Espera 2 segundos antes de redirigir

      } else {
        alert('Por favor, ingrese su nombre y apellido.');
      }
    });
  } else {
    // Código para cart.html
    const nombre = localStorage.getItem('nombre');
    const productos = [
      { nombre: "Remera 1", precio: 6500 },
      { nombre: "Remera 2", precio: 6300 },
      { nombre: "Remera 3", precio: 7000 }
    ];

    const productosDiv = document.getElementById('productos');
    const listaProductosDiv = document.getElementById('lista-productos');
    const detalleCompraDiv = document.getElementById('detalle-compra');
    const detalleProductosDiv = document.getElementById('detalle-productos');
    const totalCompraDiv = document.getElementById('total-compra');
    const finalizarCompraButton = document.getElementById('finalizar-compra');

    let productosSeleccionados = JSON.parse(localStorage.getItem('productosSeleccionados')) || [];
    let totalCantidadProductos = productosSeleccionados.reduce((total, producto) => total + producto.cantidad, 0);
    let totalProductosSinDescuento = productosSeleccionados.reduce((total, producto) => total + producto.totalSinDescuento, 0);
    let descuentoAplicado = false;

    mostrarOpcionesProductos();
    actualizarDetalleCompra();

    function mostrarOpcionesProductos() {
      listaProductosDiv.innerHTML = '';
      productos.forEach((producto, index) => {
        const card = document.createElement('div');
        card.className = 'card product-card';
        card.style.width = '16rem'; // Ajustado el tamaño de la card
        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">Precio: ${producto.precio}$</p>
            <input type="number" min="1" class="form-control mb-2" placeholder="Cantidad" id="cantidad-${index}">
            <button class="btn btn-primary" data-index="${index}">Agregar al carrito</button>
          </div>
        `;
        listaProductosDiv.appendChild(card);
      });

      listaProductosDiv.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', () => {
          const index = button.getAttribute('data-index');
          const cantidadInput = document.getElementById(`cantidad-${index}`);
          const cantidad = parseInt(cantidadInput.value);

          if (!isNaN(cantidad) && cantidad > 0) {
            seleccionarProducto(productos[index], cantidad);
            cantidadInput.value = ''; // Limpiar el input después de agregar el producto
          } else {
            mostrarMensaje('Error: La cantidad ingresada no es válida.', 'error');
          }
        });
      });
    }

    function seleccionarProducto(producto, cantidad) {
      const totalSinDescuento = calcularTotal(producto, cantidad);

      productosSeleccionados.push({
        producto: producto.nombre,
        cantidad: cantidad,
        totalSinDescuento: totalSinDescuento
      });

      totalCantidadProductos += cantidad;
      totalProductosSinDescuento = productosSeleccionados.reduce((total, producto) => total + producto.totalSinDescuento, 0);
      localStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados));
      actualizarDetalleCompra();
    }

    function calcularTotal(producto, cantidad) {
      return producto.precio * cantidad;
    }

    function actualizarDetalleCompra() {
      detalleProductosDiv.innerHTML = '';
      productosSeleccionados.forEach((producto, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
          Producto ${index + 1}: ${producto.producto} - Cantidad: ${producto.cantidad} - Total: ${producto.totalSinDescuento} pesos argentinos
          <button class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
        `;
        detalleProductosDiv.appendChild(div);
      });

      let totalConDescuento = totalProductosSinDescuento;
      let mensajeDescuento = '';

      if (totalCantidadProductos >= 3) {
        totalConDescuento = aplicarDescuento(totalProductosSinDescuento, 10);
        descuentoAplicado = true;
        mensajeDescuento = ` (Se aplicó un descuento del 10%)`;
      } else {
        descuentoAplicado = false;
      }

      totalCompraDiv.innerHTML = `
        Total de Productos Seleccionados: ${totalCantidadProductos}<br>
        Total Sin Descuento: ${totalProductosSinDescuento} pesos argentinos<br>
        Total a Pagar${mensajeDescuento}: ${totalConDescuento} pesos argentinos
      `;
    }

    function aplicarDescuento(total, porcentajeDescuento) {
      return total * (1 - porcentajeDescuento / 100);
    }

    function eliminarProducto(index) {
      totalCantidadProductos -= productosSeleccionados[index].cantidad;
      productosSeleccionados.splice(index, 1);
      totalProductosSinDescuento = productosSeleccionados.reduce((total, producto) => total + producto.totalSinDescuento, 0);
      localStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados));
      actualizarDetalleCompra();
    }

    detalleProductosDiv.addEventListener('click', (event) => {
      if (event.target.classList.contains('btn-danger')) {
        const index = event.target.getAttribute('data-index');
        eliminarProducto(index);
      }
    });

    finalizarCompraButton.addEventListener('click', () => {
      const totalConDescuento = totalCantidadProductos >= 3 
        ? aplicarDescuento(totalProductosSinDescuento, 10)
        : totalProductosSinDescuento;

      mostrarMensaje(`Gracias por su compra, ${nombre}. ${descuentoAplicado ? `Se aplicó un descuento del 10%.` : ''} Total Sin Descuento: ${totalProductosSinDescuento} pesos argentinos. Total a Pagar: ${totalConDescuento} pesos argentinos.`, 'success');

      localStorage.removeItem('productosSeleccionados');
      localStorage.removeItem('nombre');
      localStorage.removeItem('apellido');
      productosSeleccionados = [];
      totalCantidadProductos = 0;
      totalProductosSinDescuento = 0;
      actualizarDetalleCompra();
    });

    function mostrarMensaje(mensaje, tipo) {
      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${tipo}`;
      alertDiv.textContent = mensaje;
      document.body.prepend(alertDiv);
      setTimeout(() => alertDiv.remove(), 5000);
    }
  }
});
