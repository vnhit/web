// Card product
function fetchAndRenderProducts(){
    const productList = document.getElementById('product-list');

    if(!productList) return;

    fetch('https://dummyjson.com/products/category/mens-shoes')
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
    fetchAndRenderProducts();
    renderProductDetail();
    renderCartPage()
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
                console.log(cart);
console.log(cartItem);
                localStorage.setItem('kicks_cart',JSON.stringify(cart));
                
                })
                
            }
            

        })
        .catch(error =>{
            console.error("Lỗi lấy sp:",error);
            productDetail.textContent = "Lỗi tải dữ liệu";
        });


}
