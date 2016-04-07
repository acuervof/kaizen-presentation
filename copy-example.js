'use strict';

let aws = require('aws-sdk');
let s3 = new aws.S3();

exports.handler = (event, context, callback) => {

    // Get the object from the event and show its content type
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    
    const dstBucket = 'id.kaizen.dest';
    const dstKey = 'copy-' + srcKey;
    
    s3.copyObject({
        Bucket: dstBucket,
        Key: dstKey,
        CopySource: srcBucket +'/'+ srcKey
    }, function(err, data) {
      if (err) {
          callback('Error when copying ' + err.message);
      } else {
          callback();
      }
    });
};
