import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core'
import { Prompt } from '../prompt.model'
import { PromptCard } from '../prompt-card/prompt-card'
import { PromptService } from '../prompt-service'
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-prompt-list',
  imports: [PromptCard, ProgressSpinner],
  templateUrl: './prompt-list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './prompt-list.scss',
})
export class PromptList {
  promptService = inject(PromptService); 

  // prompts = signal<Prompt[]>([]);

  loading = signal<boolean>(true);

  // constructor() {
  //   this.promptService.getPrompts().subscribe(prompts => {
  //     this.prompts.set(prompts);
  //   });
  // }

  // prompts$ = this.promptService.getPrompts();

  prompts = toSignal(this.promptService.getPrompts().pipe(tap(() => this.loading.set(false))));
}
