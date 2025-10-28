import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

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

    private authUrl = 'https://accounts.spotify.com/api/token';
    private apiUrl = 'https://api.spotify.com/v1';

    private clientId = 'TU_CLIENT_ID'; 
    private clientSecret = 'TU_CLIENT_SECRET';

    private accessToken = new BehaviorSubject<string | null>(null);

    constructor() {
        // this.authenticate();
    }

    private getAccessToken(): Observable<string> {
        const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret) 
        });
        const body = new HttpParams().set('grant_type', 'client_credentials');

        return this.http.post<AuthTokenResponse>(this.authUrl, body.toString(), { headers }).pipe(
        tap(response => {
            console.log('Token obtenido:', response);

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
            console.error('Error al obtener el token de acceso:', error);
            this.accessToken.next(null);
            return throwError(() => new Error('Fallo en la autenticación con Spotify'));
        })
        );
    }

    private ensureAuthenticated(): Observable<string> {
        const currentToken = this.accessToken.getValue();
        if (currentToken /* && !isExpired(currentToken) */) { 
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
            console.error(`Error en la búsqueda (${type}):`, error);
            return throwError(() => new Error(`Error al buscar ${type}`));
        })
        );
    }

}