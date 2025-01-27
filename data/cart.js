//export: cart can be used outside of cart.js
export const cart = [];

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
        quantity: 1
      })
    }
  };