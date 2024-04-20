const AWS = require('aws-sdk');
const { stock }  = require('../data');

AWS.config.update({ region: 'eu-west-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function insertStockData() {
    const params = {
        RequestItems: {
            'stock': stock.map(item => ({
                PutRequest: {
                    Item: item
                }
            }))
        }
    };

    try {
        await dynamodb.batchWrite(params).promise();
        console.log('Stock data inserted successfully.');
    } catch (error) {
        console.error('Error inserting stock data:', error);
    }
}

insertStockData();
