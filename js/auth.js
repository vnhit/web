function initAuthTabs(){
    const tabs = document.querySelectorAll('.auth-tab-btn');
    const sections = document.querySelectorAll('.auth-section');

    tabs.forEach(tab =>{
        tab.addEventListener('click',() =>{
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            sections.forEach(secs => secs.style.display='none');

            const targetId = tab.getAttribute('data-target');
            const targetTabs = document.getElementById(targetId);
            if(targetTabs){
                targetTabs.style.display='block';
            }
        });
    });
}
document.addEventListener("DOMContentLoaded", () =>{
    initAuthTabs();
    const loginForms = document.getElementById('login-form');
    const registerForms = document.getElementById('register-form');

    if(registerForms){
        registerForms.addEventListener('submit', (e) =>{
            e.preventDefault();

            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            let userList = JSON.parse(localStorage.getItem('kicks_user_list')) || [];

            const isExist = userList.find(u => u.email == email);
            if(isExist){
                alert('Email đẫ tồn tại');
                return;
            }
            const newUser ={
                id:'KICKS-' + Date.now(),
                fullName:name,
                email:email,
                password:password,
                tier:"New ",
                totalSpent:0,

            }
            userList.push(newUser);
            localStorage.setItem('kicks_user_list', JSON.stringify(userList));
            alert('Đăng ký thành công');
            registerForms.reset();
            document.querySelector('[data-target="login-section"]').click();
        });
    }
    
    if(loginForms){
        loginForms.addEventListener('submit', (e) =>{
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            let userList = JSON.parse(localStorage.getItem('kicks_user_list')) || [];
            const user = userList.find(u => u.email === email && u.password === password);
            if(user){
                localStorage.setItem('kicks_logged_in_user', JSON.stringify(user));
                alert("Đăng nhập thành công! Chào mừng " + user.fullName);
                window.location.href ='index.html';
            }else{
                alert("Đăng nhập thất bại");
            }
        });
    }
});