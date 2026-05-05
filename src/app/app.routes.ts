import { Routes } from '@angular/router';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ConfirmacionComponent } from './pages/confirmacion/confirmacion.component';
import { AdminProductosComponent } from './pages/admin/productos/productos.component';
import { AdminPedidosComponent } from './pages/admin/pedidos/pedidos.component';

export const routes: Routes = [
  { path: '',                component: CatalogoComponent,        runGuardsAndResolvers: 'always' },
  { path: 'producto/:id',    component: DetalleProductoComponent },
  { path: 'carrito',         component: CarritoComponent },
  { path: 'checkout',        component: CheckoutComponent },
  { path: 'confirmacion',    component: ConfirmacionComponent },
  { path: 'admin/productos', component: AdminProductosComponent },
  { path: 'admin/pedidos',   component: AdminPedidosComponent },
  { path: '**',              redirectTo: '' }
];