'use strict';

let aws = require('aws-sdk');
let s3 = new aws.S3();
let elTr = new aws.ElasticTranscoder();

let videoRegExp = /^(.+)\.(flv|FLV|mpeg|MPEG|mp4|MP4|mpg|MPG|avi|AVI|mov|MOV|wmv|WMW|rm|RM|m2t|M2T|3gp|3GP)$/;

exports.handler = (event, context, callback) => {
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); 
    
    let match = srcKey.match(videoRegExp);
    if (match === null) {
        callback('Invalid format for key ' + this.s3Event.key);
    }   
    let newKey = match[1]; 
    
    s3.headObject({Bucket: srcBucket, Key: srcKey}, function(err, object) {
        if (err) {
            callback('Error getting object ' + srcKey + ' from bucket ' + srcBucket + ': ' + err.message);
        } else {
            var params = {
                PipelineId: '1460064193086-oaxz7f',
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
                    ThumbnailPattern: '{count}-' + newKey,
                    PresetId: '1460064928126-si3iuw',
                    Rotate: 'auto'
                }]
            };
            elTr.createJob(params, function (err, data) {
                if (err) {
                    callback('Error creating ElasticTranscoder job for object ' + srcKey + ' from bucket ' + srcBucket + ': ' + err.message);
                } else {
                    callback();
                }
            });
        }
    });
};