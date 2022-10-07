/*Слайдер*/
let position = 0;
const slidesToShow = 1;
const slidesToScroll = 1;
const container = document.querySelector(".slider-container");
const track = document.querySelector(".slider-track");
const items = document.querySelectorAll(".slider-item");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const itemCount = items.length;
const itemWidth = container.clientWidth / slidesToShow;
const movePosition = slidesToScroll * itemWidth;

items.forEach((item) => {
  item.style.minWidth = `${itemWidth}px`;
});

btnPrev.addEventListener("click", function () {
  const itemsLeft = Math.abs(position) / itemWidth;
  position +=
    itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth;
  setPosition();
  checkBtns();
  console.log(position);
});

btnNext.addEventListener("click", function () {
  const itemsLeft =
    itemCount - (Math.abs(position) + slidesToShow * itemWidth) / itemWidth;
  position -=
    itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth;
  setPosition();
  checkBtns();
  console.log(itemsLeft);
});

const setPosition = () => {
  track.style.transform = `translateX(${position}px)`;
};

const checkBtns = () => {
  btnPrev.disabled = position === 0;
  btnNext.disabled = position <= -(itemCount - slidesToShow) * itemWidth;
};

checkBtns();

/*Меню*/
const menuBtn = document.querySelector(".menu-btn");
const headerMenuMobile = document.querySelector(".header-menu-mobile");
menuBtn.addEventListener("click", function () {
  headerMenuMobile.classList.toggle("none");
});

/*Корзина*/
/*Закрыть и открыть корзину */
const cartBtn = document.querySelector(".cart");
const cart = document.querySelector(".cart-block");
const cartCloseBtn = document.querySelector(".cart-button");

cartBtn.addEventListener("click", function () {
  cart.classList.remove("none");
});
cartCloseBtn.addEventListener("click", function () {
  cart.classList.add("none");
});
/*Счетчик*/
window.addEventListener("click", function (event) {
  if (
    event.target.dataset.action === "plus" ||
    event.target.dataset.action === "minus"
  ) {
    const counterWrapper = event.target.closest(".counter-wrapper");
    const counter = counterWrapper.querySelector("[data-counter]");

    if (event.target.dataset.action === "plus") {
      counter.innerText = ++counter.innerText;
    }

    if (event.target.dataset.action === "minus") {
      if (parseInt(counter.innerText) > 1) {
        counter.innerText = --counter.innerText;
      } else if (
        event.target.closest(".cart-wrapper") &&
        parseInt(counter.innerText) === 1
      ) {
        event.target.closest(".cart-item").remove();
        toggleCartStatus();
        calcCartPrice();
      }
    }
    if (
      event.target.hasAttribute("data-action") &&
      event.target.closest(".cart-wrapper")
    ) {
      calcCartPrice();
    }
  }
});

/*Добавление товара в корзину*/
const cartWrapper = document.querySelector(".cart-wrapper");
let productInfo;
window.addEventListener("click", function (event) {
  if (event.target.hasAttribute("data-cart")) {
    const productsItem = event.target.closest(".products-item");

    productInfo = {
      id: productsItem.dataset.id,
      imgSrc: productsItem
        .querySelector(".products-item-cart__img")
        .getAttribute("src"),
      title: productsItem.querySelector(".products-item__name").innerText,
      weight: productsItem.querySelector(".products-item__weight").innerText,
      price: productsItem.querySelector(".products-item__price").innerText,
    };

    const itemInCart = cartWrapper.querySelector(
      `[data-id="${productInfo.id}"]`
    );
    if (itemInCart) {
      const counterEl = itemInCart.querySelector("[data-counter]");
      counterEl.innerText = parseInt(counterEl.innerText) + 1;
    } else {
      const cartItemHTML = `          <div data-id="${productInfo.id}" class="cart-item">
      <div class="cart-item-img-block">
        <img class="cart-item__img" src="${productInfo.imgSrc}" alt="Fruit">
      </div>
      <div class="cart-item-content">
        <div class="cart-item-top">
          <p class="cart-item__name">${productInfo.title}</p>
          <p class="cart-item__price">${productInfo.price}<span>$</span></p>
        </div>
        <div class="cart-item-bottom">
          <p class="cart-item__weight">${productInfo.weight}</p>
          <div class="counter-wrapper">
            <div class="counter-control" data-action="minus">-</div>
            <div class="counter-current" data-counter>1</div>
            <div class="counter-control" data-action="plus">+</div>
          </div>
        </div>
      </div>
    </div>`;
      cartWrapper.insertAdjacentHTML("beforeend", cartItemHTML);
    }

    toggleCartStatus();
    calcCartPrice();
  }
});

/*Отображение статуса корзины*/
function toggleCartStatus() {
  const cartEmpty = document.querySelector(".cart-empty");
  const orderForm = document.querySelector(".order-form");

  if (cartWrapper.children.length > 0) {
    cartEmpty.classList.add("none");
    orderForm.classList.remove("none");
  } else {
    cartEmpty.classList.remove("none");
    orderForm.classList.add("none");
  }
}

/*Подсчет Итого*/
function calcCartPrice() {
  const cartItems = document.querySelectorAll(".cart-item");
  const totalPriceEl = document.querySelector(".total-price");
  const totalWeightEl = document.querySelector(".total-weight");
  let totalPrice = 0;
  let totalWeight = 0;

  cartItems.forEach(function (item) {
    const amountEl = item.querySelector("[data-counter]");
    const priceEl = item.querySelector(".cart-item__price");
    const weightEl = item.querySelector(".cart-item__weight");
    const currentPrice =
      parseInt(amountEl.innerText) * parseFloat(priceEl.innerText);
    const currentWeight =
      parseInt(amountEl.innerText) * parseFloat(weightEl.innerText);
    totalPrice += currentPrice;
    totalWeight += currentWeight / 1000;
  });
  totalPriceEl.innerText = totalPrice.toFixed(2);
  totalWeightEl.innerText = totalWeight;
}
