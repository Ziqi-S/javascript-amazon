import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
//import '../data/cart-oop.js';
//import '../data/cart-class.js';
//import '../data/backend-practice.js'

/*
- better way to handle asynchronous code
- let us wait for some code to finish before going to the next step
- runs the inner function immediatly
- resolve is a function
    - let us control when to go the the next step
*/
new Promise((resolve) => {
    loadProducts(() => {
        resolve('resolve can pass values to the next step');
    });
}).then((value) => {//next step after loadProducts()
    console.log(value)
    
    renderOrderSummary();
    renderPaymentSummary();
})