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
  const listaProductosUl = document.getElementById('lista-productos');
  const detalleCompraDiv = document.getElementById('detalle-compra');
  const detalleProductosDiv = document.getElementById('detalle-productos');
  const totalCompraDiv = document.getElementById('total-compra');
  const finalizarCompraButton = document.getElementById('finalizar-compra');

  let productosSeleccionados = [];
  let totalCantidadProductos = 0;

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
    listaProductosUl.innerHTML = '';
    productos.forEach((producto, index) => {
      const li = document.createElement('li');
      li.textContent = `${producto.nombre} - Precio: ${producto.precio}$`;
      li.addEventListener('click', () => {
        seleccionarProducto(producto);
      });
      listaProductosUl.appendChild(li);
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
      div.textContent = `Producto ${index + 1}: ${producto.producto} - Cantidad: ${producto.cantidad} - Total: ${producto.totalSinDescuento} pesos argentinos`;
      detalleProductosDiv.appendChild(div);
    });

    let totalProductosSinDescuento = productosSeleccionados.reduce((total, producto) => total + producto.totalSinDescuento, 0);
    let totalProductosConDescuento = totalProductosSinDescuento;

    if (totalCantidadProductos > 3) {
      totalProductosConDescuento = aplicarDescuento(totalProductosSinDescuento, 10);
    }

    totalCompraDiv.textContent = `Total de Productos Seleccionados: ${totalCantidadProductos}\nTotal a Pagar: ${totalProductosConDescuento} pesos argentinos`;
  }

  // Función para aplicar descuento al total final si corresponde
  function aplicarDescuento(total, porcentajeDescuento) {
    return total * (1 - porcentajeDescuento / 100);
  }

  // Evento para finalizar la compra
  finalizarCompraButton.addEventListener('click', () => {
    alert('Gracias por su compra. ¡Hasta luego!');
    localStorage.clear();
    productosSeleccionados = [];
    totalCantidadProductos = 0;
    actualizarDetalleCompra();
  });
});
