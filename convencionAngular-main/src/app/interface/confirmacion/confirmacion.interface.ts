export interface Confirmacion {
    [x: string]: any;
    fechaRegistro: string;
    numEmpleado: string;
    nombreCompleto: string;
    correo: string;
    invitadoAsiste?: boolean|null;
    parejaAsiste?: boolean|null;
    nombrePareja: string;
    alergiaAlimentaria?: boolean|null;
    alergiaEsp: string;
    discapacidad?: boolean|null;
    discapacidadEsp: string;
    comentarios: string;
}