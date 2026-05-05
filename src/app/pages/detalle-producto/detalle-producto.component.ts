import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css'
})
export class DetalleProductoComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private cdr = inject(ChangeDetectorRef);

  producto: Producto | null = null;
  mensaje: string = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID recibido:', id);

    this.productoService.obtener(id).subscribe({
      next: (data) => {
        console.log('Producto:', data);
        this.producto = data;
        this.cdr.detectChanges(); // 👈 SOLUCIÓN
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  agregar(): void {
    if (this.producto) {
      this.carritoService.agregar(this.producto);
      this.mensaje = '✅ Producto agregado al carrito';
      this.cdr.detectChanges();

      setTimeout(() => {
        this.mensaje = '';
        this.cdr.detectChanges();
      }, 2500);
    }
  }
}