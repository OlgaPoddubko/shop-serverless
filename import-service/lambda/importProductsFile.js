const AWS = require('aws-sdk');

exports.importProductsFile = async (event) => {
    try {
        const { name } = event.queryStringParameters;
        const key = `uploaded/${name}`;
        const s3 = new AWS.S3();

        const signedUrl = await s3.getSignedUrlPromise('putObject', {
            Bucket: 'import-service-gt', // process.env.BUCKET_NAME,
            Key: key,
            Expires: 300,
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ signedUrl }),
        };
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate signed URL' }),
        };
    }
};