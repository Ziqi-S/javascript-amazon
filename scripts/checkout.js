import { cart, removeFromCart, updateCartQuantity, updateQuantity, updateDeliveryOption} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { deliveryOptions } from '../data/deliveryOptions.js'
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { calculateDate } from "./utils/date.js"

document.querySelector('.checkout-quantity').innerHTML = updateCartQuantity() + ' items';

let cartItemHTML = '';

cart.forEach((item) => {
  let productId = item.productId;
  let matchingProduct = products
    //filter返回的是一个数组，即使只有一个匹配项, 这会导致找不到数据源。要直接获取匹配的对象，需要从数组中取第一项
    //.filter(product => product.id === itemId);
    .find(product => product.id === productId)

  cartItemHTML += `
    <div class="cart-item-container cart-item-container-${matchingProduct.id}">
      <div class="delivery-date delivery-date-${matchingProduct.id}">
        Delivery Date: ${dayjs().add(1, 'days').format('dddd, MMMM D')}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
          ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
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
          ${deliveryOptionsHTML(matchingProduct)}
        </div>
      </div>
    </div>
  `;
})

function deliveryOptionsHTML(matchingProduct){
  let deliveryHTML = '';
  deliveryOptions.forEach((option) => {
    const dateString = calculateDate(option.id)

    const priceString = option.priceCents 
                                  === 0
                                  ? 'FREE Shipping'
                                  : `$${formatCurrency(option.priceCents)} - Shipping`;

    deliveryHTML += `<div class="delivery-option">
                      <input type="radio"
                        checked
                        class="delivery-option-input"
                        data-option-id=${option.id}
                        data-product-id=${matchingProduct.id}
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

document.querySelector('.order-summary').innerHTML = cartItemHTML;

document.querySelectorAll('.delete-quantity-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      //console.log(link.dataset)
      const productId = link.dataset.productId;
      removeFromCart(productId);
      document.querySelector(`.cart-item-container-${productId}`).remove();
      //---------------------------Update Checkout Quantity---------------------------//
      document.querySelector('.checkout-quantity').innerHTML = updateCartQuantity() + ' items';
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
  });

  //Keydown event
  quantityInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
      link.click();
    }
  });
})