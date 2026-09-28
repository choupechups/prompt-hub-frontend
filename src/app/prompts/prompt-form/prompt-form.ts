import { Component, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../category-service';
import { Card } from "primeng/card";
import { Textarea } from "primeng/textarea";
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Category } from '../category.model';
import { PromptService } from '../prompt-service';
import { Router, RouterLink } from '@angular/router';
import { required } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-prompt-form',
  imports: [Card, Textarea, Select, ButtonModule, ReactiveFormsModule, RouterLink, ProgressSpinner],
  templateUrl: './prompt-form.html',
  styleUrl: './prompt-form.scss',
})
export class PromptForm {
  router = inject(Router);
  messageService = inject(MessageService);
  promptService = inject(PromptService);
  categoryService = inject(CategoryService);

  submitting = signal<boolean>(false);
  deleting = signal<boolean>(false);
  loading = signal<boolean>(false);

  promptId = input<number>();

  categories = signal<Category[]>([]);

  form = new FormGroup({
    title: new FormControl('', { validators: [Validators.required, Validators.maxLength(30)], nonNullable: true}),
    content: new FormControl('', { validators: [Validators.required], nonNullable: true}),
    categoryId: new FormControl(-1, { validators:[Validators.required, Validators.min(0)], nonNullable: true}),
  })

  constructor() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });

    effect(() => {
      const promptId = this.promptId();

      if (promptId) {
        // si en mode d'édtion, déclenche le loader pour le formulaire pré-rempli
        this.loading.set(true);
       

        this.promptService.getPrompt(promptId).subscribe(prompt => {
          this.form.patchValue({
            title: prompt.title,
            content: prompt.content,
            categoryId: prompt.category.id,
          })
          this.loading.set(false);
        })

        
      }
    })
  } 

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;
    
    const prompt = this.form.getRawValue();

    const promptId = this.promptId();

    // déclenche loader..
    this.submitting.set(true);
    
    if (promptId) {
      // mode d'édition
      this.promptService.updatePrompt(promptId, prompt).subscribe(() => {
        this.router.navigate(['/']);

        this.submitting.set(false);

        this.messageService.add({
          severity: 'success',
          summary: 'Modifié',
          detail: 'Prompt modifié avec succès',
        })

      })
    } else {
      // mode de création 
      this.promptService.createPrompt(prompt).subscribe(() => {
        this.submitting.set(false);
        
        this.router.navigate(['/']);

        this.messageService.add({
          severity: 'success',
          summary: 'Créé',
          detail: 'Prompt créé avec succès',
        })
      });
    }
  }

  deletePrompt() {
    // déclenche loader pour supprimer...
    this.deleting.set(true);

    this.promptService.deletePrompt(this.promptId()!).subscribe(() => {
      this.deleting.set(false);

      this.router.navigate(['/']);

      this.messageService.add({
        severity: 'success',
        summary: 'Supprimé',
        detail: 'Prompt supprimé avec succès'
      })
    });
  }
}
