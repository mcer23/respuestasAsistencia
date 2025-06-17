## v1.0.0 ##

### Integraciones ###
-Integración con dependencia MSAL y lógica de enrutamiento con Login incluido.
-Integración con dependencia interna coltrane para estilos estandarizados.
-Integración con dependencia prime-ng alineado con coltrane para ejemplos de componentes reutilizables. 
-Integración con dependencia primeicons.
-Integración con dependencia microsoft client para ejemplo de obtencion de datos de sesion.
### Componentes ###
-Layout: Permite definir tu propio layour basado en tus requerimientos (Puedes crear mas si es necesario.)
-primeng: Permite definir componentes integrados con primeng para la reutilización de los mismos.
-routes: Permite definir los componentes de rutas implementados en el proyecto.
### Cambios en versiones anteriores ###
-Se migran componentes a standalone por defecto
-Se habilitan configuraciones de compilación para SSR
-Se habilitan configuraciones de compilación para Backend for frontend
-Se remueven métodos de encriptación para localstorage (Requerimientos especiales pueden migrar a cookies o sesiones)
-Se implementan ejemplos de obtención de token de sesión con MSAL.
