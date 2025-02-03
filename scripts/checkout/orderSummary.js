import { cart, removeFromCart, updateCartQuantity, updateQuantity, updateDeliveryOption} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js'
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { calculateDate } from "../utils/date.js"
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary(){
  document.querySelector('.checkout-quantity').innerHTML = updateCartQuantity() + ' items';
  let cartItemHTML = '';
  cart.forEach((item) => {
    let productId = item.productId;
    const matchingProduct = getProduct(productId);
    console.log(matchingProduct)
    const deliveryOption = getDeliveryOption(item);
    
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    cartItemHTML += `
      <div class="cart-item-container cart-item-container-${matchingProduct.id}">
        <div class="delivery-date delivery-date-${matchingProduct.id}">
          Delivery Date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
            ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label quantity-label-${matchingProduct.id}">${item.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary" data-product-id=${matchingProduct.id}>
                Update
              </span>
              <input class="quantity-input quantity-input-${matchingProduct.id}">
              <span class="save-quantity-link link-primary" data-product-id=${matchingProduct.id}>Save</span>
              <span class="delete-quantity-link link-primary" data-product-id=${matchingProduct.id}>
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, item)}
          </div>
        </div>
      </div>
    `;
  })

  function deliveryOptionsHTML(matchingProduct, cartItem){
    let deliveryHTML = '';
    deliveryOptions.forEach((option) => {
      const dateString = calculateDate(option.id)

      const priceString = option.priceCents 
                                    === 0
                                    ? 'FREE Shipping'
                                    : `$${formatCurrency(option.priceCents)} - Shipping`;

      const isChecked = option.id === cartItem.deliveryOptionId;
      deliveryHTML += `<div class="delivery-option"
                          data-option-id=${option.id}
                          data-product-id=${matchingProduct.id}
                        >
                        <input type="radio"
                          ${isChecked ? 'checked' : ''}
                          class="delivery-option-input"
                          name="delivery-option-${matchingProduct.id}">
                        <div>
                          <div class="delivery-option-date">
                            ${dateString}
                          </div>
                          <div class="delivery-option-price">
                            ${priceString}
                          </div>
                        </div>
                      </div>
                      `
    })
    return deliveryHTML;
  } 

  document.querySelector('.order-summary').innerHTML = cartItemHTML;

  document.querySelectorAll('.delete-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        //console.log(link.dataset)
        const productId = link.dataset.productId;
        removeFromCart(productId);
        renderOrderSummary();
        //--Update Checkout Quantity--//
        document.querySelector('.checkout-quantity').innerHTML = updateCartQuantity() + ' items';
        //--Update Payment--//
        renderPaymentSummary();
      })
    })

  //---------------------------Update Quantity Interactivly---------------------------//
  document.querySelectorAll('.update-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        document.querySelector(`.cart-item-container-${productId}`).classList.add('is-editing-quantity');
      })
    })

  document.querySelectorAll('.save-quantity-link')
  .forEach((link) => {
    const productId = link.dataset.productId;
    const quantityInput = document.querySelector(`.quantity-input-${productId}`);

    //Click event
    link.addEventListener('click', () => {
      
      document.querySelector(`.cart-item-container-${productId}`).classList.remove('is-editing-quantity');

      const newQuantity = Number(document.querySelector(`.quantity-input-${productId}`).value);
      
      //check validation
      if(newQuantity <= 0){
        alert('Please enter a valid quantity number');
        return;
      }

      updateQuantity(productId, newQuantity);

      document.querySelector(`.quantity-label-${productId}`).innerHTML = newQuantity;
      document.querySelector('.checkout-quantity').innerHTML = updateCartQuantity() + ' items';
      renderPaymentSummary();
    });

    //Keydown event
    quantityInput.addEventListener('keydown', (event) => {
      if(event.key === 'Enter'){
        link.click();
      }
    });
  })

  /*
  可行，但是未来在我们更改运输选项的时候，不仅显示的送达时间要变，价格也要变，
  按这种写法的话就需要一个一个改，未来如果业务变复杂，会造成更多麻烦
  解决办法：直接重新加载所有HTML
  //在 DOMContentLoaded 事件后再运行：
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delivery-option-input')
      .forEach((option) => {
        option.addEventListener('change', () => {
          //const productId = option.dataset.productId;
          //const optionId = option.dataset.optionId;
          const {productId, optionId} = option.dataset;
          const dateString = calculateDate(optionId);
          updateDeliveryOption(productId, optionId)
          document.querySelector(`.delivery-date-${productId}`).innerHTML = `Delivery Date: ${dateString}`
        })
      }) 
  });
  */

  document.querySelectorAll('.delivery-option')
      .forEach((option) => {
        option.addEventListener('click', () => {
          const {productId, optionId} = option.dataset;
          updateDeliveryOption(productId, optionId);
          renderOrderSummary();
          renderPaymentSummary();
        })
      })
}

