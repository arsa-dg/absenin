import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import * as Minio from 'minio';
import { extname } from 'path';
import 'multer';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient!: Minio.Client;
  private readonly bucketName = 'photos';
  private readonly minioHost = process.env.MINIO_ENDPOINT || 'localhost';
  private readonly minioPort = Number(process.env.MINIO_PORT) || 9000;
  private readonly useSSL = false;
  private readonly publicUrl = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';

  async onModuleInit() {
    this.minioClient = new Minio.Client({
      endPoint: this.minioHost,
      port: this.minioPort,
      useSSL: this.useSSL,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });

    await this.ensureBucketWithPublicPolicy();
  }

  private async ensureBucketWithPublicPolicy() {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
    }

    const publicReadPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };

    await this.minioClient.setBucketPolicy(
      this.bucketName,
      JSON.stringify(publicReadPolicy),
    );
  }

  async uploadPhoto(file: Express.Multer.File): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `photo-${uniqueSuffix}${extname(file.originalname)}`;

    try {
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );
      return fileName;
    } catch {
      throw new InternalServerErrorException('Failed to upload file to MinIO');
    }
  }

  getPublicUrl(fileName: string): string {
    return `${this.publicUrl}/${this.bucketName}/${fileName}`;
  }
}