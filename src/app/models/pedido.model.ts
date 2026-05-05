export interface DetallePedido {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Pedido {
  id?: number;
  clienteNombre: string;
  celular: string;
  direccion: string;
  fecha?: string;
  estado?: string;
  total?: number;
  detalles: DetallePedido[];
}