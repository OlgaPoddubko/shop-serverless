'use strict';

const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.getProductsById = async (event) => {
    try {
        const productId = event.pathParameters.productId;

        const params = {
            TableName: 'products',
            Key: {
                id: productId
            },
            ProjectionExpression: 'id, title, description, price, #s.count',
            ExpressionAttributeNames: { '#s': 'stock' },
        };

        const data = await dynamodb.get(params).promise();

        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Product not found' }),
                headers: {
                    'Access-Control-Allow-Origin' : '*',
                    'Content-Type': 'application/json',

                },
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data.Item),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Error fetching product:', error);
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
