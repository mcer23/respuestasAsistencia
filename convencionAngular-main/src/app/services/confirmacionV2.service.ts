import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class confirmacionV2{
    private baseUrl = 'http://localhost:8080/api/v1/respuestasConvencionNacional';

    constructor (private http: HttpClient){}

    createConfirmacion(confirmacion:any){
        const headers = new HttpHeaders({'Content-Type':'application/json'});

        const payload ={
            ...confirmacion,
            fechaRegistro: confirmacion.fechaRegistro?.toISOString()
        };
        return this.http.post(
            `${this.baseUrl}/guardarRespuestasv2`,
            JSON.stringify(payload),
            {headers}
        );


    }


}