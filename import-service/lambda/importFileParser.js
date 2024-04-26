const AWS = require('aws-sdk');
const csvParser = require('csv-parser');

exports.importFileParser = async (event, context) => {
    const s3 = new AWS.S3();

    for (const record of event.Records) {
        const key = record.s3.object.key;

        try {
            const params = {
                Bucket: record.s3.bucket.name,
                Key: key
            };

            const s3Stream = s3.getObject(params).createReadStream();

            s3Stream.pipe(csvParser())
                .on('data', (data) => {
                    console.log('Parsed CSV record:', data);
                })
                .on('error', (error) => {
                    console.error('Error parsing CSV:', error);
                });
        } catch (error) {
            console.error('Error processing S3 object:', error);
        }
    }
};