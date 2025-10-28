import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface AuthTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    }

    @Injectable({
    providedIn: 'root'
    })
    export class SpotifyService {
    private http = inject(HttpClient);

    private authUrl = 'http://googleusercontent.com/spotify.com/3';
    private apiUrl = 'http://googleusercontent.com/spotify.com/4';

    private clientId = environment.spotify.clientId;
    private clientSecret = environment.spotify.clientSecret;

    private accessToken = new BehaviorSubject<string | null>(null);

    constructor() {}

    private getAccessToken(): Observable<string> {
        if (!this.clientId || this.clientId.startsWith('TU_CLIENT_ID') ||
            !this.clientSecret || this.clientSecret.startsWith('TU_CLIENT_SECRET')) {
        console.error('ERROR: Client ID o Client Secret de Spotify no configurados en environment.ts');
        return throwError(() => new Error('Credenciales de Spotify no configuradas. Revisa src/environments/environment.ts'));
        }

        const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
        });
        const body = new HttpParams().set('grant_type', 'client_credentials');

        return this.http.post<AuthTokenResponse>(this.authUrl, body.toString(), { headers }).pipe(
        tap(response => {
            console.log('Token obtenido!'); 
            this.accessToken.next(response.access_token);
        }),
        switchMap(response => {
            if (response.access_token) {
            return [response.access_token];
            } else {
            return throwError(() => new Error('No se pudo obtener el token de acceso'));
            }
        }),
        catchError(error => {
            console.error('Error al obtener el token de acceso:', error.message || error);
            this.accessToken.next(null);
            // Devuelve un error más específico si es posible
            const errorMsg = error.error?.error_description || 'Fallo en la autenticación con Spotify';
            return throwError(() => new Error(errorMsg));
        })
        );
    }

    private ensureAuthenticated(): Observable<string> {
        const currentToken = this.accessToken.getValue();
        // TODO: Añadir chequeo de expiración
        if (currentToken) {
        return new BehaviorSubject(currentToken).asObservable();
        } else {
        return this.getAccessToken();
        }
    }

    search(query: string, type: 'artist' | 'track' | 'album' | 'playlist'): Observable<any> {
        return this.ensureAuthenticated().pipe(
        switchMap(token => {
            if (!token) {
            return throwError(() => new Error('No autenticado'));
            }
            const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
            });
            const params = new HttpParams()
            .set('q', query)
            .set('type', type)
            .set('limit', '10');

            return this.http.get(`${this.apiUrl}/search`, { headers, params });
        }),
        catchError(error => {
            console.error(`Error en la búsqueda (${type}):`, error.message || error);
            if (error.status === 401) {
            this.accessToken.next(null); 
            return throwError(() => new Error('Token inválido o expirado. Intenta de nuevo.'));
            }
            return throwError(() => new Error(`Error al buscar ${type}`));
        })
        );
    }
}