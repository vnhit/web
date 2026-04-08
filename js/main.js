// header and footer 
async function loadLayout(){
    const headerEl = document.getElementById('app-header');
    const footerEl = document.getElementById('app-footer');

    if(headerEl){
        try{
            const res = await fetch('header.html');
            headerEl.innerHTML = await res.text();
            checkLoginStatus();
            updateCartBadge();
            setActiveNav(); 
            initSearch();
        }catch(error){ console.error('Lỗi load header',error); }
    }

    if(footerEl){
        try{
            const res = await fetch('footer.html');
            footerEl.innerHTML = await res.text();
        }catch(error){ console.error('Lỗi load footer',error); }       
    }
} 

// ckeck in and out
function checkLoginStatus(){
    const authArea =document.getElementById('auth-action-area');
    if(!authArea) return;

    const user = JSON.parse(localStorage.getItem('kicks_logged_in_user'));

    if(user){
        const firstLetter = user.fullName.charAt(0).toUpperCase();
        authArea.innerHTML=`
            <div class="user-dropdown-wrapper">
                <button class="header-user-avatar">${firstLetter}</button>
                <div class="user-dropdown-menu">
                    <a href="user-profile.html" class="header-user-link">Thông tin user</a>
                    <button onclick="logoutUser()" class="header-logout-btn">LOGOUT</button>
                </div>
            </div>
        `;
    }else{
        authArea.innerHTML=`
            <div class="user-dropdown-wrapper">
                <button class="icon-btn header-auth-link">👤</button>
                <div class="user-dropdown-menu">
                    <a href="auth.html?tab=login">ĐĂNG NHẬP</a>
                    <a href="auth.html?tab=register">ĐĂNG KÝ</a>
                </div>
            </div>
        `;  
    }
}
function logoutUser(){
    localStorage.removeItem('kicks_logged_in_user');
    window.location.href='index.html';
}

//  update cart badge
function updateCartBadge(){
    const badge = document.getElementById('cart-badge');
    if(!badge) return;
    let cart = JSON.parse(localStorage.getItem('kicks_cart')) || [];
    
    let totalItems =0;
    cart.forEach(item => { totalItems += item.quantity; });

    badge.textContent = totalItems;
    if(totalItems ===0){
        badge.style.display = 'none';
    }else{
        badge.style.display = 'flex';
    }
}
// atuo highlight
function setActiveNav() {
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active'); 
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active'); 
        }
    });
}

// Tìm kiếm
function initSearch() {
    const searchInput = document.getElementById('global-search-input');
    const searchBtn = document.getElementById('global-search-btn');
    if (!searchInput || !searchBtn) return;

    function executeSearch() {
        const keyword = searchInput.value.trim();
        if (keyword) {
            window.location.href = `products.html?q=${encodeURIComponent(keyword)}`;
        }
    }

    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeSearch();
    });
}

// Home
function renderHomeStaticContent(){
    if(!document.getElementById('hero-title')) return;
    document.getElementById('hero-title').innerHTML =`<span class="text-primary">PRECISION</span>`;
    document.getElementById('hero-subtitle').textContent ="Mẫu mã trẻ trung năng động";
    document.getElementById('hero-buttons').innerHTML =`<a href="products.html" class="btn btn-primary">SHOP</a>`;
    document.getElementById('hero-image-container').innerHTML = `<img src="assets/images/banners/Hero.png" alt="Hero">`;

    const ticker = document.getElementById('home-brand-ticker');
    if(ticker){
        const brand = ['NIKE','ADIDAS','PUMA','JORDAN','OFF WHITE'];
        ticker.innerHTML = brand.map(b => `<span>${b}</span>`).join(' . ').repeat(5);
    }

    document.getElementById('promo-image-container').innerHTML = `<img src="assets/images/banners/Promo-Shoe.png" alt="Promo Shoe">`;
    document.getElementById('promo-tag').textContent ="THE KICKS. GUARANTEE";
    document.getElementById('promo-title').textContent = "100% AUTHENTIC" ;
    document.getElementById('promo-desc').textContent = "Không chỉ bán giày, chúng tôi tôn vinh văn hóa sát mặt đất. Mỗi đôi Sneaker tại KICKS. đều trải qua quy trình kiểm định nghiêm ngặt nhiều bước, cam kết mang đến tay bạn sản phẩm chính hãng, nguyên bản với mức giá tốt nhất.";
    document.getElementById('promo-link-text').textContent = "MUA GIÀY CHÍNH HÃNG";
    document.getElementById('promo-link-text').href = "products.html";
}

// Đọc dữ liệu sản phẩm
let allVaultProducts = []; 
let currentSizeFilter = null; 
let currentGenderFilters = []; 
let currentPage = 1;
const itemsPerPage = 9;
// sắp xếp 
let currentSortOrder = 'default'; 
document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('price-sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSortOrder = e.target.value; 
            currentPage = 1; 
            applyFilters();  
        });
    }
});
// Thẻ sp
function renderProductsGrid(products, containerId, limit = 0, emptyMessage = "KHÔNG TÌM THẤY SẢN PHẨM.") {
    const container = document.getElementById(containerId);
    if (!container) return;

    if(products.length === 0) {
        container.innerHTML = `
            <div class="empty-filter-msg" style="text-align: center; padding: 60px 0; grid-column: 1/-1;">
                <p class="headline-sm">${emptyMessage}</p>
                ${containerId === 'standalone-wishlist-grid' ? '<br><a href="products.html" class="btn btn-outline">MUA SẮM NGAY</a>' : ''}
            </div>`;
        return;
    }

    const currentWishlist = JSON.parse(localStorage.getItem('kicks_wishlist')) || [];
    let htmlContent = '';
    const displayProducts = limit > 0 ? products.slice(0, limit) : products;

    displayProducts.forEach(product => {
        const formattedPrice = "$" + product.price.toFixed(2);
        const isWished = currentWishlist.some(item => item.id === product.id);
        const heartClass = isWished ? 'wished' : ''; 

        htmlContent += `
        <div style="position: relative;">
            <a href="product-detail.html?id=${product.id}" class="vault-card">
                <div class="card-image">
                    <img src="${product.thumbnail}" alt="${product.title}">
                </div>
                <div class="card-meta">
                    <span class="label-sm pdp-brand-text">${product.brand}</span>
                    <span class="price">${formattedPrice}</span>
                </div>
                <h3 class="product-title">${product.title}</h3>
            </a>
            <button class="heart-wishlist-btn ${heartClass}" data-id="${product.id}">❤</button>
        </div>
        `;
    });
    container.innerHTML = htmlContent;

    // Kích hoạt sự kiện Tim 
    const heartBtns = container.querySelectorAll('.heart-wishlist-btn');
    heartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            const productId = btn.getAttribute('data-id');
            const productInfo = products.find(p => p.id === productId) || currentWishlist.find(p => p.id === productId);
            
            let wishlist = JSON.parse(localStorage.getItem('kicks_wishlist')) || [];
            const index = wishlist.findIndex(item => item.id === productId);

            if (index !== -1) {
                wishlist.splice(index, 1); 
                btn.classList.remove('wished');
            } else {
                wishlist.push(productInfo); 
                btn.classList.add('wished');
            }
            localStorage.setItem('kicks_wishlist', JSON.stringify(wishlist));
            
            if(containerId === 'standalone-wishlist-grid') {
                renderStandaloneWishlist();
            }
        });
    });
}

function initVaultPage() {
    if (!document.getElementById('product-list')) return;

    fetch('data/products.json')
        .then(res => res.json())
        .then(data => {
            allVaultProducts = data;
            applyFilters();
            setupFilterEvents(); 
        });
}

function setupFilterEvents() {
    // Sự kiện nút Size
    const sizeBtns = document.querySelectorAll('.sidebar-filters .size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isActive = btn.classList.contains('active');
            sizeBtns.forEach(b => b.classList.remove('active')); 
            
            if (!isActive) {
                btn.classList.add('active'); 
                currentSizeFilter = parseInt(btn.textContent);
            } else {
                currentSizeFilter = null; 
            }
            currentPage = 1;
            applyFilters();
        });
    });

    // Sự kiện Checkbox Giới tính
    const genderCheckboxes = document.querySelectorAll('.gender-filter-cb');
    genderCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            currentGenderFilters = Array.from(genderCheckboxes)
                                        .filter(checkbox => checkbox.checked)
                                        .map(checkbox => checkbox.value);
            currentPage = 1;
            applyFilters();

        });
    });
}

    
function applyFilters() {
    let filteredList = [...allVaultProducts];    
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filteredList = filteredList.filter(p => 
            p.title.toLowerCase().includes(lowerQuery) || 
            p.brand.toLowerCase().includes(lowerQuery)
        );
    }
    if (currentSizeFilter) {
        filteredList = filteredList.filter(p => p.availableSizes.includes(currentSizeFilter));
    }

    if (currentGenderFilters.length > 0) {
        filteredList = filteredList.filter(p => currentGenderFilters.includes(p.gender));
    }
    if (currentSortOrder === 'price-asc') {
        // Giá tăng dần
        filteredList.sort((a, b) => a.price - b.price);
    } else if (currentSortOrder === 'price-desc') {
        // Giá giảm dần
        filteredList.sort((a, b) => b.price - a.price);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedList = filteredList.slice(startIndex, endIndex);
    renderProductsGrid(paginatedList, 'product-list');

    renderPagination(filteredList.length);
}
// --- HÀM VẼ NÚT CHUYỂN TRANG ---
function renderPagination(totalItems) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHTML = '';

    // Nếu < 9, ẩn phân trang
    if (totalPages <= 1) {
        paginationContainer.innerHTML = ''; 
        return;
    }

    // Vẽ số trang 1, 2, 3...
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<button class="page-btn ${activeClass}" onclick="changePage(${i})">${i}</button>`;
    }

    // Nút NEXT
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn next-btn" onclick="changePage(${currentPage + 1})">NEXT →</button>`;
    }

    paginationContainer.innerHTML = paginationHTML;
}

// khi next page
window.changePage = function(pageNumber) {
    currentPage = pageNumber;
    applyFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
//Chi tiết sản phẩm
function renderProductDetail() {
    const productDetail = document.getElementById('pdp-title');
    if (!productDetail) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    fetch('data/products.json')
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (!product) {
                productDetail.textContent = "SẢN PHẨM KHÔNG TỒN TẠI";
                return;
            }

            document.getElementById('pdp-brand-edition').textContent = product.brand;
            document.getElementById('pdp-title').textContent = product.title;
            document.getElementById('pdp-price').textContent = "$" + product.price.toFixed(2);
            document.getElementById('pdp-description').textContent = "Mẫu giày tinh tế kết hợp giữa thiết kế hiện đại và công nghệ tiên tiến nhất của " + product.brand + ".";
            document.getElementById('pdp-main-image').innerHTML = `<img src="${product.thumbnail}" class="pdp-main-img-fit">`;

            let selectedSize = product.availableSizes[0]; 
            let selectedColor = product.colors[0];
            let sizeHTML = '';
            product.availableSizes.forEach((size, index) => {
                const activeClass = (index === 0) ? 'active' : '';
                sizeHTML += `<button class="size-btn ${activeClass}" data-size="${size}">US ${size}</button>`;
            });
            const sizeGrid = document.getElementById('pdp-size-grid');
            sizeGrid.innerHTML = sizeHTML;

            const sizeBtns = sizeGrid.querySelectorAll('.size-btn');
            sizeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    sizeBtns.forEach(b => b.classList.remove('active')); 
                    btn.classList.add('active'); 
                    selectedSize = btn.getAttribute('data-size'); 
                });
            });
            let colorHTML = '';
            product.colors.forEach((color, index) => {
                const activeClass = (index === 0) ? 'active' : '';
                colorHTML += `<div class="color-swatch-btn ${activeClass}" style="background-color: ${color};" data-color="${color}"></div>`;
            });
            const colorGrid = document.getElementById('pdp-color-grid');
            colorGrid.innerHTML = colorHTML;
            document.getElementById('pdp-selected-color').textContent = selectedColor; // Hiện text mã màu

            const colorBtns = colorGrid.querySelectorAll('.color-swatch-btn');
            colorBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    colorBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    selectedColor = btn.getAttribute('data-color');
                    document.getElementById('pdp-selected-color').textContent = selectedColor; // Cập nhật text mã màu
                });
            });
            // nút thêm sản phẩm 
            const btnAddCart = document.getElementById('btn-add-cart');
            if(btnAddCart) {
                const newBtn = btnAddCart.cloneNode(true);
                btnAddCart.parentNode.replaceChild(newBtn, btnAddCart);
                
                newBtn.addEventListener('click', () => {
                    const cartItemId = product.id + '-' + selectedSize + '-' + selectedColor.replace('#', '');
                    const cartItem = {
                        id: cartItemId,
                        baseId: product.id, 
                        title: product.title + ` (Size: ${selectedSize})`, 
                        price: product.price, 
                        images: product.thumbnail, 
                        quantity: 1
                    };
                    let cart = JSON.parse(localStorage.getItem('kicks_cart')) || [];
                    const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);
                    if(existingItemIndex !== -1) {
                        cart[existingItemIndex].quantity += 1;
                        showToast(`Đã tăng số lượng đôi ${product.title} trong giỏ`,'success');
                    } else {
                        cart.push(cartItem);
                        showToast('Đã thêm sản phẩm vào giỏ!','success');
                    }
                    localStorage.setItem('kicks_cart', JSON.stringify(cart));
                    updateCartBadge();
                });
            }
            // thêm sp yêu thích
            const btnAddWishlist = document.getElementById('btn-add-wishlist');
            if(btnAddWishlist) {
                const newWishBtn = btnAddWishlist.cloneNode(true);
                btnAddWishlist.parentNode.replaceChild(newWishBtn, btnAddWishlist);

                newWishBtn.addEventListener('click', () => {
                    // Yêu cầu phải đăng nhập mới cho lưu Wishlist
                    const user = JSON.parse(localStorage.getItem('kicks_logged_in_user'));
                    if(!user) {
                        showToast("Vui lòng đăng nhập để thêm sản phẩm vào mục Yêu Thích!",'error');
                        window.location.href = "auth.html?tab=login";
                        return;
                    }

                    const wishlistItem = {
                        id: product.id, 
                        title: product.title, 
                        price: product.price, 
                        thumbnail: product.thumbnail,
                        brand: product.brand
                    };

                    let wishlist = JSON.parse(localStorage.getItem('kicks_wishlist')) || [];
                    const isExist = wishlist.find(item => item.id === product.id);

                    if(isExist) {
                        showToast('Sản phẩm này đã có trong danh sách Yêu Thích của bạn rồi!','info');
                    } else {
                        wishlist.push(wishlistItem);
                        localStorage.setItem('kicks_wishlist', JSON.stringify(wishlist));
                        showToast('❤️ Đã thả tim! Bạn có thể xem lại trong User Profile.','success');
                    }
                });
            }
            let relatedProducts = products.filter(p => p.brand === product.brand && p.id !== product.id);
            if (relatedProducts.length < 4) {
                const otherProducts = products.filter(p => p.brand !== product.brand && p.id !== product.id);
                relatedProducts = [...relatedProducts, ...otherProducts];
            }
            relatedProducts.sort(() => 0.5 - Math.random());
            const crossSellList = relatedProducts.slice(0, 4);
            renderProductsGrid(crossSellList, 'pdp-cross-sell-list');
        });
}
document.addEventListener("DOMContentLoaded", () =>{
    loadLayout();
    
    fetch('data/products.json')
        .then(res => res.json())
        .then(data => {
            renderProductsGrid(data, 'home-trending-list', 4); 
        });

    initVaultPage(); 
    renderProductDetail(); 
    renderHomeStaticContent(); 
});