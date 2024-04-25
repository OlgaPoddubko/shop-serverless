const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.createProduct = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);

        const params = {
            TableName: 'products',
            Item: {
                id: requestBody.id,
                title: requestBody.title,
                description: requestBody.description,
                price: requestBody.price,
            },
            ConditionExpression: 'attribute_not_exists(id)',
        };

        await dynamodb.put(params).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Product created successfully' }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Error creating product:', error);

        if (error.code === 'ConditionalCheckFailedException') {
            return {
                statusCode: 409,
                body: JSON.stringify({ message: 'Product with the provided ID already exists' }),
                headers: {
                    'Content-Type': 'application/json',
                },
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};
