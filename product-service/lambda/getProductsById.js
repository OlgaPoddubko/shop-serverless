'use strict';

const { products } = require('../data');

const getProductsById = async (event) => {
    const productId = event.pathParameters?.id;
    const result = products.find((product) => productId == product.id)

    if (!result) {
        return {
            statusCode: 404,
            body: "No such product",
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers:{ 'Access-Control-Allow-Origin' : '*' },
    };
};

module.exports = { getProductsById };
