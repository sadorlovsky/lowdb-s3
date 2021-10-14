import {Buffer} from 'node:buffer';
import {Readable} from 'node:stream';

export const streamToString = async (stream: Readable): Promise<string> => new Promise((resolve, reject) => {
	const chunks: Uint8Array[] = [];
	stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
	stream.on('error', reject);
	stream.on('end', () => {
		resolve(Buffer.concat(chunks).toString('utf8'));
	});
});
