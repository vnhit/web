// Gọi hàm vẽ của main.js để tái sử dụng 100% Component Vault Card
function renderStandaloneWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('kicks_wishlist')) || [];
    
    // Gọi thẳng hàm renderProductsGrid với thông báo rỗng riêng biệt
    renderProductsGrid(wishlist, 'standalone-wishlist-grid', 0, "BẠN CHƯA THẢ TIM SẢN PHẨM NÀO.");
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadLayout === 'function') loadLayout();
    renderStandaloneWishlist();
});