import { inject, Injectable } from '@angular/core'
import { Prompt } from './prompt.model'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { prompt } from '@primeuix/themes/aura/terminal';
import { delay } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class PromptService {
    httpClient = inject(HttpClient);

    baseUrl = environment.apiUrl + 'prompts/';

    getPrompts() {
        return this.httpClient.get<Prompt[]>(this.baseUrl).pipe(delay(2000));
    }

    getPrompt(promptId: number) {
        return this.httpClient.get<Prompt>(`${this.baseUrl}${promptId}`).pipe(delay(2000));
    }

    createPrompt(prompt: { title: string, content: string, categoryId: number }) {
        return this.httpClient.post<Prompt>(this.baseUrl, prompt).pipe(delay(2000));
    }

    updatePrompt(promptId: number, prompt: { title: string, content: string, categoryId: number }) {
        return this.httpClient.put<Prompt>(`${this.baseUrl}${promptId}`, prompt).pipe(delay(2000));
    }

    deletePrompt(promptId: number) {
        return this.httpClient.delete(`${this.baseUrl}${promptId}`).pipe(delay(2000));
    }

    upvotePrompt(promptId: number) {
        return this.httpClient.post<Prompt>(`${this.baseUrl}${promptId}/upvote`, null).pipe(delay(2000));
    }

    downvotePrompt(promptId: number) {
        return this.httpClient.post<Prompt>(`${this.baseUrl}${promptId}/downvote`, null).pipe(delay(2000));
    }
}
