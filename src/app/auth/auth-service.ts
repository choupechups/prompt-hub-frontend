import { HttpClient } from '@angular/common/http'
import { inject, Service, signal } from '@angular/core'
import { environment } from '../../environments/environment';
import { CurrentUser } from './current-user.model';
import { catchError, delay, of, tap } from 'rxjs';

@Service()
export class AuthService {
    httpClient = inject(HttpClient);

    baseUrl = environment.apiUrl + 'auth';

    currentUser = signal<CurrentUser | undefined>(undefined);

    loadCurrentUser() {
        return this.httpClient
            .get<CurrentUser>(`${this.baseUrl}/me`)
            .pipe(
                tap((crtusr) => this.currentUser.set(crtusr)),
                catchError(() => {
                    this.currentUser.set(undefined);
                    return of(undefined);
                })
            )
    }

    login(username: string, password: string) {
        return this.httpClient
            .post<CurrentUser>(`${this.baseUrl}/login`, {username, password})
            .pipe(tap((crtusr) => this.currentUser.set(crtusr)), delay(2000));
    }

    register(username: string, password: string) {
        return this.httpClient
            .post<CurrentUser>(`${this.baseUrl}/register`, {username, password})
            .pipe(tap((crtusr) => this.currentUser.set(crtusr)));
    }

    logout() {
        return this.httpClient
            .post(`${this.baseUrl}/logout`, {})
            .pipe(tap(() => this.currentUser.set(undefined)), delay(2000));
    }
}
