# lowdb-s3

> lowdb AWS S3 adapter

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

You can pass S3 options

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
