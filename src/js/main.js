const denomItems = document.querySelectorAll('.denominations__item');
// const price = document.querySelectorAll('giftCard__content__info_price');
console.log('hello');
console.log(denomItems);

denomItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    alert(`${e.target.innerText}`);
    //   price.innerText = e.target.innerText;
    //   price.push(e.target.innerText);
    //   // window.reload();
    //   console.log(price.innerText);
  });
});
