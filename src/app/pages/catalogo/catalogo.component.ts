import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { CarritoService } from '../../services/carrito.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit, OnDestroy {

  private productoService  = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private carritoService   = inject(CarritoService);
  private cdr              = inject(ChangeDetectorRef);
  private route            = inject(ActivatedRoute); 

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionada: number | null = null;
  mensaje: string = '';

  ngOnInit(): void {
    this.route.url.subscribe(() => { 
    this.cargarCategorias();
    this.cargarProductos();
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe(data => {
      this.categorias = data;
      this.cdr.detectChanges(); 
    });
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe(data => {
      this.productos = data;
      this.cdr.detectChanges(); 
    });
  }

  filtrarPorCategoria(categoriaId: number | null): void {
    this.categoriaSeleccionada = categoriaId;

    if (categoriaId === null) {
      this.productoService.listar().subscribe(data => {
        this.productos = data;
        this.cdr.detectChanges(); 
      });
    } else {
      this.productoService.listarPorCategoria(categoriaId).subscribe(data => {
        this.productos = data;
        this.cdr.detectChanges(); 
      });
    }
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregar(producto);
    this.mensaje = `✅ "${producto.nombre}" agregado al carrito`;
    this.cdr.detectChanges(); 
    setTimeout(() => {
      this.mensaje = '';
      this.cdr.detectChanges();
    }, 2500);
  }

  ngOnDestroy(): void {
  }
}