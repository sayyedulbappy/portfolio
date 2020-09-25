const menuBtn = document.querySelector('.menu-btn');
const menuList = document.querySelector('.menu-list');
const main = document.querySelector('main');
menuBtn.addEventListener('click', () => {
  setTimeout(() => {
    menuBtn.classList.toggle('open');
    menuList.classList.toggle('responsive');
  }, 100);
});

main.addEventListener('click', () => {
  setTimeout(() => {
    if (menuBtn.classList.contains('open')) {
      menuBtn.classList.toggle('open');
      menuList.classList.toggle('responsive');
    }
  }, 100);
});
