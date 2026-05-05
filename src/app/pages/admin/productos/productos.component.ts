import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProductoService } from '../../../services/producto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { Producto } from '../../../models/producto.model';
import { Categoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class AdminProductosComponent implements OnInit {

  private productoService  = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private fb               = inject(FormBuilder);
  private cdr              = inject(ChangeDetectorRef); 

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  editandoId: number | null = null;
  mostrarFormulario = false;
  mensaje = '';
  error = '';

  form = this.fb.group({
    nombre:      ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    precio:      [0,  [Validators.required, Validators.min(0.01)]],
    stock:       [0,  [Validators.required, Validators.min(0)]],
    imagenUrl:   [''],
    activo:      [true],
    categoriaId: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    forkJoin({
      productos:  this.productoService.listar(),
      categorias: this.categoriaService.listar()
    }).subscribe(({ productos, categorias }) => {
      this.productos  = productos.sort((a, b) => a.id - b.id);
      this.productos  = productos;
      this.categorias = categorias;
      this.cdr.detectChanges(); 
    });
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe(data => {
      this.productos = data.sort((a, b) => a.id - b.id);
      this.productos = data;
      this.cdr.detectChanges();
    });
  }

  abrirFormularioNuevo(): void {
    if (this.categorias.length === 0) {
      this.categoriaService.listar().subscribe(data => {
        this.categorias = data;
        this._abrirFormularioNuevo();
      });
    } else {
      this._abrirFormularioNuevo();
    }
  }

  private _abrirFormularioNuevo(): void {
    this.editandoId = null;
    this.form.reset({ activo: true, precio: 0, stock: 0 });
    this.mostrarFormulario = true;
    this.error = '';
    this.cdr.detectChanges();
  }

  editar(producto: Producto): void {
    if (this.categorias.length === 0) {
      this.categoriaService.listar().subscribe(data => {
        this.categorias = data;
        this._editar(producto);
      });
    } else {
      this._editar(producto);
    }
  }

  private _editar(producto: Producto): void {
    this.editandoId = producto.id;
    this.form.patchValue({
      nombre:      producto.nombre,
      descripcion: producto.descripcion,
      precio:      producto.precio,
      stock:       producto.stock,
      imagenUrl:   producto.imagenUrl,
      activo:      producto.activo,
      categoriaId: producto.categoriaId
    });
    this.mostrarFormulario = true;
    this.error = '';
    this.cdr.detectChanges();
  }

  guardar(): void {
    if (this.form.invalid) return;

    const data = this.form.value as Producto;

    if (this.editandoId) {
      this.productoService.actualizar(this.editandoId, data).subscribe({
        next: () => {
          this.mostrarMensaje('✅ Producto actualizado correctamente');
          this.cerrarFormulario();
          this.cargarProductos();
        },
        error: () => {
          this.error = 'Error al actualizar el producto';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.productoService.crear(data).subscribe({
        next: () => {
          this.mostrarMensaje('Producto creado correctamente');
          this.cerrarFormulario();
          this.cargarProductos();
        },
        error: () => {
          this.error = 'Error al crear el producto';
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Deseas desactivar este producto?')) return;
    this.productoService.eliminar(id).subscribe({
      next: () => {
        this.mostrarMensaje('Producto desactivado');
        this.cargarProductos();
      }
    });
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.editandoId = null;
    this.error = '';
    this.cdr.detectChanges(); 
  }

  mostrarMensaje(msg: string): void {
    this.mensaje = msg;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.mensaje = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  nombreCategoria(id: number): string {
    return this.categorias.find(c => c.id === id)?.nombre || '—';
  }
}