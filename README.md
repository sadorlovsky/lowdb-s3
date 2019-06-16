# lowdb-s3

> Lowdb AWS S3 Adapter

## Usage

```bash
npm install lowdb-s3
```

```js
const low = require('lowdb')
const S3 = require('lowdb-s3')

const adapter = new S3({ bucket: 'bucket', key: 'db.json' })
const db = await low(adapter)
```

## License

MIT
