


# KarenFlix API 
Plataforma de Reseñas de Películas
Este proyecto es el backend de KarenFlix, una plataforma de reseñas de películas. Está construido con Node.js, Express y MongoDB, enfocado en la seguridad y la gestión de contenido generado por los usuarios.

# Instrucciones de Instalación y Ejecución
Sigue estos pasos para clonar y levantar el proyecto en tu máquina local.

Prerrequisitos Asegúrate de tener instalado lo siguiente:

- Node.js (versión LTS recomendada)

- npm (incluido con Node.js)

- MongoDB (o una URI de conexión a un clúster de MongoDB Atlas)

### Pasos de Instalación Clonar el Repositorio:

- Bash

- git clone https://github.com/Mvteiio/ProyectoExpress_Backend_RomanMateo_ReyesAndres.git
cd ProyectoExpress_Backend_RomanMateo_ReyesAndres
Instalar Dependencias:

- Bash

- npm install
- Configurar Variables de Entorno:
- Crea un archivo llamado .env en la raíz del proyecto - y añade tus credenciales. Este archivo no debe - subirse a GitHub.

- Fragmento de código

- PORT=3000
MONGO_URI="mongodb:mongodb+srv://romancamargo02:TxcijpfOYeDfaRR4@cluster0.vmq8c0v.mongodb.net/
- JWT_SECRET="secretojwt"
- DB_NAME = karenFlix
Ejecutar el Servidor: 



-  Para ejecutar en modo desarrollo (usando nodemon)
npm run dev 

- El servidor estará operativo en http://localhost:3000
📁 Estructura del Proyecto
La arquitectura sigue una clara separación de responsabilidades para un backend basado en Express y MongoDB:


##  Principios Aplicados
El diseño de esta API se fundamenta en los siguientes principios de ingeniería de software:

Separación de Responsabilidades (MVC/Layered Architecture): El código se organiza en modelos, controladores y rutas para asegurar que cada módulo tenga una única función bien definida.

Inmutabilidad y Control de Instancias: Se utiliza el patrón de diseño Singleton para la creación de usuarios, asegurando que solo exista una instancia del módulo de registro para prevenir errores de concurrencia o duplicación innecesaria de lógica.

Principios SOLID (Parcial): Enfocado en el principio de Responsabilidad Única (SRP) al separar la lógica de autenticación (Passport) de la lógica de negocio (Controllers).

## Consideraciones Técnicas
Autenticación: Implementada con JWT (JSON Web Tokens) gestionados a través de Passport.js. Se utilizan middleware para proteger las rutas CRUD.

Base de Datos: MongoDB es utilizado como base de datos NoSQL, ideal para el almacenamiento flexible de documentos como reseñas y perfiles de películas.

Ranking y Popularidad: El sistema de ranking es un módulo de JavaScript ubicado en utils/ que calcula la popularidad basándose en el volumen y la calidad de las reseñas de los usuarios.

Documentación: La API está documentada en vivo con Swagger UI, accesible en: https://karenflix-api.onrender.com/api-docs.
## Estrutura
|-- [1.Config](config)

  

|-- [1.1.controllers](controllers)

  

|-- [1.1.1.repositories](repositories)

  

|-- [1.2.routes](routes)

  

|-- [1.3.gitignore](.gitignore)

  

│-- [2.Readme](README.md)

  

|-- [2.1.app](app.js)

  

|-- [2.1.1.authMiddleware](authMiddleware.js)

  

|-- [2.2.db](db.js)

  

|-- [2.3.packaje-lock.json](packaje-lock.json)

  

|-- [3.package.json](package.json)

  

|-- [3.1.swagger_docs](swagger_docs.js)

 ## Estrutura
|-- [1.Config](config)

  

|-- [1.1.controllers](controllers)

  

|-- [1.1.1.repositories](repositories)

  

|-- [1.2.routes](routes)

  

|-- [1.3.gitignore](.gitignore)

  

│-- [2.Readme](README.md)

  

|-- [2.1.app](app.js)

  

|-- [2.1.1.authMiddleware](authMiddleware.js)

  

|-- [2.2.db](db.js)

  

|-- [2.3.packaje-lock.json](packaje-lock.json)

  

|-- [3.package.json](package.json)

  

|-- [3.1.swagger_docs](swagger_docs.js)

 
  
## Readme Base de datos
[Base de datos](//BaseDatos.md)

 ## Créditos
####  Este proyecto fue desarrollado por:

[Román Mateo]()

[Reyes Andrés](https://github.com/andres8073562)

 Link al Repo del Frontend
(https://github.com/andres8073562/ProyectoExpress_Frontend_RomanMateo_ReyesAndres).

Repositorio Frontend: [PENDIENTE: Insertar enlace al repo del frontend aquí]

