# lowdb-s3

> Lowdb AWS S3 Adapter

## Usage

```bash
npm install @sadorlovsky/lowdb-s3
```

```js
const low = require('lowdb')
const S3 = require('@sadorlovsky/lowdb-s3')

const adapter = new S3({ bucket: 'bucket', key: 'db.json' })
const db = await low(adapter)
```

You can pass S3 options

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
