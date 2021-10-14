import {Readable} from 'node:stream';
import {S3Client, S3ClientConfig, PutObjectCommand, GetObjectCommand, HeadBucketCommand} from '@aws-sdk/client-s3';
import {streamToString} from './utils.js';

interface Source {
	bucket: string;
	key: string;
}

const defaultS3Options: S3ClientConfig = {
	region: 'us-east-1',
	forcePathStyle: true,
	apiVersion: 'v4',
};

export class BucketNotFoundError extends Error {
	constructor() {
		super();
		this.message = 'BucketNotFound';
	}
}

export class S3Adapter<T = any> {
	readonly source: Source;
	readonly S3: S3Client;

	constructor(source: Source, S3Options: S3ClientConfig = {}) {
		this.source = source;
		this.S3 = new S3Client({...defaultS3Options, ...S3Options});
	}

	async read(): Promise<T | null> {
		const headBucketCommand = new HeadBucketCommand({
			Bucket: this.source.bucket,
		});

		const getObjectCommand = new GetObjectCommand({
			Bucket: this.source.bucket,
			Key: this.source.key,
		});

		try {
			await this.S3.send(headBucketCommand);
		} catch {
			throw new BucketNotFoundError();
		}

		try {
			const response = await this.S3.send(getObjectCommand);
			const body = await streamToString(response.Body as Readable);
			return JSON.parse(body) as T;
		} catch {
			return null;
		}
	}

	async write(data: T): Promise<void> {
		const putObjectCommand = new PutObjectCommand({
			Bucket: this.source.bucket,
			Key: this.source.key,
			Body: JSON.stringify(data),
		});

		await this.S3.send(putObjectCommand);
	}
}
