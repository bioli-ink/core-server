import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { AuthModule } from 'src/app/auth/auth.module';
// import { ClientUserModule } from 'src/app/client-user/client-user.module';
// import { ConfigModule } from 'src/app/config/config.module';
// import { ModuleModule } from 'src/app/module/module.module';
// import { UserModule } from 'src/app/user/user.module';

const getDocumentBuilder = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
};

const createMainDocs = async (app: INestApplication) => {
  const options = getDocumentBuilder({
    title: 'bioli.ink API接口文档',
    description: '',
  });
  const document = SwaggerModule.createDocument(app, options, {
    include: [
      // AuthModule,
      // ClientUserModule,
      // ConfigModule,
      // ModuleModule,
      // UserModule,
    ],
  });

  SwaggerModule.setup('apidoc', app, document);
};

export const createDocs = async (app: INestApplication) => {
  await createMainDocs(app);
};
