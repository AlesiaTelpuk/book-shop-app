import { Component } from "../Abstact/Component";
import { TBookBasket, TDataBasket, TServices } from "../Abstact/Type";
import { CartBasket } from "../Common/CartBasket";


export class Basket extends Component {
  divBasket: Component;
  spanAllSumma: Component;
  spanSumma: Component;
  spanPercent: Component;
  nullBasket: Component;
  fullBasket: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["basket"]);
    services.dbService.calcDataBasket();

    const container = new Component(this.root, 'div', ["container"]);
    new Component(container.root, 'h1', ["h1__title"], "Basket");

    let isBasketClear = false;//переменная для проверки пустоты корзины
    if (services.dbService.dataUser) {
      if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
    }

    this.nullBasket = new Component(container.root, 'div', ['nullBasket']);//блок для пустой корзины
    new Component(this.nullBasket.root, 'p', ["nullBasket-text"], "Your basket is currently empty.");
    const btn = new Component(this.nullBasket.root, 'a', null, null, ["href"], ["#catalog"])
    new Component(btn.root, 'input', ["mainbutton"], null, ["type", "value"], ["button", "Go to the catalog"])

    this.fullBasket = new Component(container.root, 'div', ['fullBasket']);//блок для полной корзины
    this.toggleBasket(isBasketClear);

    this.divBasket = new Component(this.fullBasket.root, 'div', ["basket__books"]);
    if (services.dbService.dataUser) //если пользователь существует
      services.dbService.dataUser.basket.forEach(el => { //то для каждого элемента в корзине
        this.putBooksInBasket(this.divBasket, el); //вызвать функцию, которая добавляет карточку товара на страницу корзины
      });

    const total = new Component(this.fullBasket.root, 'div', ["total__basket-inner"]);//общая сумма корзины
    this.spanSumma = new Component(total.root, 'span', ["basket-sum"], `Summa: ${services.dbService.dataBasket.summa} BYN`);
    this.spanPercent = new Component(total.root, 'span', ["basket-sum"], `Percent: ${services.dbService.dataBasket.percent} %`);
    this.spanAllSumma = new Component(total.root, 'span', ["basket-sum"], `Total summa: ${services.dbService.dataBasket.allSumma} BYN`);

    const btnOplata = new Component(total.root, 'input', ["mainbutton"], null, ["type", "value"], ["button", "Place order"]);
    btnOplata.root.onclick = () => {
      const user = services.authService.user;
      services.dbService.addBasketInHistory(user);
    }

    services.dbService.addListener('bookInBasket', (tovar) => {//при команде "bookInBasket"
      this.putBooksInBasket(this.divBasket, tovar as TBookBasket);
      this.toggleBasket(true);
    });

    services.dbService.addListener('changeDataBasket', (dataBasket) => {//при изменении в корзине
      this.spanSumma.root.innerHTML = `Summa: ${(dataBasket as TDataBasket).summa} BYN`;
      this.spanPercent.root.innerHTML = `Percent: ${(dataBasket as TDataBasket).percent} %`;
      this.spanAllSumma.root.innerHTML = `Total summa: ${(dataBasket as TDataBasket).allSumma} BYN`;
      let isBasketClear = false;
      if (services.dbService.dataUser) {
        if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
      }
      this.toggleBasket(isBasketClear);
    });

    services.dbService.addListener("clearBasket", () => {//очистить корзину
      this.divBasket.root.innerHTML = '';
      this.toggleBasket(false);
    })
  }

  putBooksInBasket(teg: Component, tovar: TBookBasket) {
    new CartBasket(teg.root, this.services, tovar);
  }
  toggleBasket(isBasketClear: boolean) {
    if (isBasketClear) {
      this.nullBasket.remove();
      this.fullBasket.render();
    } else {
      this.nullBasket.render();
      this.fullBasket.remove();
    }
  }

}