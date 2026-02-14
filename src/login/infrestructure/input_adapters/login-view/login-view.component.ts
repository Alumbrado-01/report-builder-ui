import {Component, inject} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {LoginService} from "../../../application/login.service";
import {LoginRequest} from "../../../domain/api/loginRequest";

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss'
})
export class LoginViewComponent {

  private readonly loginService = inject(LoginService);
    visible: boolean = true;
    public user: string;
    public key: string;
    public loading = false;

    constructor(
      private readonly router: Router
    ) {}

login() {
  if(this.user && this.key) {
    this.loading = true;
    const access: LoginRequest = {
      mail: this.user,
      key: this.key
    }
    this.loginService.validateAccess(access).subscribe({
      next: (data) => {
        if (data.token) {
          sessionStorage.setItem('user', JSON.stringify(data));
          this.loading = false;
          this.router.navigate(['/inicio']);
        }
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Error de validacion, usuario o contraseña incorrectos, intente nuevamente.",
          showConfirmButton: false,
          timer: 2000
        });
      },
    });
  }
  else {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      title: "Por favor ingrese usuario y contraseña",
      showConfirmButton: false,
      timer: 1500
    });
  }
}
}
