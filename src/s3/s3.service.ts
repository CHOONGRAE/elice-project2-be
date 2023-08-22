import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as aws from 'aws-sdk';

@Injectable()
export class S3Service {
  private readonly s3: aws.S3;

  constructor(private readonly config: ConfigService) {
    aws.config.update({
      region: config.get('S3_REGION'),
      credentials: {
        accessKeyId: config.get('S3_ACCESS_KEY'),
        secretAccessKey: config.get('S3_SECRET_KEY'),
      },
    });

    this.s3 = new aws.S3();
  }

  async uploadImage(file: Express.Multer.File, folderPath = '/') {
    return await this.makeS3Request(file, folderPath);
  }

  private makeS3Request = (file: Express.Multer.File, folderPath: string) => {
    const trimedName = file.originalname.replace(/\s/gi, '');
    const fileName = `${Date.now()}_${trimedName}`;

    const key = `${folderPath}${fileName}`;
    const params = {
      Bucket: this.config.get('S3_BUCKET_NAME'),
      ACL: 'private',
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return new Promise((res, rej) => {
      this.s3.putObject(params, (err) => {
        if (err) rej(err);

        const url = `https://s3.${this.config.get(
          'S3_REGION',
        )}.amazonaws.com/${this.config.get('S3_BUCKET_NAME')}/${key}`;

        res(url);
      });
    });
  };
}
