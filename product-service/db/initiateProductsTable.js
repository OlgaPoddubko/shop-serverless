const AWS = require('aws-sdk');
const { products }  = require('../data');

AWS.config.update({ region: 'eu-west-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function insertProductsData() {
    const params = {
        RequestItems: {
            'products': products.map(product => ({
                PutRequest: {
                    Item: product
                }
            }))
        }
    };

    try {
        await dynamodb.batchWrite(params).promise();
        console.log('Products data inserted successfully.');
    } catch (error) {
        console.error('Error inserting products data:', error);
    }
}

insertProductsData();
