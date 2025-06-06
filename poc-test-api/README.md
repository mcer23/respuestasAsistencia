# Plantilla Framework Spring Boot

---
## ¿Cómo ejecutar el proyecto con los diferentes tipos de conexiones de BD de forma local?

A continuación se indica como deberá de configurarse el proyecto para los diferentes tipos de conexiones de BD y cuales son los pre-requisitos necesarios para poder ejecutar el proyecto localmente.


### H2
El archivo application.yml deberá tener una configuración como la siguiente:

`application.yml`
```yaml
server:
  servlet:
    context-path: /api/v1
  port: 8080

app:
  authUri: https://app.coppel.cloud/api/sso/v1/verify
  ignoreSession: true
  allowedOrigins: "*"
  allowedMethods: GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD
  allowedHeaders: Access-Control-Allow-Origin,Access-Control-Allow-Headers,Access-Control-Allow-Methods,Accept,Authorization,Content-Type,Method,Origin,X-Forwarded-For,X-Real-IP
  exposedHeaders: X-Get-Header

spring:
  datasource:
    url: jdbc:h2:mem:testdb             
    driver-class-name: org.h2.Driver    
    username: sa                        
    password:                           
    tomcat:
      connection-properties: useUnicode=true;characterEncoding=utf-8;
    hikari:
      minimumIdle: 2
      maximumPoolSize: 4
      idleTimeout: 15000
      poolName: SpringBootJPAHikariCP
      maxLifetime: 1800000
      connectionTimeout: 30000
  sql:
    init:
      encoding: UTF-8
      mode: always 
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect  
    hibernate:
      ddl-auto: update
  h2:               
    console:        
      enabled: true 

management:
  server:
    port: 8080
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: never
```


### Yugabyte

El archivo application.yml deberá tener una configuración como la siguiente:

`application.yml`
```yaml
server:
  servlet:
    context-path: /api/v1
  port: 8080

app:
  authUri: https://app.coppel.cloud/api/sso/v1/verify
  ignoreSession: true
  allowedOrigins: "*"
  allowedMethods: GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD
  allowedHeaders: Access-Control-Allow-Origin,Access-Control-Allow-Headers,Access-Control-Allow-Methods,Accept,Authorization,Content-Type,Method,Origin,X-Forwarded-For,X-Real-IP
  exposedHeaders: X-Get-Header

spring:
  datasource:
    url: jdbc:postgresql://localhost:5433/pruebas   
    driver-class-name: org.postgresql.Driver        
    username: yugabyte                              
    password:                                       
    tomcat:
      connection-properties: useUnicode=true;characterEncoding=utf-8;
    hikari:
      minimumIdle: 2
      maximumPoolSize: 4
      idleTimeout: 15000
      poolName: SpringBootJPAHikariCP
      maxLifetime: 1800000
      connectionTimeout: 30000
  sql:
    init:
      encoding: UTF-8
      mode: always 
      data-locations: classpath:yugabyte-data.sql 
  jpa:
    hibernate:
      ddl-auto: update
    properties:                                             
      hibernate:                                            
        dialect: org.hibernate.dialect.PostgreSQLDialect

management:
  server:
    port: 8080
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: never
```


### Informix

El archivo application.yml deberá tener una configuración como la siguiente:

`application.yml`
```yaml
server:
  servlet:
    context-path: /api/v1
  port: 8080

app:
  authUri: https://app.coppel.cloud/api/sso/v1/verify
  ignoreSession: true
  allowedOrigins: "*"
  allowedMethods: GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD
  allowedHeaders: Access-Control-Allow-Origin,Access-Control-Allow-Headers,Access-Control-Allow-Methods,Accept,Authorization,Content-Type,Method,Origin,X-Forwarded-For,X-Real-IP
  exposedHeaders: X-Get-Header

spring:
  datasource:
    url: jdbc:informix-sqli://localhost:9088/pruebas:INFORMIXSERVER=informix;DELIMIDENT=y;    
    driver-class-name: com.informix.jdbc.IfxDriver     
    username: informix                                                                        
    password: in4mix                                                                          
    tomcat:
      connection-properties: useUnicode=true;characterEncoding=utf-8;
    hikari:
      minimumIdle: 2
      maximumPoolSize: 4
      idleTimeout: 15000
      poolName: SpringBootJPAHikariCP
      maxLifetime: 1800000
      connectionTimeout: 30000
  sql:
    init:
      encoding: UTF-8
      mode: never
      data-locations: classpath:informix-data.sql 
  jpa:
    hibernate:
      ddl-auto: update
    properties:                                             
      hibernate:                                            
        dialect: org.hibernate.community.dialect.InformixDialect

management:
  server:
    port: 8080
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: never
```

---

## Cambios (25/07/2024)

### Actualización a Spring Boot 3.3.2 + Java 21

Se actualiza a la última versión de Spring Boot y Java LTS.

#### Archivo pom.xml

Versión del framework:

`pom.xml`
```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.3.2</version>
  <relativePath/>
  <!-- lookup parent from repository -->
</parent>
```

Para generar el artefacto debe utilizarse la versión Java 21.

`pom.xml`
```xml
<properties>
  <java.version>21</java.version>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
  ...      
</properties>
```

Se unifican versiones de dependencias y plugins en properties del POM.

`pom.xml`
```xml
<properties>
  <java.version>21</java.version>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
  <jkube.maven.plugin.version>1.16.2</jkube.maven.plugin.version>
  <webmvc.maven.plugin.version>2.6.0</webmvc.maven.plugin.version>
  <modelmapper.maven.plugin.version>3.2.0</modelmapper.maven.plugin.version>
  <dependency.maven.plugin.version>3.7.1</dependency.maven.plugin.version>
  <mockito.plugin.version>5.12.0</mockito.plugin.version>
  <hibernate.core.maven.plugin.version>6.1.7.Final</hibernate.core.maven.plugin.version>
  <hibernate.dialects.maven.plugin.version>6.1.7.Final</hibernate.dialects.maven.plugin.version>
  <informix.jdbc.maven.plugin.version>4.50.10.1</informix.jdbc.maven.plugin.version>
  <sonar.maven.plugin.version>3.11.0.3922</sonar.maven.plugin.version>
  <sonar.host.url>https://sonarqube.coppel.io/sonar</sonar.host.url>
  <sonar.projectKey>centro:folio</sonar.projectKey>
  <sonar.projectName>${project.name}</sonar.projectName>
  <sonar.projectVersion>${project.version}</sonar.projectVersion>
  <sonar.sources>./src/main</sonar.sources>
  <sonar.exclusions>
    ./src/test,
    ./tests
  </sonar.exclusions>
  <sonar.java.binaries>./src</sonar.java.binaries>
  <sonar.java.libraries>./target/dependency/*.jar</sonar.java.libraries>
</properties>
```

Se actualiza propiedad name y version por project.name y project.version.

`pom.xml`
```xml
<properties>
  ...
  <sonar.projectName>${project.name}</sonar.projectName>
  <sonar.projectVersion>${project.version}</sonar.projectVersion>
  ...
</properties>
```

Se agregan dependencias:
  - Informix:
    - org.hibernate.orm:hibernate-core
    - org.hibernate.orm:hibernate-community-dialects
    - com.ibm.informix:jdbc
  - Test:
    - org.mockito:mockito-core

Se actualiza versión de las siguientes dependencias:
  - org.modelmapper:modelmapper
  - org.springdoc:springdoc-openapi-starter-webmvc-ui
  - org.sonarsource.scanner.maven:sonar-maven-plugin

`pom.xml`
```xml
<dependencies>
  <dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>${hibernate.core.maven.plugin.version}</version>
  </dependency>

  <dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-community-dialects</artifactId>
    <version>${hibernate.dialects.maven.plugin.version}</version>
  </dependency>
  
  ...

  <dependency>
    <groupId>com.ibm.informix</groupId>
    <artifactId>jdbc</artifactId>
    <version>${informix.jdbc.maven.plugin.version}</version>
  </dependency>

  <dependency>
    <groupId>org.modelmapper</groupId>
    <artifactId>modelmapper</artifactId>
    <version>${modelmapper.maven.plugin.version}</version>
  </dependency>

  ...

  <dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>${webmvc.maven.plugin.version}</version>
  </dependency>

  <dependency>
    <groupId>org.sonarsource.scanner.maven</groupId>
    <artifactId>sonar-maven-plugin</artifactId>
    <version>${sonar.maven.plugin.version}</version>
  </dependency>

  <dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>${mockito.plugin.version}</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

Se agrega profile para build con JKube.

`pom.xml`
```xml
  <profiles>
		<profile>
			<id>kubernetes</id>
			<build>
				<plugins>
					<plugin>
						<groupId>org.eclipse.jkube</groupId>
						<artifactId>kubernetes-maven-plugin</artifactId>
						<version>${jkube.maven.plugin.version}</version>
						<executions>
							<execution>
								<id>fmp</id>
								<goals>
									<goal>resource</goal>
									<goal>build</goal>
								</goals>
							</execution>
						</executions>
					</plugin>
				</plugins>
			</build>
		</profile>
	</profiles>
```

Se actualiza versión de plugin para build del proyecto y se agregan configuraciones para JKube.

`pom.xml`
```xml
    <build>
        <finalName>app</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <version>${dependency.maven.plugin.version}</version>
                <executions>
                    ...
                    <execution>
                        <goals>
                            <goal>tree</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <layers>
						<enabled>false</enabled>
					</layers>
                </configuration>
                <executions>
                    ...
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```


### Propiedades (application.yml)

Este archivo corresponde a la configuración del servicio y se realizaron los siguientes cambios:

#### Conexión a BD

Se cambia la configuración a BD para las diferentes BD:
  - H2:
    `application.yml`
    ```yaml
    datasource:
      url: jdbc:h2:mem:testdb             
      driver-class-name: org.h2.Driver    
      username: sa                        
      password:  
    ```
  - Yugabyte:
    `application.yml`
    ```yaml
    datasource:
      url: jdbc:postgresql://localhost:5433/pruebas   
      driver-class-name: org.postgresql.Driver        
      username: yugabyte                              
      password:  
    ```
  - Informix:
    `application.yml`
    ```yaml
    datasource:
      url: jdbc:informix-sqli://localhost:9088/pruebas:INFORMIXSERVER=informix;DELIMIDENT=y;    
      driver-class-name: com.informix.jdbc.IfxDriver
      username: informix                                                                        
      password: in4mix                                                                          
    ```

#### Configuración de Hikari

Cambio en la configuración de Hikari para el número de conexiones de pool, dejando como mínimo 2 y máximo 4 conexiones.

`application.yml`
```yaml
hikari:
  minimumIdle: 2
  maximumPoolSize: 4
  idleTimeout: 15000
  poolName: SpringBootJPAHikariCP
  maxLifetime: 1800000
  connectionTimeout: 30000
```

#### Configuración de SQL y JPA

Se agrega configuración para SQL y JPA de acuerdo a las diferentes BD.
  - H2:
    `application.yml`
    ```yaml
    sql:
      init:
        encoding: UTF-8
        mode: always 
    jpa:
      database-platform: org.hibernate.dialect.H2Dialect  
      hibernate:
        ddl-auto: update
    h2:               
      console:        
        enabled: true 
    ```
  - Yugabyte:
    `application.yml`
    ```yaml
    sql:
      init:
        encoding: UTF-8
        mode: always 
        data-locations: classpath:yugabyte-data.sql 
    jpa:
      hibernate:
        ddl-auto: update
      properties:                                             
        hibernate:                                            
          dialect: org.hibernate.dialect.PostgreSQLDialect
    ```
  - Informix:
  `application.yml`
    ```yaml
    sql:
      init:
        encoding: UTF-8
        mode: never
        data-locations: classpath:informix-data.sql 
    jpa:
      hibernate:
        ddl-auto: update
      properties:                                             
        hibernate:                                            
          dialect: org.hibernate.community.dialect.InformixDialect
    ```

#### Configuración de Actuator

Se agrega la configuración de Actuator para permitir los endpoint `health` e `info` sobre el puerto 8080.

`application.yml`
```yaml
management:
  server:
    port: 8080
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: never
```


### Archivos con sentencias SQL

Se agregan archivos con sentencias SQL:
  - Yugabyte (`yugabyte-data.sql`): Sentencias para crear tablas e insertar datos.
  - Informix (`informix-data.sql`): Sentencias para crear tablas e insertar datos.


### Pruebas unitarias

Se complementan las pruebas unitarias y se agrega clase para manejar los datos Dummy de pruebas.
  - Archivo: 
    - `DummyData.java`


### Archivos de deployment para JKube

Se agregan archivos de configuración para deployment para JKube.
  - Archivos:
    - `configMap.yml`
    - `deployment.yml`
    - `service.yml`


---


## Cambios (24/01/2024)

### Actualización a Spring Boot 3.2.2 + Java 17

Adicionalmente, se quita la versión transitoria de SnakeYaml (v. 2.0), para continuar con la versión auto administrada en Spring Boot 3.2.2.

org.yaml:snakeyaml:jar:2.2:compile (version managed from 2.2)

---

## Cambios (15/12/2023)

### Actualización a Spring Boot 3.1.6 + Java 17

Actualización de Seguridad (Spring Actuator).
Relacionado con el health-check de la aplicación.

---

## Cambios (20/09/2023)

### Actualización a Spring Boot 3.1.3 + Java 17

Actualización transitoria de Managed Dependency: SnakeYaml 2.0, por hallazgos en Software Composition Analysis (SCA).

Al tratarse de una dependencia gestionada por el propio framework, es posible que se actualice próximamente, por lo que este cambio tendrá que revertirse.

`pom.xml`
```xml
[...]
<properties>
    <java.version>17</java.version>
    <snakeyaml.version>2.0</snakeyaml.version>
[...]
```

## Cambios (08/08/2023)

### Actualización a Spring Boot 3.1.2 + Java 17.0.8

Las siguientes modificaciones deben existir para migrar hacia Spring Boot 3.

#### Archivo pom.xml

Esquema del proyecto:

`pom.xml`
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
```

Versión del framework:

`pom.xml`
```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.1.2</version>
  <relativePath/>
  <!-- lookup parent from repository -->
</parent>
```

Para generar el artefacto debe utilizarse la Java 17

`pom.xml`
```xml
<properties>
  <java.version>17</java.version>
  <sonar.host.url>https://sonarqube.coppel.io/sonar</sonar.host.url>
  <sonar.projectKey>centro:folio</sonar.projectKey>
  <sonar.projectName>nombre</sonar.projectName>
  <sonar.projectVersion>1.0.0</sonar.projectVersion>
  <sonar.sources>./src/main</sonar.sources>
  <sonar.exclusions>./src/test</sonar.exclusions>
  <sonar.java.binaries>./src</sonar.java.binaries>
  <sonar.java.libraries>./target/dependency/*.jar</sonar.java.libraries>
</properties>
```

El proyecto Java EE (Enterprise Edition) fue migrado al proyecto Jakarta.
Por lo que, además de agregar la dependencia `spring-boot-starter-data-jpa`, es necesario agregar la dependencia de Jakarta.

`pom.xml`
```xml
<dependency>
  <groupId>jakarta.persistence</groupId>
  <artifactId>jakarta.persistence-api</artifactId>
</dependency>
```

Ya no es necesario excluir JUnit4 para usar JUnit 5 (Jupiter). Esta dependencia ya trabaja con JUnit 5.

`pom.xml`
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

Finalmente, para seguir usando la interfaz de Swagger para verificar el detalle de los diferentes endpoints, necesitamos excluir la dependencia:

`pom.xml`
```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-ui</artifactId>
  <version>LATEST</version>
</dependency>
```

Y agregar la nueva dependencia:

`pom.xml`
```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>LATEST</version>
</dependency>
```

De esta manera, podremos acceder a la documentación de Swagger con la siguiente URL:

	[OpenAPI definition](http://localhost:8080/api/v1/swagger-ui/index.html)


#### Entidades

Las clases localizadas en com/coppel/entities, son clases marcadas como Entidades Relacionales.

Para hacer efectivas las anotaciones relacionadas con objetos relacionales de la BD, es necesario especificar que estas anotaciones se encuentran actualmente en Jakarta:

Anteriormente:

```java
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
...
```

Bajo el nuevo modelo usando Jakarta:

```java
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
...
```

#### Configuración de Logs (LogBack)

En el archivo de configuración `resources/logback.xml`, se corrige el patrón de generación de logs, para continuar con el soporte de la aplicación.

---

## Cambios (30/06/2023)

#### Actualización a la versión 2.7.13 de Spring Boot

#### Implementación de plugin BuildProperties

Se agrega plugin de Maven para obtener propiedades del proyecto, como la versión final del artefacto.

#### Versión de API en Headers de la petición

`X-API-Version`, Se agrega esta propiedad a los encabezados para identificar el número de versión del API. Esta propiedad corresponde a la versión del artefacto en `pom.xml`.

En `application.yml`, la versión mayor utilizada en el Contexto (`server.servlet.context-path`), debe coincidir con la versión del proyecto en `pom.xml`.

`application.yml`
```yaml
server:
  servlet:
    context-path: /api/v1
```

`pom.xml`
```xml
    <groupId>com.coppel</groupId>
    <artifactId>ejemplo-spring-boot</artifactId>
    <version>1.1.0</version>
    <name>ejemplo-spring-boot</name>
```

---

## Cambios (09/08/2022)

#### Actualización a la versión 2.7.2 de Spring Boot

#### Corrección de `codesmells` detectados por Sonarqube con respecto a la versión de Java 11.

Algunos de los `codesmells` continúan existiendo. Unos para mantener compatiblidad con versiones anteriores de Java, y otros para mantener la legibilidad del código.

#### Implementación de Sonar Scanner para Maven

Con este cambio se elimina la dependencia con el plugin de Jacoco, con el objetivo de dar soporte a las clases creadas con la biblioteca Project Lombok, y se transfiere el escaneo al plugin de Maven incluido en el proyecto.

En el archivo `pom.xml` se incluyen las propiedades de Sonar que se incluían en el archivo `sonar-project.properties`. En lo sucesivo deben actualizarse las variables siguientes en `pom.xml` con el objetivo de realizar el escaneo:

```xml
<properties>
    <java.version>11</java.version>
    <sonar.host.url>https://sonarqube.coppel.io/sonar</sonar.host.url>
    <sonar.projectKey>centro:folio</sonar.projectKey>
    <sonar.projectName>nombre</sonar.projectName>
    <sonar.projectVersion>1.0.0</sonar.projectVersion>
    <sonar.sources>./src/main</sonar.sources>
    <sonar.exclusions>./src/test</sonar.exclusions>
    <sonar.java.binaries>./src</sonar.java.binaries>
    <sonar.java.libraries>./target/dependency/*.jar</sonar.java.libraries>
</properties>
```

Una vez actualizadas las variables, el escaneo debe ejecutarse con el siguiente comando:

```terminal
<Carpeta principal del proyecto>  mvn clean verify sonar:sonar
```

---

## Propiedades (application.yml)

Este archivo corresponde a la configuración del servicio y se compone de pocos apartados.

#### Servidor, Puerto y Contexto

La configuración inicial del servicio corresponde al puerto por default que servirá la aplicación (8080), y el contexto que se usará para acceder a los endpoints de la API.

```yaml
server:
  servlet:
    context-path: /api/v1
  port: 8080
```

#### Integración con SSO

Pensando en `Desarrollo`, al principio se ignora la validación de un token de autenticación.

Es por ello que la variable `app.ignoreSession = true`  por default. Este valor debe cambiarse a `false` en entornos productivos. Una vez puesta en `app.ignoreSession = false`, el servicio validará el token de autenticación para cada una de las peticiones y lo hará por medio del servicio indicado en la propiedad `app.authUri`.

```yaml
app:
  authUri: https://sso.coppel.io:50061/api/v1/verify
  ignoreSession: true
```

#### Database (Spring Boot DataSource)

En este apartado se definen las variables (propiedades) correspondientes a conexiones con bases de datos.

**Nota sobre H2:**

La plantilla incluye la dependencia con `H2`, una base de datos en memoria usada ampliamente para crear `mocks` o datos ficticios. Aunado a esta base de datos se incluye un archivo `resources/data.sql` con una definición de tablas y carga inicial de datos.

**Para BD institucionales:**

Suponiendo que nos conectaremos a una base de datos de Postgres, los valores para crear la conexión a la base de datos, serían definidos de la siguiente manera:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://local.coppel.io:5432/test?currentSchema=public&ApplicationName=nom_aplicacion&socketTimeout=30
    driver-class-name: org.postgresql.Driver
    username: sa
    password: 
```

Para crear una conexión con MSSQL Server:

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://local.coppel.io:1433;databaseName=test;applicationName=nom_aplicacion;socketTimeout=30000
    driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver
    username: sa
    password: 
```

Como puede verse en ambos ejemplos, es importante indicar el `applicationName` para monitorear desde la base de datos el número de conexiones creadas (y mantenidas) por el pool de conexiones de la aplicación.

Puedes usar los siguientes comandos, dependiendo del motor de base de datos que estés usando:

**Postgres:**

```sql
SELECT now(), * 
FROM pg_stat_activity 
WHERE application_name = 'nom_aplicacion'
```

**MSSQL Server:**

```sql
SELECT c.session_id
    , c.net_transport
    , c.encrypt_option
    , c.auth_scheme
    , s.host_name
    , s.program_name
    , s.client_interface_name
    , s.login_name
    , c.connect_time
    , s.login_time
FROM sys.dm_exec_connections AS c JOIN sys.dm_exec_sessions AS s ON c.session_id = s.session_id 
WHERE s.program_name = 'nom_aplicacion'
```

**Nota importante:**

Las credenciales de la BD se incluyen en el archivo de configuración para soportar el ejemplo y facilitar el desarrollo.

Pero en Master (o Main) y en entornos productivos, es importante exlcuir las credenciales de bases de datos. Estas credenciales deben ser proporcionadas por el equipo de operación durante el despliegue del servicio, como una buena práctica de seguridad y para que las credenciales de bases de datos productivas queden como parte de la configuración.

#### Hikari - Connection Pool

A partir de la versión 2 de Spring Boot, se incluye este pool de conexiones.

Es recomendable usar un pool de conexiones por varias razones, en lugar de usar clases personalizadas para el manejo de conexiones a bases de datos.

La configuración de Hikari en el archivo se lleva a cabo por las siguientes variables:

```yaml
hikari:
    minimumIdle: 4
    maximumPoolSize: 8
    idleTimeout: 15000
    poolName: SpringBootJPAHikariCP
    maxLifetime: 1800000
    connectionTimeout: 30000
```

Los valores para cada una de las propiedades fueron elegidos en base a los entornos comunes en `Grupo Coppel`, y a la [documentación oficial de Hikari](https://github.com/brettwooldridge/HikariCP).

#### Notas sobre el uso de YAML en el archivo de configuración `application.yml`

A partir de la versión 2.7 se reemplaza el archivo `application.properties` por su equivalente en formato YAML: `application.yml`. El primer archivo seguirá siendo compatible (`application.properties`). Simplemente se cambia para mejorar la facilidad de lectura debido a que en algunas implementaciones el manejo de variables resulta ser demasiado verboso.

Si deseas conocer o aumentar tus conocimientos sobre este lenguaje de serialización de datos, te recomendamos visitar 2 sitios.

- [¿Qué es YAML?](https://www.redhat.com/es/topics/automation/what-is-yaml)
- [YAML for beginners](https://www.redhat.com/sysadmin/yaml-beginners)
