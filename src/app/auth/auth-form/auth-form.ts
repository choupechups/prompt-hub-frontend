import { Component, signal, inject } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from "primeng/card";
import { ButtonDirective } from "primeng/button";
import { PasswordModule } from 'primeng/password';
import { Textarea } from "primeng/textarea";
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, Card, ButtonDirective, PasswordModule, Textarea],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.scss',
})
export class AuthForm {
  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService);

  mode = signal<'login' | 'register'>('login');

  submitting = signal<boolean>(false);

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    })
  })

  toggleMode() {
    this.mode.update(value => value === 'login' ? 'register' : 'login');
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { username, password } = this.form.getRawValue();

    this.submitting.set(true);

    if(this.mode() === 'login') {
      this.login(username, password)
    } else {
      this.register(username, password)
    }
  }

  login(username: string, password: string) {
    this.authService.login(username, password).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigate(['/']);      
      },
      error: () => {
        this.submitting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Connexion impossible, réessayez.'
        })
      }
    })
  }

  register(username: string, password: string) {
    this.authService.register(username, password).subscribe(() => {
      void this.router.navigate(['/']);

      this.submitting.set(false);
    })
  }
}
