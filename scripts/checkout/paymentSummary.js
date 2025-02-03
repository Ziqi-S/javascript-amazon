import { cart, updateCartQuantity} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js'
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary(){
    let productPriceCents = 0;
    let deliveryCostCents = 0;
    let quantity = 0;

    cart.forEach(item => {
        const product = getProduct(item.productId);
        productPriceCents += product.priceCents * item.quantity; 

        const optionId = getDeliveryOption(item).id
        deliveryCostCents += deliveryOptions.find(option => option.id === optionId)
                                        .priceCents
        quantity = quantity + item.quantity;
    });

    const totalBeforeTaxCents = productPriceCents + deliveryCostCents;
    const taxCostCents = totalBeforeTaxCents * 0.1
    const totalAfterTaxCents = totalBeforeTaxCents + taxCostCents;

    const paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
        </div>
    
        <div class="payment-summary-row">
            <div>Items (${updateCartQuantity()}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
        </div>
    
        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(deliveryCostCents)}</div>
        </div>
    
        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
        </div>
    
        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCostCents)}</div>
        </div>
    
        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalAfterTaxCents)}</div>
        </div>
    
        <button class="place-order-button button-primary">
            Place your order
        </button>
    `;

    document.querySelector('.payment-summary').innerHTML = paymentSummaryHTML

    document.querySelector('.place-order-button')
    .addEventListener('click', async () => {
        try{
            const response = await fetch('https://supersimplebackend.dev/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cart: cart
                })
            })
            const order = await response.json();//give us the data attached to the response, should be the order created by backend
            addOrder(order);
        }catch(error){
            console.log('Unexpected Error!!')
        }

        //control the url. Jump to another website
        window.location.href = 'orders.html';
    })
}