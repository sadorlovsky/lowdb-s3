const fs = require('fs')
const test = require('ava')
const lowdb = require('lowdb')
const AWSMock = require('aws-sdk-mock')
const S3Adapter = require('.')

const bucket = 'bucketName'
const key = 'db.json'
const tmp = `/tmp/${key}`

test.before(async t => {
  fs.writeFileSync(tmp, '{}')
  AWSMock.mock('S3', 'headBucket', true)
  AWSMock.mock('S3', 'getObject', { Body: Buffer.from(fs.readFileSync(tmp)) })
  AWSMock.mock('S3', 'upload', (params, cb) => {
    fs.writeFileSync(tmp, params.Body)
    return cb()
  })
})

test.beforeEach(t => {
  fs.writeFileSync(tmp, '{}')
})

test('default values', async t => {
  const adapter = new S3Adapter({ bucket, key })
  const db = await lowdb(adapter)

  const defaultData = { chats: [{ id: 1, title: 'one' }] }
  await db.defaults(defaultData).write()

  const data = await db.getState()
  t.deepEqual(data, defaultData)
})

test('read', async t => {
  const adapter = new S3Adapter({ bucket, key })
  const db = await lowdb(adapter)

  const defaultData = { chats: [{ id: 2, title: 'two' }] }
  await db.defaults(defaultData).write()

  const data = await db.get('chats').find({ id: 2 }).value()
  const expected = { id: 2, title: 'two' }
  t.deepEqual(data, expected)
})

test('write', async t => {
  const adapter = new S3Adapter({ bucket, key })
  const db = await lowdb(adapter)

  const defaultData = { chats: [] }
  await db.defaults(defaultData).write()
  await db.get('chats').push({ id: 3, title: 'three' }).write()

  const data = await db.getState()
  const expected = { chats: [{ id: 3, title: 'three' }] }
  t.deepEqual(data, expected)
})

test('no bucket', async t => {
  AWSMock.restore('S3')
  AWSMock.mock('S3', 'headBucket', null)

  await t.throwsAsync(async () => {
    const adapter = new S3Adapter({ bucket, key })
    const db = await lowdb(adapter)

    const defaultData = { chats: [] }
    await db.defaults(defaultData).write()
  }, { message: 'no bucket' })

  AWSMock.restore('S3')
})
