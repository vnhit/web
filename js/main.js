// Card product
function fetchAndRenderProducts(containerId ,limit) {
    const productList = document.getElementById( containerId);

    if(!productList) return;

    fetch(`https://dummyjson.com/products/category/mens-shoes?limit=${limit}`)
        .then(response => {
            if(!response.ok) throw new Error('Lỗi mạng!');
            return response.json();
        })
        .then(data =>{
            let htmlContent ='';
            const products = data.products;
            products.forEach(product =>{
                const formattedPrice = "$" + product.price.toFixed(2);
                htmlContent += `
                <a href="product-detail.html?id=${product.id}" class="vault-card" style="text-decoration: none">
                    <div class="card-image">
                        <img src="${product.thumbnail}" alt="${product.title}">
                    </div>
                    <div class="card-meta">
                        <span class="label-sm" style="color:#888">${product.brand || 'KICKS BRAND'} </span>
                        <span class="price">${formattedPrice}</span>
                    </div>
                    <h3 class="product-title">${product.title}</h3>
                </a>
                `;
            });
            productList.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Lỗi lấy API:',error);
            productList.innerHTML = '<p class="body-md text-primary">Kết nối thất bại.</p>';           
        });
}
////=============================
document.addEventListener("DOMContentLoaded", () =>{
    fetchAndRenderProducts('product-list',0);
    fetchAndRenderProducts('home-trending-list',5);
    renderProductDetail();
    renderHomeStaticContent();
});
//================================
// Product detail
function renderProductDetail(){
    const productDetail = document.getElementById('pdp-title');
    if(!productDetail) return;

    const urlParams = new URLSearchParams(window.location.search);
    const  productId = urlParams.get('id');

    if(!productId) {
        productDetail.textContent ="Sản phẩm không tồn tại";
        return;
    }
    fetch('https://dummyjson.com/products/' + productId)
        .then(response =>{
            if(!response.ok) throw new Error('Lỗi mạng');
            return response.json();
        })
        .then(product =>{
            document.getElementById('pdp-brand-edition').textContent = product.brand || 'KICKS BRAND';
            document.getElementById('pdp-title').textContent = product.title;
            document.getElementById('pdp-price').textContent = "$" + product.price.toFixed(2);
            document.getElementById('pdp-description').textContent = product.description;

            const categoryName = product.category.replace('-', ' ').toUpperCase();
            document.getElementById('pdp-breadcrumb').textContent = `HOME > ${categoryName} > ${product.brand || 'SNEAKERS'}`;            
            document.getElementById('pdp-main-image').innerHTML=`
                <img src="${product.thumbnail || product.images[0]}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">`;

            const mockSizes = [7,8,8.5,9,10,11];
            let sizeHTML ='';
            mockSizes.forEach(size =>{
                const activeClass = (size===8) ? 'active' : '';
                sizeHTML += `<button class="size-btn ${activeClass}">US ${size}</button>`
            });
            document.getElementById('pdp-size-grid').innerHTML= sizeHTML;

            const mockColor = ['#ad2c00', '#111111', '#e2e2e2'];
            let colorHTML ='';
            mockColor.forEach((color,index) =>{
                const activeClass = (index===0) ? 'active' : '';
                colorHTML += `<div class="color-swatch-btn ${activeClass}"style="background-color: ${color};"></div>`
            });
            document.getElementById('pdp-color-grid').innerHTML= colorHTML;

            // add to cart
            const btnAddCart = document.getElementById('btn-add-cart');
            if(btnAddCart){
                btnAddCart.addEventListener('click',() =>{
                    const cartItem = {
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        images: product.thumbnail,
                        quantity: 1,

                    }
                let cart = JSON.parse(localStorage.getItem('kicks_cart')) || [];
                const existingItemIndex = cart.findIndex(item => item.id == cartItem.id);
                if(existingItemIndex !== -1){
                cart[existingItemIndex].quantity += 1;
                alert('Đã tăng số lượng sp');
                }else {
                cart.push(cartItem);
                alert('Đã thêm sp');
                }
                localStorage.setItem('kicks_cart',JSON.stringify(cart));
                });
                
            }
            

        })
        .catch(error =>{
            console.error("Lỗi lấy sp:",error);
            productDetail.textContent = "Lỗi tải dữ liệu";
        });
}
// home
function renderHomeStaticContent(){
    if(!document.getElementById('hero-title')) return;
    document.getElementById('hero-title').innerHTML =`<span class="text-primary">PRECISION</span>`;
    document.getElementById('hero-subtitle').textContent ="Mẫu mã trẻ trung năng động";
    document.getElementById('hero-buttons').innerHTML =`<a href="products.html class="btn btn-primary">SHOP</a>`;
    document.getElementById('hero-image-container').innerHTML = `<img src="" alt="Hero">`;

    const ticker = document.getElementById('home-brand-ticker');
    if(ticker){
        const brand = ['NIKE','ADIDAS','PUMA','JORDAN','OFF WHITE'];
        ticker.innerHTML = brand.map(b => `<span>${b}</span>`).join(' . ').repeat(5);
    }

    document.getElementById('promo-image-container').innerHTML = `
        <img src="" alt="Promo Shoe">`;
    document.getElementById('promo-tag').textContent ="LIMITED EDITION";
    document.getElementById('promo-title').textContent = "HOT" ;
    document.getElementById('promo-desc').textContent = "";
    document.getElementById('promo-link-text').textContent = "EXPLORE THE LOOKBOOK";
    document.getElementById('promo-link-text').href = "products.html";

}
