import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

  carritoService = inject(CarritoService);
  private cdr    = inject(ChangeDetectorRef); 

  agregar(productoId: number): void {
    const item = this.carritoService.carrito().find(i => i.producto.id === productoId);
    if (item) {
      this.carritoService.agregar(item.producto);
      this.cdr.detectChanges(); 
    }
  }

  reducir(productoId: number): void {
    this.carritoService.reducir(productoId);
    this.cdr.detectChanges(); 
  }

  eliminar(productoId: number): void {
    this.carritoService.eliminar(productoId);
    this.cdr.detectChanges();
  }

  vaciar(): void {
    this.carritoService.vaciar();
    this.cdr.detectChanges();
  }
}