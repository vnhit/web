// cart page
function renderCartPage(){
    const cartListElement = document.getElementById('cart-item-list');
    const cartTotalElement = document.getElementById('summary-subtotal');
    if(!cartListElement) return;
    let cart = JSON.parse(localStorage.getItem('kicks_cart')) || [];
    if(cart.length ===0){
        cartListElement.innerHTML='<p class="cart-empty-msg">Giỏ hàng trống</p>';
        if(cartTotalElement){
            cartTotalElement.textContent = '$0.00';
        }
        return;
    }
    let cartHTML ='';
    let totalPrice = 0;
    cart.forEach(item =>{
        totalPrice += (item.price * item.quantity);

        cartHTML +=`
            <div class="cart-item">
                <div class="cart-item-images">
                    <img src="${item.images}" alt="${item.title}">
                </div>
            <div class="cart-item-info">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price"> Giá: $${item.price.toFixed(2)}</p>
                <div class="cart-action-group">
                    <div class="qty-controls">
                        <button class="btn-qty btn-minus" data-id="${item.id}">-</button>
                        <span class="cart-item-quantity"> Số lượng: ${item.quantity}</span>
                        <button class="btn-qty btn-plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="btn-remove" data-id="${item.id}">Xóa 🗑️</button>
                </div>
            </div>
            <div class="cart-item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            </div>
        `;     
    });
    cartListElement.innerHTML = cartHTML;
    if(cartTotalElement){
        cartTotalElement.textContent = '$' + totalPrice.toFixed(2);
    }
    document.querySelectorAll('.btn-plus').forEach(btn =>{
        btn.addEventListener('click',(e) =>{
            const id = e.target.getAttribute('data-id');
            updateCartQuantity(id,1);
        });
    });
    document.querySelectorAll('.btn-minus').forEach(btn =>{
        btn.addEventListener('click',(e) =>{
            const id = e.target.getAttribute('data-id');
            updateCartQuantity(id,-1);
        });
    });
    document.querySelectorAll('.btn-remove').forEach(btn =>{
        btn.addEventListener('click',(e) =>{
            const id = e.target.getAttribute('data-id');
            removeCartItem(id);
        });
    });
}
// update cart quantity
function updateCartQuantity(id,change){
    let cart = JSON.parse(localStorage.getItem('kicks_cart')) || [];
    const index = cart.findIndex(item => item.id == id);
    if(index != -1){
        cart[index].quantity += change;
        if(cart[index].quantity <= 0){
            cart.splice(index,1);
        }
        localStorage.setItem('kicks_cart',JSON.stringify(cart));

        renderCartPage();
    }
    
}
// remove 
function removeCartItem(id){
    let cart = JSON.parse(localStorage.getItem('kicks_cart')) || [];
    cart = cart.filter(item => item.id != id);
    localStorage.setItem('kicks_cart',JSON.stringify(cart));
    renderCartPage();
}