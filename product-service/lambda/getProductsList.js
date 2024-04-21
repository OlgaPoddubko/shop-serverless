'use strict';

const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.getProductsList = async (event) => {
    try {
        const params = {
            TableName: 'products',
            ProjectionExpression: 'id, title, description, price, #s.count',
            ExpressionAttributeNames: { '#s': 'stock' },
            KeyConditionExpression: 'id = #s.product_id',
        };

        const data = await dynamodb.query(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Content-Type': 'application/json',
            },
        };
    }
};

