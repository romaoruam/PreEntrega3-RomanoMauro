// Valor remera en Pesos Argentinos
const productos = [
  { nombre: "Remera 1", precio: 6500 },
  { nombre: "Remera 2", precio: 6300 },
  { nombre: "Remera 3", precio: 7000 }
];

// Capturar entradas mediante prompt()
let nombreUsuario = prompt("Ingrese su nombre: ").toUpperCase();
let apellidoUsuario = prompt("Ingrese su apellido: ").toUpperCase();

// Saludo
alert(`¡Hola ${nombreUsuario} ${apellidoUsuario}! Bienvenido a la tienda Yonkys`);

// Función para mostrar opciones de productos
function mostrarOpcionesProductos() {
  let opcionesProductos = "\nOpciones de productos:\n";
  productos.forEach((producto, index) => {
    opcionesProductos += `${index + 1}. ${producto.nombre} - Precio: ${producto.precio}$\n`;
  });
  return opcionesProductos;
}

// Función para solicitar y validar selección de producto
function seleccionarProducto() {
  let productoElegido = parseInt(prompt("Ingrese el número del producto que desea comprar: "));
  
  // Validar selección de producto
  if (isNaN(productoElegido) || productoElegido < 1 || productoElegido > productos.length) {
    alert("Error: El número de producto ingresado no es válido.");
    return null;
  } else {
    return productos[productoElegido - 1];
  }
}

// Función para solicitar y vlidar cantidad de producto
function ingresarCantidad(producto) {
  let cantidadProducto = parseInt(prompt(`Ingrese la cantidad de ${producto.nombre} que desea comprar: `));
  
  // Validar cantidad del producto seleccionado
  if (isNaN(cantidadProducto) || cantidadProducto < 1) {
    alert("Error: La cantidad ingresada no es válida.");
    return ingresarCantidad(producto); // Reintentar ingreso
  } else {
    return cantidadProducto;
  }
}

// Función para calcular el total sin descuento
function calcularTotal(producto, cantidad) {
  return producto.precio * cantidad;
}

let continuar = true;
let productosSeleccionados = [];
let totalCantidadProductos = 0;

while (continuar) {
  // Mostrar opciones de producto
  alert(mostrarOpcionesProductos());

  // Solicitar selección de producto
  let productoSeleccionado = seleccionarProducto();

  if (productoSeleccionado !== null) {
    // Mostrar información del producto seleccionado
    alert(`Producto seleccionado: ${productoSeleccionado.nombre}`);

    // Solicitar cantidad del producto seleccionado
    let cantidadProducto = ingresarCantidad(productoSeleccionado);

    if (cantidadProducto !== null) {
      // Calcular total sin descuento
      let totalSinDescuento = calcularTotal(productoSeleccionado, cantidadProducto);
      alert(`Total: ${totalSinDescuento} pesos argentinos.`);

      // Agregar producto al detalle
      productosSeleccionados.push({
        producto: productoSeleccionado.nombre,
        cantidad: cantidadProducto,
        totalSinDescuento: totalSinDescuento
      });

      totalCantidadProductos += cantidadProducto;

      // Preguntar si desea seguir comprando
      continuar = confirm("¿Desea agregar más productos?");
    }
  } else {
    continuar = false;
  }
}

// Calcular total sin descuento de todos los productos seleccionados
let totalProductosSinDescuento = productosSeleccionados.reduce((total, producto) => total + producto.totalSinDescuento, 0);

// Aplicar descuento solo al final si corresponde más de 3 productos
let totalProductosConDescuento = totalProductosSinDescuento;
if (totalCantidadProductos > 3) {
  totalProductosConDescuento = aplicarDescuento(totalProductosSinDescuento, 10);
}

// Función para aplicar descuento al total final si corresponde
function aplicarDescuento(total, porcentajeDescuento) {
  return total * (1 - porcentajeDescuento / 100);
}

// Mostrar detalle de productos seleccionados
let detalleProductos = "\nDetalle de Productos Seleccionados:\n";
productosSeleccionados.forEach((producto, index) => {
  detalleProductos += `Producto ${index + 1}: ${producto.producto} - Cantidad: ${producto.cantidad} - Total: ${producto.totalSinDescuento} pesos argentinos\n`;
});

// Mostrar total de productos y aplicar descuento si corresponde
if (productosSeleccionados.length > 0) {
  if (totalCantidadProductos > 3) {
    alert(`${detalleProductos}\nTotal de Productos Seleccionados: ${totalCantidadProductos}\nTotal a Pagar con Descuento del 10%: ${totalProductosConDescuento} pesos argentinos`);
  } else {
    alert(`${detalleProductos}\nTotal de Productos Seleccionados: ${totalCantidadProductos}\nTotal a Pagar: ${totalProductosConDescuento} pesos argentinos`);
  }
} else {
  alert("No se han seleccionado productos.");
}

alert("Gracias por su compra. ¡Hasta luego!");
