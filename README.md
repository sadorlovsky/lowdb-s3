# lowdb-s3

> Lowdb AWS S3 adapter

Adapter for [lowdb](https://github.com/typicode/lowdb) which uses AWS S3 to store data.

Requires lowdb >= 3.0

## Usage

```bash
yarn add @sadorlovsky/lowdb-s3
```

```js
import { Low } from 'lowdb';
import { S3Adapter } from '@sadorlovsky/lowdb-s3';

const adapter = new S3Adapter({ bucket: 'bucket', key: 'db.json' });
const db = new Low(adapter);
```

Custom S3 config

```js
import { Low } from 'lowdb';
import { S3Adapter } from '@sadorlovsky/lowdb-s3';

const adapter = new S3Adapter({ bucket: 'bucket', key: 'db.json' }, {
  credentials: {
    accessKeyId: 'ACCESS_KEY_ID',
    secretAccessKey: 'SECRET_ACCESS_KEY',
  },
  region: 'custom-region',
  endpoint: 'https://custom.endpoint.com'
});
const db = new Low(adapter);
```

TypeScript usage

```ts
import { Low } from 'lowdb';
import { S3Adapter } from '@sadorlovsky/lowdb-s3';

interface User {
  id: number;
  name: string;
}

interface Data {
  users: User[];
}

const adapter = new S3Adapter<Data>({ bucket: 'bucket', key: 'db.json' });
const db = new Low(adapter);
```

## License

MIT
