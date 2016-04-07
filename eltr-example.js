'use strict';

let aws = require('aws-sdk');
let s3 = new aws.S3();
let elTr = new aws.ElasticTranscoder();

exports.handler = (event, context, callback) => {
	const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); 

 	s3.headObject(srcBucket, srcKey, function(err, object) {
        if (err) {
            callback(err, 'Error getting object ' + srcKey + ' from bucket ' + srcBucket + ': ' + err.message);
        } else {
            var params = {
                PipelineId: 1,
                Input: {
                	Key: srcKey,
                	FrameRate: 'auto',
                	Resolution: 'auto',
                	AspectRatio: 'auto',
                	Interlaced: 'auto',
                	Container: 'auto'
                },
                Outputs: [{
                    Key: srcKey,
                    ThumbnailPattern: '{count}-' + srcKey,
                    PresetId: 1,
                    Rotate: 'auto'
                }]
            }
            elTr.createJob(params, function (err, data) {
      	        if (err) {
      		        callback('Error creating ElasticTranscoder job for object ' + srcKey + ' from bucket ' + srcBucket + ': ' + err.message);
          	    } else {
                    callback();
          	    }
            });
  	    }
    });
}
