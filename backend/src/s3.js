import config from 'config';
import AWS from 'aws-sdk';
import path from 'path';
import fs from 'fs';

const awsConfig = config.get('aws');
const bucket = awsConfig.bucket;
export const s3 = new AWS.S3(awsConfig.credentials);

export const getSignedUrl = (key) => (
  new Promise((resolve, revoke) => {
    if (!key) {
      resolve();
      return;
    }
    s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: 604800, // 1-week expiration
    }, (error, url) => {
      if (error) revoke(error);
      resolve(url);
    });
  })
);

export const deleteFile = (key) => (
  new Promise((resolve, revoke) => {
    if (!key) {
      resolve();
      return;
    }
    s3.deleteObject({
      Bucket: bucket,
      Key: key,
    }, (error) => {
      if (error) revoke(error);
      else resolve();
    });
  })
);

const defaultPutConfig = {
  CacheControl: 'public, max-age=31536000', // cache for 1 year
  ContentType: 'image/jpeg',
};
export const uploadFile = (localFile, pConfig = {}, remove = true) => (
  new Promise((resolve, revoke) => {
    const mergedConfig = { ...defaultPutConfig, ...pConfig };

    // combine the time and the filename to get a unique key
    const key = `${Date.now()}-${path.basename(localFile)}`;

    fs.readFile(localFile, (error, stream) => {
      if (error) {
        revoke(error);
        return;
      }

      s3.putObject({
        ...mergedConfig,
        Bucket: bucket,
        Key: key,
        ACL: 'private',
        Body: stream,
      }, (putError) => {
        if (putError) {
          revoke(putError);
          return;
        }
        resolve(key);
      });
    });
  }).then(key => {
    if (!remove) return key;

    return new Promise((resolve, revoke) => {
      fs.unlink(localFile, error => {
        if (error) {
          revoke(error);
          return;
        }
        resolve(key);
      });
    });
  })
);
