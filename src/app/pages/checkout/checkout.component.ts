import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  private fb = inject(FormBuilder);
  private carritoService = inject(CarritoService);
  private pedidoService = inject(PedidoService);
  private router = inject(Router);

  cargando = false;
  error = '';

  form = this.fb.group({
    clienteNombre: ['', [Validators.required, Validators.minLength(3)]],
    celular:       ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    direccion:     ['', [Validators.required, Validators.minLength(5)]]
  });

  get carrito() { return this.carritoService.carrito(); }
  get total()   { return this.carritoService.total(); }

  confirmar(): void {
    if (this.form.invalid || this.carrito.length === 0) return;

    this.cargando = true;
    this.error = '';

    const pedido: Pedido = {
      clienteNombre: this.form.value.clienteNombre!,
      celular:       this.form.value.celular!,
      direccion:     this.form.value.direccion!,
      detalles: this.carrito.map(item => ({
        productoId:     item.producto.id,
        cantidad:       item.cantidad,
        precioUnitario: item.producto.precio
      }))
    };

    this.pedidoService.crear(pedido).subscribe({
      next: () => {
        this.carritoService.vaciar();
        this.router.navigate(['/confirmacion']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Ocurrió un error al registrar el pedido.';
        this.cargando = false;
      }
    });
  }
}