# lowdb-s3

> Lowdb AWS S3 adapter

Adapter for [lowdb](https://github.com/typicode/lowdb) which uses AWS S3 to store data.

Requires [lowdb@1.0](https://github.com/typicode/lowdb/tree/v1.0.0).

## Usage

```bash
npm install @sadorlovsky/lowdb-s3@1
```

```js
const low = require('lowdb')
const S3 = require('@sadorlovsky/lowdb-s3')

const adapter = new S3({ bucket: 'bucket', key: 'db.json' })
const db = await low(adapter)
```

Custom S3 config

```js
const low = require('lowdb')
const S3 = require('@sadorlovsky/lowdb-s3')

const adapter = new S3({ bucket: 'bucket', key: 'db.json' }, {
  accessKeyId: 'ACCESS_KEY_ID',
  secretAccessKey: 'SECRET_ACCESS_KEY',
  region: 'custom-region',
  endpoint: 'custom.endpoint.com'
})
const db = await low(adapter)
```

## License

MIT
