import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('괴도 손민수 REST API')
    .setDescription('괴도 손민수를 위한 REST API 명세서입니다.')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'apiKey',
        scheme: 'bearer',
        name: 'Authorization',
        in: 'header',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  for (const endpoint in document.paths) {
    for (const method in document.paths[endpoint]) {
      if (['post', 'put', 'patch'].includes(method)) {
        const target =
          document.paths[endpoint][method].requestBody?.content?.[
            'multipart/form-data'
          ];
        if (target) {
          const encoding = {};
          let check = false;
          const ref = target.schema.$ref.split('/').slice(-1)[0];

          const properties = document.components.schemas[ref]['properties'];

          for (const field in properties) {
            if (
              properties[field]['type'] === 'array' ||
              properties[field]['items']
            ) {
              check = true;
              encoding[field] = {
                explode: true,
              };
            }
          }

          if (check)
            document.paths[endpoint][method].requestBody?.content?.[
              'multipart/form-data'
            ] &&
              (document.paths[endpoint][method].requestBody['content'][
                'multipart/form-data'
              ]['encoding'] = encoding);

          console.log(
            document.paths[endpoint][method].requestBody['content'][
              'multipart/form-data'
            ]['encoding'],
          );
        }
      }
    }
  }

  SwaggerModule.setup('api-docs', app, document);
};
