module.exports = ({ env }) => ({
  upload: {
    provider: "s3-plus",
    providerOptions: {
      accessKeyId: env("AWS_ACCESS_KEY_ID"),
      secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
      region: env("AWS_REGION"),
      endpoint: env("AWS_S3_ENDPOINT"),
      params: {
        Bucket: env("AWS_S3_BUCKET_NAME"),
        ACL: "public-read",
        // folder: 'myapp/images',
      },
      s3ForcePathStyle: true, //needed for localstack s3 to work correctly
    },
  },
});
