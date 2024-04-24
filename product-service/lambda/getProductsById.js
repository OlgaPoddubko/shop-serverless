const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.getProductsById = async (event) => {
    try {
        const productId = event.pathParameters.id;

        const params = {
            TableName: 'products',
            Key: {
                id: productId
            },
            ProjectionExpression: 'id, title, description, price',
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

        const stockParams = {
            TableName: process.env.STOCK_TABLE_NAME,
            Key: {
                product_id: productId,
            },
            ProjectionExpression: 'product_id, amount',
        };
        const stockData = await dynamodb.get(stockParams).promise();

        const productItem =  {
            ...data.Item,
            amount: stockData.Item ? stockData.Item.amount : 0
        };

        return {
            statusCode: 200,
            body: JSON.stringify(productItem),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*',
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
