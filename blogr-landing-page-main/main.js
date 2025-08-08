console.log("FRONTEND MENTOR BY JAHERRERAF")
const attribution = document.querySelector('.attribution');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});
observer.observe(attribution);

document.querySelector('.menu-burguer').addEventListener('click', function () {
    document.querySelector('.menu-burguer').style.scale = '0'
    document.querySelector('#sidebar > .wrapper-btn-close > .icon-close').style.scale = '1'
    
    document.querySelector('#sidebar').style.right = '0'
})
document.querySelector('#sidebar > .wrapper-btn-close > .icon-close').addEventListener('click', function () {
    document.querySelector('.menu-burguer').style.scale = '1'
    document.querySelector('#sidebar > .wrapper-btn-close > .icon-close').style.scale = '0'
    document.querySelector('#sidebar').style.right = '-1000px'
})

const dropdown = [
    { title: 'Product', list: ['Overview', 'Pricing', 'Marketplace', 'Features', 'Integrations'] },
    { title: 'Company', list: ['About', 'Team', 'Blog', 'Careers'] },
    { title: 'Connect', list: ['Contact', 'Newsletter', 'LinkedIn'] },
]
const htmlDropdowns = dropdown.map(item => {
    const listItems = item.list.map(listItem => `<li><a href="#">${listItem}</a></li>`).join('')
    return `
        <div class="dropdown">
            <div class="title-dropdown">
                <span>${item.title}</span>
                <div class="icon-arrow"></div>
            </div>
            <ul class="dropdown-content">
                ${listItems}
            </ul>
        </div>
    `
})

document.querySelector('header > .wrapper-dropdown').innerHTML = htmlDropdowns.join('')