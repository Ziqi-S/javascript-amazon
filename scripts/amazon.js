let productsHTML = '';

products.forEach((product) => {
    
  //accumulator pattern
  productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
              ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${(product.priceCents / 100).toFixed(2)}
          <!--.toFixed(2): 保留两位小数-->
        </div>

        <div class="product-quantity-container">
          <select>
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart added-to-cart-${product.id}">
        <!--想要在点击加入购物车时动态显示Added，用added-to-cart-${product.id}来定位是哪一个button-->
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary"
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
  `   
});

document.querySelector('.products-grid').innerHTML = productsHTML;

document.querySelectorAll('.add-to-cart-button')
  .forEach((button) => {
    let addedMessageTimeOutId;//存储timeoutID

    button.addEventListener('click', () => {
      /*
        How do we know which product to add?
        - Data Attribute
          - is just another HTML attribute
          - have to start with "data-"
          - then give it any name
          - allows us to attach any information to an element
      */
      const productId = button.dataset.productId;//be sure to change product-name to productName

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

      let cartQuantity = 0;
      cart.forEach((item) => {
        cartQuantity += item.quantity;
      })

      document.querySelector('.cart-quantity').innerHTML = cartQuantity;

      //---------------------show Added message---------------------//
      const addMessage = document.querySelector(`.added-to-cart-${productId}`);

      //在点击加入购物车时增加一个class,用来控制Added的显示
      addMessage.classList.add('added-to-cart-visible');

      //如果连续点击加入购物车，第二次显示的Added可能还没到两秒就消失了
      //用clearTimeout()来清除上次的timeout计时
      /*
        Each time we run the loop, it will create
        a new variable called addedMessageTimeoutId and do
        button.addEventListener().
        
        Then, because of closure, the function we give to
        button.addEventListener() will get a unique copy
        of the addedMessageTimeoutId variable and it will
        keep this copy of the variable forever.
        (Reminder: closure = if a function has access to a
        value/variable, it will always have access to that
        value/variable).
        
        This allows us to create many unique copies of the
        addedMessageTimeoutId variable (one for every time
        we run the loop) so it lets us keep track of many
        timeoutIds (one for each product).
      */
      if(addedMessageTimeOutId){
        clearTimeout(addedMessageTimeOutId);
      }

      const timeOutId = setTimeout(() => {
        addMessage.classList.remove('added-to-cart-visible'); 
      }, 2000); 

      addedMessageTimeOutId = timeOutId;
    });
  });

