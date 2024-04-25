const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.getProductsList = async (event) => {
    try {
        const params = {
            TableName: process.env.PRODUCTS_TABLE_NAME,
            ProjectionExpression: 'id, title, description, price',
        };
        const productData = await dynamodb.scan(params).promise();

        if (productData.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No products found' }),
                headers: {
                    'Access-Control-Allow-Origin' : '*',
                    'Content-Type': 'application/json',
                },
            };
        }

        const productsWithStock = await Promise.all(productData.Items.map(async (product) => {
            const stockParams = {
                TableName: process.env.STOCK_TABLE_NAME,
                Key: {
                    product_id: product.id
                },
            };
            const stockData = await dynamodb.get(stockParams).promise();

            return {
                ...product,
                amount: stockData.Item ? stockData.Item.amount : 0
            };
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(productsWithStock),
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

