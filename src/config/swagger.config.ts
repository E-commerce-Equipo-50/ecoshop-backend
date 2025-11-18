import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  title: 'EcoShop API',
  description: 'API de e-commerce sostenible',
  version: '1.0',
  path: 'api/docs',
  options: {
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      docExpansion: 'none',
      tryItOutEnabled: true,
      syntaxHighlight: {
        activate: true,
        theme: 'agate',
      },
    },
    customSiteTitle: 'EcoShop API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .information-container { display: block; }
      .swagger-ui .scheme-container { display: none; }
    `,
  },
}));
