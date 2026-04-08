function initCheckoutPage() {
    const cart = JSON.parse(localStorage.getItem('kicks_cart')) || [];
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống! Hãy mua sắm thêm trước khi thanh toán.");
        window.location.href = 'products.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('kicks_logged_in_user'));
    if (user) {
        if(document.getElementById('co-name')) document.getElementById('co-name').value = user.fullName || '';
        if(document.getElementById('co-email')) document.getElementById('co-email').value = user.email || '';
        if(document.getElementById('co-phone')) document.getElementById('co-phone').value = user.phone || '';
        if(document.getElementById('co-address')) document.getElementById('co-address').value = user.address || '';
    }

    const itemListEl = document.getElementById('checkout-item-list');
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        html += `
        <div class="co-item-mini">
            <div class="co-item-img">
                <img src="${item.images}" alt="${item.title}">
            </div>
            <div class="co-item-info">
                <span class="co-item-title">${item.title}</span>
                <span class="text-gray label-sm">QTY: ${item.quantity}</span>
            </div>
            <div class="font-bold">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
        `;
    });
    
    if(itemListEl) itemListEl.innerHTML = html;
    if(document.getElementById('co-subtotal')) document.getElementById('co-subtotal').textContent = '$' + total.toFixed(2);
    if(document.getElementById('co-total')) document.getElementById('co-total').textContent = '$' + total.toFixed(2);

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const randomId = Math.floor(Math.random() * 90000 + 10000);
            
            const newOrder = {
                id: 'ORD-' + randomId,
                date: new Date().toLocaleDateString('vi-VN'),
                items: cart,
                total: total,
                status: 'ĐANG XỬ LÝ',
            };

            let orders = JSON.parse(localStorage.getItem('kicks_orders')) || [];
            
            orders.unshift(newOrder); 
            
            localStorage.setItem('kicks_orders', JSON.stringify(orders));
            localStorage.removeItem('kicks_cart');
            if (typeof updateCartBadge === 'function') updateCartBadge();
            alert('🎉 ĐẶT HÀNG THÀNH CÔNG! Mã đơn hàng của bạn là: ' + newOrder.id);
            window.location.href = 'user-profile.html';
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadLayout === 'function') loadLayout();
    initCheckoutPage();
});