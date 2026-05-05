import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);
  private cdr         = inject(ChangeDetectorRef);
  pestanaActiva: 'cliente' | 'admin' = 'cliente';
  modoCliente: 'login' | 'registro' = 'login';

  errorCliente    = '';
  errorAdmin      = '';
  exitoRegistro   = '';
  cargando        = false;

  formClienteLogin = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  formClienteRegistro = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirmar: ['', Validators.required]
  });

  formAdmin = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  cambiarPestana(p: 'cliente' | 'admin'): void {
    this.pestanaActiva = p;
    this.errorCliente  = '';
    this.errorAdmin    = '';
    this.exitoRegistro = '';
    this.cdr.detectChanges();
  }

  cambiarModoCliente(modo: 'login' | 'registro'): void {
    this.modoCliente   = modo;
    this.errorCliente  = '';
    this.exitoRegistro = '';
    this.cdr.detectChanges();
  }

  loginCliente(): void {
    if (this.formClienteLogin.invalid) return;

    this.cargando     = true;
    this.errorCliente = '';
    this.cdr.detectChanges();

    this.authService.login(this.formClienteLogin.value as any).subscribe({
      next: (res) => {
        if (res.rol !== 'USER') {
          this.errorCliente = 'Esta cuenta no es de cliente.';
          this.cargando     = false;
          this.cdr.detectChanges();
          return;
        }
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorCliente = 'Usuario o contraseña incorrectos';
        this.cargando     = false;
        this.cdr.detectChanges();
      }
    });
  }

  registrarCliente(): void {
    if (this.formClienteRegistro.invalid) return;

    const { username, password, confirmar } = this.formClienteRegistro.value;

    if (password !== confirmar) {
      this.errorCliente = 'Las contraseñas no coinciden';
      this.cdr.detectChanges();
      return;
    }

    this.cargando     = true;
    this.errorCliente = '';
    this.cdr.detectChanges();

    this.authService.registro({ username: username!, password: password! }).subscribe({
      next: () => {
        this.exitoRegistro = 'Cuenta creada. Ahora puedes iniciar sesión.';
        this.modoCliente   = 'login';
        this.cargando      = false;
        this.formClienteRegistro.reset();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorCliente = err.error?.error || 'Error al registrar';
        this.cargando     = false;
        this.cdr.detectChanges();
      }
    });
  }

  loginAdmin(): void {
    if (this.formAdmin.invalid) return;

    this.cargando    = true;
    this.errorAdmin  = '';
    this.cdr.detectChanges();

    this.authService.login(this.formAdmin.value as any).subscribe({
      next: (res) => {
        if (res.rol !== 'ADMIN') {
          this.errorAdmin = 'Esta cuenta no tiene permisos de administrador.';
          this.cargando   = false;
          this.cdr.detectChanges();
          return;
        }
        this.router.navigate(['/admin/productos']);
      },
      error: () => {
        this.errorAdmin = 'Usuario o contraseña incorrectos';
        this.cargando   = false;
        this.cdr.detectChanges();
      }
    });
  }
}