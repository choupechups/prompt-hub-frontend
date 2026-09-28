import { Component, input, ChangeDetectionStrategy, inject, computed, linkedSignal, Signal, signal } from '@angular/core'
import { Prompt } from '../prompt.model'
import { Button } from 'primeng/button'
import { Textarea } from 'primeng/textarea'
import { Tag } from 'primeng/tag'
import { Card } from 'primeng/card'
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../auth/auth-service'
import { PromptService } from '../prompt-service'
import { from } from 'rxjs'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-prompt-card',
  imports: [Button, Textarea, Tag, Card, RouterLink],
  templateUrl: './prompt-card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './prompt-card.scss',
})
export class PromptCard {
  authService = inject(AuthService);
  promptService = inject(PromptService);
  router = inject(Router);
  messageService = inject(MessageService);

  prompt = input.required<Prompt>();

  voting = signal<boolean>(false);

  score = linkedSignal(() => this.prompt().score);
  userVote = linkedSignal(() => (this.authService.currentUser() ? this.prompt().userVote : null));

  canEdit = computed(() => {
    const currentUser = this.authService.currentUser();

    return currentUser && this.prompt().author.id === currentUser.id;
  })

  copyToClipboard() {
    from(navigator.clipboard.writeText(this.prompt().content)).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copié',
        detail: 'Prompt copié dans le presse papier',
      })
    })
  }

  upvote() {
    if(!this.authService.currentUser()) {
      void this.router.navigate(['/auth']);
      return;
    }

    // déclenche le loader
    this.voting.set(true);

    this.promptService.upvotePrompt(this.prompt().id).subscribe((updatedPrompt) => {
      this.score.set(updatedPrompt.score);
      this.userVote.set(updatedPrompt.userVote);
      // dès que la requête HTTP est passée et qu'on rentre dans le subscribe()...
      this.voting.set(false);
    })
  }

  downvote() {
    if(!this.authService.currentUser()) {
      void this.router.navigate(['/auth']);
      return;
    }

    this.voting.set(true);
    
    this.promptService.downvotePrompt(this.prompt().id).subscribe((updatedPrompt) => {
      this.score.set(updatedPrompt.score);
      this.userVote.set(updatedPrompt.userVote);
      this.voting.set(false);
    })
  }
}
