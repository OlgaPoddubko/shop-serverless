'use strict';
import { products } from './data';

const getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: products,
  };
};

const getProductsById = async (event) => {
    const productId = event.pathParameters?.id;
    return {
        statusCode: 200,
        body: products.find((product) => productId === product.id),
    };
};

module.exports = { getProductsById, getProductsList }
