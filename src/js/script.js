function testWebP(callback) {
  var webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src =
    'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector('body').classList.add('webp');
  } else {
    document.querySelector('body').classList.add('no-webp');
  }
});

const denomItems = document.querySelectorAll('.denominations__item');
const priceBlock = document.querySelectorAll('.giftCard__content__info_price');

denomItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    let newPrice = e.target.innerText;
    priceBlock[0].innerText = newPrice;
  });
});
