const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'KarenFlix API',
    version: '1.0.0',
    description: 'API para la gestión de películas, series, reseñas y rankings para la plataforma KarenFlix.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Versión 1 de la API',
    },
  ],
  components: {
    schemas: {
      Movie: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '68d2b15ce2ee50e4b9a1de9e' },
          title: { type: 'string', example: 'Inception' },
          description: { type: 'string', example: 'A thief who steals corporate secrets through the use of dream-sharing technology.' },
          year: { type: 'number', example: 2010 },
          imageUrl: { type: 'string', example: 'https://example.com/inception.jpg' },
          categoryIds: { type: 'array', items: { type: 'string' }, example: ['68d213912c92d303f9a33a7a'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '68d213912c92d303f9a33a7a' },
          name: { type: 'string', example: 'Sci-Fi' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Review: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '68d3a123someReviewId...' },
          contentId: { type: 'string', example: '68d2b15ce2ee50e4b9a1de9e' },
          userId: { type: 'string', example: '68d1b456someUserId...' },
          title: { type: 'string', example: 'An Absolute Masterpiece!' },
          comment: { type: 'string', example: 'The plot was incredible and kept me on the edge of my seat.' },
          rating: { type: 'number', example: 5 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          msg: { type: 'string', example: 'Error message description' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/users/register': {
      post: {
        tags: ['Users'],
        summary: 'Registrar un nuevo usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', example: 'testuser' },
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Usuario registrado con éxito' },
          '400': { description: 'El usuario ya existe o datos inválidos' },
        },
      },
    },
    '/users/login': {
      post: {
        tags: ['Users'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          '202': {
            description: 'Login exitoso, devuelve un token JWT',
            content: { 'application/json': { schema: { properties: { token: { type: 'string' } } } } },
          },
          '401': { description: 'Credenciales inválidas' },
        },
      },
    },
    '/categories': {
      post: {
        tags: ['Categories'],
        summary: 'Crear una nueva categoría (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { properties: { name: { type: 'string', example: 'Superhéroes' } } } } },
        },
        responses: {
          '201': { description: 'Categoría creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
          '401': { description: 'No autorizado' },
          '403': { description: 'Acceso denegado (no es admin)' },
        },
      },
      get: {
        tags: ['Categories'],
        summary: 'Obtener todas las categorías',
        responses: {
          '200': {
            description: 'Lista de categorías',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } },
          },
        },
      },
    },
    '/categories/{id}': {
      put: {
        tags: ['Categories'],
        summary: 'Actualizar una categoría (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { properties: { name: { type: 'string', example: 'Ciencia Ficción' } } } } },
        },
        responses: {
          '200': { description: 'Categoría actualizada' },
          '401': { description: 'No autorizado' },
          '403': { description: 'Acceso denegado' },
          '404': { description: 'Categoría no encontrada' },
        },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Eliminar una categoría (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Categoría eliminada' },
          '401': { description: 'No autorizado' },
          '403': { description: 'Acceso denegado' },
          '404': { description: 'Categoría no encontrada' },
        },
      },
    },
    '/movies': {
        get: {
            tags: ['Movies'],
            summary: 'Obtener lista de películas con filtros',
            parameters: [
                { name: 'category', in: 'query', required: false, schema: {type: 'string'}, description: 'Filtrar por nombre de categoría'},
            ],
            responses: {
                '200': {
                    description: 'Lista de películas',
                    content: {'application/json': { schema: {type: 'array', items: {$ref: '#/components/schemas/Movie'}}}}
                }
            }
        },
        post: {
            tags: ['Movies'],
            summary: 'Crear una nueva película (Admin)',
            security: [{bearerAuth: []}],
            requestBody: {
                required: true,
                content: {'application/json': { schema: {$ref: '#/components/schemas/Movie'}}}
            },
            responses: {
                '201': { description: 'Película creada'},
                '401': { description: 'No autorizado'},
                '403': { description: 'Acceso denegado'}
            }
        }
    },
    '/movies/ranked': {
        get: {
            tags: ['Movies'],
            summary: 'Obtener el ranking ponderado de películas',
            responses: {
                '200': { description: 'Lista de películas ordenadas por ranking'}
            }
        }
    },
    '/movies/{id}': {
        get: {
            tags: ['Movies'],
            summary: 'Obtener el detalle de una película con sus reseñas',
            parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
            responses: {
                '200': { description: 'Detalle de la película'},
                '404': { description: 'Película no encontrada'}
            }
        },
        put: {
            tags: ['Movies'],
            summary: 'Actualizar una película (Admin)',
            security: [{bearerAuth: []}],
            parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
            requestBody: {
                required: true,
                content: {'application/json': { schema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' }
                    }
                }}}
            },
            responses: {
                '200': { description: 'Película actualizada'},
                '401': { description: 'No autorizado'},
                '403': { description: 'Acceso denegado'},
                '404': { description: 'Película no encontrada'}
            }
        }
    },
    '/reviews': {
        post: {
            tags: ['Reviews'],
            summary: 'Crear una nueva reseña (Usuario autenticado)',
            security: [{bearerAuth: []}],
            requestBody: {
                required: true,
                content: {'application/json': { schema: {
                    type: 'object',
                    properties: {
                        movieId: { type: 'string' },
                        title: { type: 'string' },
                        comment: { type: 'string' },
                        rating: { type: 'number' },
                    }
                }}}
            },
            responses: {
                '201': { description: 'Reseña creada'},
                '401': { description: 'No autorizado'}
            }
        }
    },
    '/reviews/{id}': {
        put: {
            tags: ['Reviews'],
            summary: 'Actualizar una reseña propia (Usuario autenticado)',
            security: [{bearerAuth: []}],
            parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
            requestBody: {
                required: true,
                content: {'application/json': { schema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        comment: { type: 'string' },
                        rating: { type: 'number' }
                    }
                }}}
            },
            responses: {
                '200': { description: 'Reseña actualizada'},
                '401': { description: 'No autorizado'},
                '403': { description: 'No es propietario de la reseña'},
                '404': { description: 'Reseña no encontrada'}
            }
        }
    },
    '/reviews/{id}/like': {
        post: {
            tags: ['Reviews'],
            summary: 'Dar like a una reseña (Usuario autenticado)',
            security: [{bearerAuth: []}],
            parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
            responses: {
                '200': { description: 'Acción de like/unlike procesada'},
                '401': { description: 'No autorizado'},
                '403': { description: 'No se puede dar like a la propia reseña'}
            }
        }
    },
    '/reviews/{id}/dislike': {
        post: {
            tags: ['Reviews'],
            summary: 'Dar dislike a una reseña (Usuario autenticado)',
            security: [{bearerAuth: []}],
            parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
            responses: {
                '200': { description: 'Acción de dislike/undislike procesada'},
                '401': { description: 'No autorizado'},
                '403': { description: 'No se puede dar dislike a la propia reseña'}
            }
        }
    }
  },
};

module.exports = swaggerDocs;