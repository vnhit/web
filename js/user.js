function initProfileTabs(){
    const menuItems = document.querySelectorAll('.menu-item');
    const tabContents = document.querySelectorAll('.tab-content');

    if(menuItems.length ===0) return;
    menuItems.forEach(item =>{
        item.addEventListener('click',() =>{
            item.forEach(btn => btn.classList.remove('active'));
            item.classList.add('active');
            tabContents.forEach(tab => tab.style.dislay = 'none');
            const targetId = item.getAttribute('data-target');
            const targetTab = document.getElementById(targetId);
            if(targetTab){
                targetTab.style.dislay = 'block';
            }
        });       
    });
}
function renderUserProfile(){
    

}