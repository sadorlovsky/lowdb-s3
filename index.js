const Base = require('lowdb/adapters/Base')
const AWS = require('aws-sdk')

class S3Adapter extends Base {
  constructor (source = {}, S3Options = {}) {
    super(source)
    const defaultS3Options = {
      region: 'us-east-1',
      signatureVersion: 'v4',
      s3ForcePathStyle: true
    }
    S3Options.endpoint = new AWS.Endpoint(S3Options.endpoint)
    this.s3 = new AWS.S3(Object.assign({}, defaultS3Options, S3Options))
  }

  async read () {
    const isBucketExists = await this.s3.headBucket({
      Bucket: this.source.bucket
    }).promise()

    if (!isBucketExists) {
      throw new Error('no bucket')
    }

    try {
      const data = await this.s3.getObject({
        Bucket: this.source.bucket,
        Key: this.source.key
      }).promise()
      return this.deserialize(data.Body.toString())
    } catch (err) {
      if (err.code === 'NoSuchKey') {
        await this.s3.upload({
          Bucket: this.source.bucket,
          Key: this.source.key,
          Body: this.serialize(this.defaultValue)
        }).promise()

        return this.defaultValue
      }
      throw err
    }
  }

  async write (data) {
    return this.s3.upload({
      Bucket: this.source.bucket,
      Key: this.source.key,
      Body: this.serialize(data)
    }).promise()
  }
}

module.exports = S3Adapter
