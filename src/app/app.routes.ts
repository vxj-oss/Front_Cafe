import { Routes } from '@angular/router';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ConfirmacionComponent } from './pages/confirmacion/confirmacion.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminProductosComponent } from './pages/admin/productos/productos.component';
import { AdminPedidosComponent } from './pages/admin/pedidos/pedidos.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: '', component: CatalogoComponent, canActivate: [authGuard] },
  { path: 'producto/:id', component: DetalleProductoComponent, canActivate: [authGuard] },
  { path: 'carrito', component: CarritoComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'confirmacion', component: ConfirmacionComponent, canActivate: [authGuard] },
  { path: 'admin/productos', component: AdminProductosComponent, canActivate: [adminGuard] },
  { path: 'admin/pedidos', component: AdminPedidosComponent, canActivate: [adminGuard] },

  { path: '**', redirectTo: '' }
];