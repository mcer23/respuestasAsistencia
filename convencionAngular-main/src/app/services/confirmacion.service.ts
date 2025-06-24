import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Confirmacion {
    id: number;
    fechaRegistro: Date;
    numEmpleado: string;
    nombreCompleto: string;
    correo: string;
    invitadoAsiste: boolean;
    parejaAsiste: boolean;
    nombrePareja: string;
    alergiaAlimentaria: boolean;
    especificacionAlergia: string;
    discapacidad: boolean;
    descripcionDiscapacidad: string;
    comentarios: string;
}
@Injectable({
    providedIn: "root"
})
export class ConfirmacionService {
    private baseUrl = 'http://localhost:8080/api/confirmaciones'; // Cambia esto por la URL de tu API

    constructor(private http: HttpClient) {}
    getInicioSesion(): Observable<Confirmacion> {
        return this.http.get<Confirmacion>(`${this.baseUrl}/inicio-sesion`);
    }
    postUsuario(usuario: Confirmacion): Observable<Confirmacion> {
        return this.http.post<Confirmacion>(`${this.baseUrl}/usuario`, usuario);
    }
    getUsuarioActual(): Observable<Confirmacion> {
        return this.http.get<Confirmacion>(`${this.baseUrl}/usuario/actual`);
    }
    

    getConfirmaciones(): Observable<Confirmacion[]> {
        return this.http.get<Confirmacion[]>(this.baseUrl);
    }

    getConfirmacion(id: number): Observable<Confirmacion> {
        return this.http.get<Confirmacion>(`${this.baseUrl}/${id}`);
    }

    createConfirmacion(confirmacion: Confirmacion): Observable<Confirmacion> {
        return this.http.post<Confirmacion>(this.baseUrl, confirmacion);
    }

    updateConfirmacion(confirmacion: Confirmacion): Observable<Confirmacion> {
        return this.http.put<Confirmacion>(`${this.baseUrl}/${confirmacion.id}`, confirmacion);
    }

    deleteConfirmacion(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}