import {writeFileSync, createReadStream} from 'node:fs';
import test from 'ava';
import tempy from 'tempy';
import {Low} from 'lowdb';
import {S3Client, GetObjectCommand, PutObjectCommand, HeadBucketCommand, S3ClientConfig} from '@aws-sdk/client-s3';
import {mockClient} from 'aws-sdk-client-mock';
import {S3Adapter} from '../source/s3-adapter.js';

const source = {bucket: 'bucket', key: 'data.json'};

interface Chat {
	id: number;
	title: string;
}

interface Data {
	chats: Chat[];
}

const temporaryFile = tempy.file();
const S3Mock = mockClient(S3Client);

test.before(() => {
	writeFileSync(temporaryFile, '{}');
	S3Mock
		.on(HeadBucketCommand)
		.resolves({$metadata: {httpStatusCode: 200}})
		.on(GetObjectCommand)
		.resolves({
			Body: createReadStream(temporaryFile),
		})
		.on(PutObjectCommand)
		.callsFake(input => {
			writeFileSync(temporaryFile, input.Body);
			return {};
		});
});

test.beforeEach(() => {
	writeFileSync(temporaryFile, '{}');
	S3Mock.reset();
});

test('read', async t => {
	const adapter = new S3Adapter<Data>(source);
	const db = new Low(adapter);

	db.data = {chats: [{id: 2, title: 'two'}]};
	await db.write();

	const item = db.data.chats.find(item => item.id === 2);
	const expected = {id: 2, title: 'two'};
	await db.read();

	t.deepEqual(item, expected);
});

test('write', async t => {
	const adapter = new S3Adapter<Data>(source);
	const db = new Low(adapter);

	db.data = {chats: []};
	db.data.chats.push({id: 3, title: 'three'});
	await db.write();
	const expected = {chats: [{id: 3, title: 'three'}]};

	t.deepEqual(db.data, expected);
});

test('custom S3 options', async t => {
	const S3Options: S3ClientConfig = {
		credentials: {
			accessKeyId: 'ACCESSKEYID',
			secretAccessKey: 'SECRETACCESSKEY',
		},
		region: 'test-region',
		endpoint: 'https://test.endpoint.com',
		apiVersion: '3.5',
		forcePathStyle: false,
	};

	const adapter = new S3Adapter<Data>(source, S3Options);
	const {S3: {config}} = adapter;

	t.is((await config.credentials()).accessKeyId, 'ACCESSKEYID');
	t.is((await config.credentials()).secretAccessKey, 'SECRETACCESSKEY');
	t.is((await config.region()), 'test-region');
	t.is((await config.endpoint()).protocol, 'https:');
	t.is((await config.endpoint()).hostname, 'test.endpoint.com');
	t.is(config.apiVersion, '3.5');
	t.is(config.forcePathStyle, false);
});
