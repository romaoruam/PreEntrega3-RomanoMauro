const productos = [
  { nombre: "Remera 1", precio: 6500 },
  { nombre: "Remera 2", precio: 6300 },
  { nombre: "Remera 3", precio: 7000 }
];

document.addEventListener('DOMContentLoaded', () => {
  // Variables y elementos del DOM
  const nombreInput = document.getElementById('nombre');
  const apellidoInput = document.getElementById('apellido');
  const submitUserInfoButton = document.getElementById('submit-user-info');
  const productosDiv = document.getElementById('productos');
  const listaProductosDiv = document.getElementById('lista-productos');
  const detalleCompraDiv = document.getElementById('detalle-compra');
  const detalleProductosDiv = document.getElementById('detalle-productos');
  const totalCompraDiv = document.getElementById('total-compra');
  const finalizarCompraButton = document.getElementById('finalizar-compra');

  let productosSeleccionados = [];
  let totalCantidadProductos = 0;
  let totalProductosSinDescuento = 0;
  let descuentoAplicado = false;

  // Evento para capturar la información del usuario
  submitUserInfoButton.addEventListener('click', () => {
    const nombre = nombreInput.value.trim().toUpperCase();
    const apellido = apellidoInput.value.trim().toUpperCase();

    if (nombre && apellido) {
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('apellido', apellido);
      alert(`¡Hola ${nombre} ${apellido}! Bienvenido a la tienda Yonkys`);

      productosDiv.style.display = 'block';
      detalleCompraDiv.style.display = 'block';
      mostrarOpcionesProductos();
    } else {
      alert('Por favor, ingrese su nombre y apellido.');
    }
  });

  // Función para mostrar opciones de productos
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
          <button class="btn btn-primary" data-index="${index}">Agregar al carrito</button>
        </div>
      `;
      listaProductosDiv.appendChild(card);
    });

    // Agregar evento a los botones de agregar al carrito
    listaProductosDiv.querySelectorAll('.btn-primary').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-index');
        seleccionarProducto(productos[index]);
      });
    });
  }

  // Función para seleccionar un producto
  function seleccionarProducto(producto) {
    const cantidad = parseInt(prompt(`Ingrese la cantidad de ${producto.nombre} que desea comprar:`));

    if (!isNaN(cantidad) && cantidad > 0) {
      const totalSinDescuento = calcularTotal(producto, cantidad);

      productosSeleccionados.push({
        producto: producto.nombre,
        cantidad: cantidad,
        totalSinDescuento: totalSinDescuento
      });

      totalCantidadProductos += cantidad;
      totalProductosSinDescuento = productosSeleccionados.reduce((total, producto) => total + producto.totalSinDescuento, 0);
      actualizarDetalleCompra();
    } else {
      alert('Error: La cantidad ingresada no es válida.');
    }
  }

  // Función para calcular el total sin descuento
  function calcularTotal(producto, cantidad) {
    return producto.precio * cantidad;
  }

  // Función para actualizar el detalle de la compra
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

  // Función para aplicar descuento al total final si corresponde
  function aplicarDescuento(total, porcentajeDescuento) {
    return total * (1 - porcentajeDescuento / 100);
  }

  // Función para eliminar un producto del carrito
  function eliminarProducto(index) {
    totalCantidadProductos -= productosSeleccionados[index].cantidad;
    productosSeleccionados.splice(index, 1);
    totalProductosSinDescuento = productosSeleccionados.reduce((total, producto) => total + producto.totalSinDescuento, 0);
    actualizarDetalleCompra();
  }

  // Evento para finalizar la compra
  finalizarCompraButton.addEventListener('click', () => {
    const totalConDescuento = totalCantidadProductos >= 3 
      ? aplicarDescuento(totalProductosSinDescuento, 10)
      : totalProductosSinDescuento;

    if (descuentoAplicado) {
      alert(`Gracias por su compra. Se aplicó un descuento del 10%. Total Sin Descuento: ${totalProductosSinDescuento} pesos argentinos. Total a Pagar: ${totalConDescuento} pesos argentinos.`);
    } else {
      alert(`Gracias por su compra. Total Sin Descuento: ${totalProductosSinDescuento} pesos argentinos. Total a Pagar: ${totalConDescuento} pesos argentinos.`);
    }

    localStorage.clear();
    productosSeleccionados = [];
    totalCantidadProductos = 0;
    totalProductosSinDescuento = 0;
    actualizarDetalleCompra();
  });

  // Evento para eliminar productos del carrito
  detalleProductosDiv.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-danger')) {
      const index = event.target.getAttribute('data-index');
      eliminarProducto(index);
    }
  });
});
