export interface Confirmacion {
    fechaRegistro: Date;
    numEmpleado: string;
    nombreCompleto: string;
    correo: string;
    invitadoAsiste?: boolean;
    parejaAsiste?: boolean;
    nombrePareja: string;
    alergiaAlimentaria?: boolean;
    alergiaEsp: string;
    discapacidad?: boolean;
    discapacidadEsp: string;
    comentarios: string;
}