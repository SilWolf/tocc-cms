module.exports = ({ env }) => ({
  upload: {
    provider: "aws-s3",
    providerOptions: {
      accessKeyId: env("AWS_ACCESS_KEY_ID"),
      secretAccessKey: env("AWS_ACCESS_SECRET"),
      region: env("AWS_S3_REGION"),
      params: {
        Bucket: env("AWS_S3_BUCKET"),
      },
    },
  },
  email: {
    provider: "sendmail",
    settings: {
      defaultFrom: "dnd5etocc@gmail.com",
      defaultReplyTo: "dnd5etocc@gmail.com",
    },
  },
});
