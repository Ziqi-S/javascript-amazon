//export: cart can be used outside of cart.js
export let cart = JSON.parse(localStorage.getItem('cart'));

//default cart
if(!cart){
  cart=[{
    productId: '',
    quantity: 0,
    deliveryOptionId: '2'
  }]
}

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId){
    let matchingItem;
    cart.forEach((item) => {
      if(productId === item.productId){
        item.quantity += 1;
        matchingItem = item;
      }
    });
  
    if(!matchingItem){
      cart.push({
        productId: productId,
        quantity: 1,
        deliveryOptionId: '2'
      })
    }
    saveToStorage();
  };

export function removeFromCart(productId){
  const newCart = [];

  cart.forEach((cartItem) => {
    if(cartItem.productId !== productId){
      newCart.push(cartItem)
    }
  });

  cart = newCart;
  saveToStorage();
}

export function updateCartQuantity(){
  let cartQuantity =  0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  })

  return cartQuantity;
}

export function updateQuantity(productId,newQuantity){
  let product = cart.find(item => item.productId === productId);
  product.quantity = newQuantity;
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem;

  cart.forEach((item) => {
    if(productId === item.productId){
      matchingItem = item;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}