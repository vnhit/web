function initProfileTabs(){
    const menuItems = document.querySelectorAll('.menu-item');
    const tabContents = document.querySelectorAll('.tab-content');

    if(menuItems.length === 0) return;
    menuItems.forEach(item =>{
        item.addEventListener('click',() =>{
            menuItems.forEach(btn => btn.classList.remove('active'));
            item.classList.add('active');
            tabContents.forEach(tab => tab.style.display = 'none');
            const targetId = item.getAttribute('data-target');
            const targetTab = document.getElementById(targetId);
            if(targetTab){
                targetTab.style.display = 'block';
            }
            
            // Nếu bấm vào Tab Order History thì load lại data đơn hàng
            if(targetId === 'tab-orders') {
                renderProfileOrders();
            }
        });       
    });
}

function renderUserProfile(){
    const userInfoContainer = document.getElementById('user-info-container');
    if(!userInfoContainer) return;
    let user = JSON.parse(localStorage.getItem('kicks_logged_in_user'));
    if(!user){
        alert('Bạn cần đăng nhập');
        window.location.href = 'auth.html?tab=login';
        return;
    }
    
    // 1. Render cục Avatar bên trái
    const firstLetter = user.fullName.charAt(0).toUpperCase();
    userInfoContainer.innerHTML=`
        <div class="user-avatar">${firstLetter}</div>
        <div class="user-name-box">
            <h3 class="headline-sm">${user.fullName}</h3>
            <p class="label-sm text-gray">${user.tier || "NEW MEMBER"}</p>
            <p class="label-sm text-gray">${user.email}</p>
        </div>
    `;

    // 2. Render Dashboard Box
    const dashboardContainer = document.getElementById('dashboard-container');
    if(dashboardContainer) {
        dashboardContainer.innerHTML = `
            <div class="dashboard-overview-box">
                <h3 class="headline-sm dashboard-greeting">XIN CHÀO, ${user.fullName.toUpperCase()}!</h3>
                <p class="body-md text-gray dashboard-info">Email: <strong>${user.email}</strong></p>
                <p class="body-md text-gray dashboard-info">Hạng thành viên: <strong>${user.tier || 'NEW MEMBER'}</strong></p>
                <p class="body-md text-gray dashboard-info">Ngày tham gia: <strong>Gần đây</strong></p>
            </div>
        `;
    }

    // 3. Đổ dữ liệu vào Form Settings (Tên, SĐT, Email, Địa chỉ)
    const nameInput = document.getElementById('user-name');
    if(nameInput) {
        document.getElementById('user-name').value = user.fullName || '';
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-phone').value = user.phone || '';
        document.getElementById('user-address').value = user.address || '';
        document.getElementById('user-password').value = ''; // Để trống pass

        // Lắng nghe nút LƯU THAY ĐỔI
        const btnSave = document.querySelector('#tab-profile .btn-primary');
        btnSave.onclick = function() {
            const newName = document.getElementById('user-name').value;
            const newPhone = document.getElementById('user-phone').value;
            const newAddress = document.getElementById('user-address').value;
            const newPass = document.getElementById('user-password').value;

            // Cập nhật Local Storage
            user.fullName = newName;
            user.phone = newPhone;
            user.address = newAddress;
            if(newPass.trim() !== '') {
                user.password = newPass; // Chỉ đổi pass nếu người dùng nhập cái mới
            }

            localStorage.setItem('kicks_logged_in_user', JSON.stringify(user));

            let usersList = JSON.parse(localStorage.getItem('kicks_user_list')) || [];
            const userIndex = usersList.findIndex(u => u.email === user.email);
            if(userIndex !== -1) {
                usersList[userIndex].fullName = user.fullName;
                usersList[userIndex].phone = user.phone;
                usersList[userIndex].address = user.address;
                if(newPass.trim() !== '') usersList[userIndex].password = user.password;
                localStorage.setItem('kicks_user_list', JSON.stringify(usersList));
            }

            alert("✅ Cập nhật thông tin thành công!");
            window.location.reload();
        };
    }
}

// HÀM RENDER ĐƠN HÀNG ĐỘNG
function renderProfileOrders() {
    const container = document.querySelector('.order-list-container'); 
    if (!container) return;

    let user = JSON.parse(localStorage.getItem('kicks_logged_in_user'));
    const orders = JSON.parse(localStorage.getItem('kicks_orders')) || [];

    if (orders.length === 0) {
        container.innerHTML = '<p class="text-gray">Bạn chưa có đơn hàng nào. <a href="products.html" style="color: #ba2d11;">Mua sắm ngay</a></p>';
        document.getElementById('stat-total-spent').textContent = '$0.00';
        document.getElementById('stat-active-shipments').textContent = '0';
        document.getElementById('stat-loyalty-tier').textContent = user ? (user.tier || 'NEW MEMBER') : 'NEW MEMBER';
        return;
    }

    let html = '';
    let totalSpent = 0;
    let activeShipments = 0;

    orders.forEach(order => {
        totalSpent += order.total;
        if(order.status !== 'ĐÃ GIAO') activeShipments++;
        
        html += `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <span class="order-id">#${order.id}</span>
                    <span class="order-date">Ngày đặt: ${order.date}</span>
                </div>
                <span class="order-status ${order.status === 'ĐÃ GIAO' ? 'status-completed' : 'status-shipping'}">${order.status || 'ĐANG XỬ LÝ'}</span>
            </div>
            <div class="order-body">
                ${order.items.map(item => `
                    <div class="order-item-mini" style="margin-bottom: 12px;">
                        <img src="${item.images}" alt="${item.title}">
                        <div class="oi-info">
                            <strong>${item.title}</strong>
                            <span class="text-gray">Size: ${item.size || 'N/A'} | Qty: ${item.quantity}</span>
                        </div>
                        <div class="oi-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <span class="order-total-label">Tổng tiền: <strong style="font-size: 1.2rem;">$${order.total.toFixed(2)}</strong></span>
                <button class="btn-outline-sm">XEM CHI TIẾT</button>
            </div>
        </div>
        `;
    });

    container.innerHTML = html;

    // Cập nhật 3 ô thống kê trên cùng
    document.getElementById('stat-total-spent').textContent = '$' + totalSpent.toFixed(2);
    document.getElementById('stat-active-shipments').textContent = activeShipments;
    document.getElementById('stat-loyalty-tier').textContent = user ? (user.tier || 'NEW MEMBER') : 'NEW MEMBER';
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadLayout === 'function') loadLayout();
    initProfileTabs();
    renderUserProfile();
    renderProfileOrders(); 
});