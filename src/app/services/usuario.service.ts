import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginResponse } from 'src/interfaces/intUsuario/LoginResponse';
import { UsuarioLogin } from 'src/interfaces/intUsuario/UsuarioLogin';
import { UsuarioResponse } from 'src/interfaces/intUsuario/UsuarioResponse';
import { AuthService } from './Auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl: string = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllUsuarios(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(`${this.baseUrl}/usuario`);
  }

  getOneUsuario(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.baseUrl}/usuario/${id}`);
  }

  getAuthenticatedUsuario(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.baseUrl}/me`, {
      headers: this.getAuthHeaders()
    });
  }

  postUsuario(nUser: UsuarioResponse): Observable<string> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/usuario`, nUser)
      .pipe(map(response => response.message));
  }

  loginUsuario(usLogin: UsuarioLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, usLogin).pipe(
      tap((response: LoginResponse) => {
        if (response.message === 'Inicio de sesión exitoso' && response.access_token) {
          this.authService.login(response.access_token);
        }
      })
    );
  }

  // Método para obtener los headers de autorización
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  logout() {
    this.authService.logout();
  }
}