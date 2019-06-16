const test = require('ava')
const lowdb = require('lowdb')
const { S3, Endpoint } = require('aws-sdk')
const S3Adapter = require('.')

const minio = {
  accessKeyId: 'minio',
  secretAccessKey: 'miniosecret',
  endpoint: new Endpoint('http://localhost:9000')
}

const bucket = 'hardcode'
const key = 'db.json'

const s3 = new S3({
  region: 'us-east-1',
  signatureVersion: 'v4',
  s3ForcePathStyle: true,
  ...minio
})

const clear = () => s3.deleteObject({
  Bucket: bucket,
  Key: key
}).promise()

test.before(clear)
test.beforeEach(clear)
test.after(clear)

test('default values', async t => {
  const adapter = new S3Adapter({ bucket, key }, minio)
  const db = await lowdb(adapter)

  const defaultData = { chats: [{ id: 1, title: 'one' }] }
  await db.defaults(defaultData).write()

  const data = await db.getState()
  t.deepEqual(data, defaultData)
})

test('read', async t => {
  const adapter = new S3Adapter({ bucket, key }, minio)
  const db = await lowdb(adapter)

  const defaultData = { chats: [{ id: 2, title: 'two' }] }
  await db.defaults(defaultData).write()

  const data = await db.get('chats').find({ id: 2 }).value()
  const expected = { id: 2, title: 'two' }
  t.deepEqual(data, expected)
})

test('write', async t => {
  const adapter = new S3Adapter({ bucket, key }, minio)
  const db = await lowdb(adapter)

  const defaultData = { chats: [] }
  await db.defaults(defaultData).write()
  await db.get('chats').push({ id: 3, title: 'three' }).write()

  const data = await db.getState()
  const expected = { chats: [{ id: 3, title: 'three' }] }
  t.deepEqual(data, expected)
})
