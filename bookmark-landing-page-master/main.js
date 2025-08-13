console.log('CHALLENGE FRONTEND MENTOR BY JAHERRERAF')
document.querySelector('.hamburger').addEventListener('click',function(){
    document.querySelector('.mobile-nav').style.right = '0px'
    document.querySelector('header').style.opacity = '0'
})
document.querySelector('.icon-close').addEventListener('click',function(){
    document.querySelector('.mobile-nav').style.right = '-1000px'
    document.querySelector('header').style.opacity = '1'
})