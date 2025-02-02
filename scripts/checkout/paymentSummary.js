import { cart, removeFromCart, updateCartQuantity, updateQuantity, updateDeliveryOption} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js'
import { formatCurrency } from "../utils/money.js";

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
}