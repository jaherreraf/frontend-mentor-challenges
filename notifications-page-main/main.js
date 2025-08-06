console.log('CHALLENGE FRONTEND MENTOR BY JAHERRERAF')
const notification  = document.querySelectorAll('.new-notification')
document.querySelector('#all-read').addEventListener('click',function(){
    if(notification)
        Array.from(notification).forEach(notifn=>{
            notifn.querySelector('.point').style.display = 'none'
            notifn.classList.remove('new-notification');
        })
    document.querySelector('#notification-amount').style.display = 'none'
})


const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

observer.observe(document.querySelector('.attribution'));