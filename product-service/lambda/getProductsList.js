'use strict';

const { products } = require('../data');

const getProductsList = async (event) => {
    console.log(`products: ${products}`);
    return {
        statusCode: 200,
        body: JSON.stringify(products),
        headers:{ 'Access-Control-Allow-Origin' : '*' },
    };
};

module.exports = { getProductsList };
