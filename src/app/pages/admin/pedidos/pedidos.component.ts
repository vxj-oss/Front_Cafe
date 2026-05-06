import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../services/pedido.service';
import { Pedido } from '../../../models/pedido.model';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class AdminPedidosComponent implements OnInit {

  private pedidoService = inject(PedidoService);
  private cdr           = inject(ChangeDetectorRef);

  pedidos: Pedido[] = [];
  mensaje = '';

  readonly estados = ['PENDIENTE', 'EN_PREPARACION', 'ENTREGADO'];

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.pedidoService.listar().subscribe(data => {
      this.pedidos = data.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      this.cdr.detectChanges(); 
    });
  }

  cambiarEstado(id: number, estado: string): void {
    this.pedidoService.actualizarEstado(id, estado).subscribe({
      next: () => {
        this.mostrarMensaje('✅ Estado actualizado');
        this.cargarPedidos();
      },
      error: () => {
        this.mostrarMensaje('❌ Error al actualizar estado');
      }
    });
  }

  estadoSiguiente(estadoActual: string): string | null {
    const idx = this.estados.indexOf(estadoActual);
    return idx < this.estados.length - 1 ? this.estados[idx + 1] : null;
  }

  mostrarMensaje(msg: string): void {
    this.mensaje = msg;
    this.cdr.detectChanges(); 
    setTimeout(() => {
      this.mensaje = '';
      this.cdr.detectChanges();
    }, 3000);
  }
}