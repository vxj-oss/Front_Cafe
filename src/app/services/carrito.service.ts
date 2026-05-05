import { Injectable, signal, computed } from '@angular/core';
import { ItemCarrito } from '../models/carrito.model';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private items = signal<ItemCarrito[]>([]);
  readonly carrito = this.items.asReadonly();

  readonly total = computed(() =>
    this.items().reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0)
  );

  readonly cantidadTotal = computed(() =>
    this.items().reduce((acc, item) => acc + item.cantidad, 0)
  );

  agregar(producto: Producto): void {
    const actual = this.items();
    const existe = actual.find(i => i.producto.id === producto.id);

    if (existe) {
      this.items.set(
        actual.map(i =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      );
    } else {
      this.items.set([...actual, { producto, cantidad: 1 }]);
    }
  }

  reducir(productoId: number): void {
    const actual = this.items();
    const item = actual.find(i => i.producto.id === productoId);

    if (!item) return;

    if (item.cantidad === 1) {
      this.eliminar(productoId);
    } else {
      this.items.set(
        actual.map(i =>
          i.producto.id === productoId
            ? { ...i, cantidad: i.cantidad - 1 }
            : i
        )
      );
    }
  }

  eliminar(productoId: number): void {
    this.items.set(this.items().filter(i => i.producto.id !== productoId));
  }

  vaciar(): void {
    this.items.set([]);
  }
}