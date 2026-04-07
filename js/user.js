function initProfileTabs(){
    const menuItems = document.querySelectorAll('.menu-item');
    const tabContents = document.querySelectorAll('.tab-content');

    if(menuItems.length ===0) return;
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
    const firstLetter = user.fullName.charAt(0).toUpperCase();
    userInfoContainer.innerHTML=`
        <div class="user-avatar">${firstLetter}</div>
        <div class="user-name-box">
            <h3 class="headline-sm">${user.fullName}</h3>
            <p class="label-sm text-gray">${user.tier || "NEW MEMBER"}</p>
            <p class="label-sm text-gray">${user.email}</p>
        </div>
    `;

    const statTotal = document.getElementById('stat-total-spent');
    const statShip = document.getElementById('stat-active-shipments');
    const statTier = document.getElementById('stat-loyalty-tier');

    if(statTotal) statTotal.textContent = "$" + (user.totalSpent || 0).toFixed(2);
    if(statShip) statShip.textContent = "0";
    if(statTier) statTier.textContent = user.tier || 'NEW MEMBER';

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
    const profileFormContainer = document.getElementById('profile-form-container');
    if(profileFormContainer) {
        profileFormContainer.innerHTML = `
            <form id="update-profile-form" class="profile-form-wrapper">
                <div class="input-group">
                    <label class="label-sm">HỌ VÀ TÊN</label>
                    <input type="text" id="edit-name" value="${user.fullName}" required class="form-input">
                </div>
                <div class="input-group">
                    <label class="label-sm">EMAIL (KHÔNG THỂ ĐỔI)</label>
                    <input type="email" id="edit-email" value="${user.email}" readonly class="form-input readonly-input" title="Email dùng để đăng nhập">
                </div>
                <div class="input-group">
                    <label class="label-sm">MẬT KHẨU</label>
                    <input type="text" id="edit-password" value="${user.password}" required class="form-input">
                </div>
                <button type="submit" class="btn btn-primary btn-save-profile">LƯU THAY ĐỔI</button>
            </form>
        `;

        // XỬ LÝ SỰ KIỆN KHI BẤM NÚT LƯU
        document.getElementById('update-profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('edit-name').value;
            const newPass = document.getElementById('edit-password').value;

            // Cập nhật két sắt đang đăng nhập
            user.fullName = newName;
            user.password = newPass;
            localStorage.setItem('kicks_logged_in_user', JSON.stringify(user));

            //Cập nhật vào danh sách tổng 
            let usersList = JSON.parse(localStorage.getItem('kicks_user_list')) || [];
            const userIndex = usersList.findIndex(u => u.email === user.email);
            if(userIndex !== -1) {
                usersList[userIndex].fullName = newName;
                usersList[userIndex].password = newPass;
                localStorage.setItem('kicks_user_list', JSON.stringify(usersList));
            }

            alert("✅ Cập nhật thông tin thành công!");
            window.location.reload(); 
        });
    }

    const oderList = document.getElementById('user-order-list');
    if(oderList){
        oderList.innerHTML=`
            <div>
                <p class=" body-md text-gray">Bạn CHƯA CÓ ĐƠN HÀNG NÀO</p>
                <a href="products.html" class="btn-outline">MUA SẮM NGAY</a>
            </div>
        `;
    }
}
// HÀM HIỂN THỊ DANH SÁCH YÊU THÍCH (WISHLIST)
function renderWishlist() {
    const wishlistContainer = document.getElementById('wishlist-grid');
    if (!wishlistContainer) return;

    let wishlist = JSON.parse(localStorage.getItem('kicks_wishlist')) || [];

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-order-box">
                <p class="body-md text-gray">BẠN CHƯA CÓ SẢN PHẨM YÊU THÍCH NÀO.</p>
                <a href="products.html" class="btn btn-outline shop-now-btn">TÌM SẢN PHẨM NGAY</a>
            </div>
        `;
        wishlistContainer.style.display = "block"; 
        return;
    }

    // Đổ danh sách sản phẩm 
    let htmlContent = '<div class="vault-grid">'; 
    wishlist.forEach(product => {
        const formattedPrice = "$" + product.price.toFixed(2);
        htmlContent += `
        <a href="product-detail.html?id=${product.id}" class="vault-card">
            <div class="card-image">
                <img src="${product.thumbnail}" alt="${product.title}">
            </div>
            <div class="card-meta">
                <span class="label-sm pdp-brand-text">${product.brand}</span>
                <span class="price">${formattedPrice}</span>
            </div>
            <h3 class="product-title">${product.title}</h3>
            <button class="btn-remove-wishlist label-sm text-primary" data-id="${product.id}" style="margin-top: 12px; text-align: left; background: none; border: none; cursor: pointer; text-decoration: underline;">REMOVE ITEM</button>
        </a>
        `;
    });
    htmlContent += '</div>';
    wishlistContainer.innerHTML = htmlContent;

    // Bắt sự kiện xóa khỏi Wishlist
    document.querySelectorAll('.btn-remove-wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            const idToRemove = e.target.getAttribute('data-id');
            wishlist = wishlist.filter(item => item.id !== idToRemove);
            localStorage.setItem('kicks_wishlist', JSON.stringify(wishlist));
            renderWishlist(); 
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadLayout === 'function') loadLayout();
    initProfileTabs();
    renderUserProfile();
    
    renderWishlist(); 
});
