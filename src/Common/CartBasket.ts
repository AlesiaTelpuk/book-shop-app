import { Component } from "../Abstact/Component";
import { TBook, TBookBasket, TServices } from "../Abstact/Type";

export class CartBasket extends Component {
  // btnInBasket: Component;
  btnDel: Component;
  spanCount: Component;
  // spanSumma: Component;
  constructor(parrent: HTMLElement, private services: TServices, private data: TBookBasket) {
    super(parrent, 'div', ["cart"]);

    const cart = new Component(this.root, 'div', ["cart__inner-basket"]);

    const info = new Component(cart.root, 'div', ["basket__info"]);
    new Component(info.root, 'img', ["book-img"], null, ["src", "alt"], [data.book.url, data.book.name]);
    new Component(info.root, 'p', ["book__price"], data.book.price + " BYN");
    new Component(info.root, 'p', ["book__name"], data.book.name);
    new Component(info.root, 'p', ["book__author"], data.book.author);

    const btnFromBasket = new Component(cart.root, 'div', ["btn__basket-del"]);
    this.btnDel = new Component(btnFromBasket.root, 'input', ["btn-delfrombasket"], null, ["value", "type"], ["", "button"]);
    this.btnDel.root.onclick = () => {
      this.delBookFromBasket();
    }

    const calc = new Component(info.root, 'div', ["btn__basket-calc"]);
    const btnDec = new Component(calc.root, 'input', ["cart__basket-calcDel"], null, ["value", "type"], ["-", "button"]);
    btnDec.root.onclick = () => {
      this.changeCountBook(-1);
    }

    this.spanCount = new Component(calc.root, 'span', ["count__basket"], `${data.count}`);

    const btnInk = new Component(calc.root, 'input', ["cart__basket-calcAdd"], null, ["value", "type"], ["+", "button"]);
    btnInk.root.onclick = () => {
      this.changeCountBook(1);
    }

    // this.spanSumma = new Component(info.root, 'span', null, `${services.dbService.calcCostBook(data.count, Number(data.book.price))}`)
  }

  changeCountBook(grad: number) {
    const newCount = this.data.count + grad;
    if (newCount <= 0) return;

    const newData = {} as TBookBasket;
    Object.assign(newData, this.data);
    newData.count = newCount;

    const user = this.services.authService.user;
    this.services.dbService.changeBookInBasket(user, newData).then(() => {
      Object.assign(this.data, newData);
      this.spanCount.root.innerHTML = `${this.data.count}`;
      // this.spanSumma.root.innerHTML = `${this.services.dbService.calcCostBook(this.data.count, Number(this.data.book.price))}`;
    });
  }

  delBookFromBasket() {
    const user = this.services.authService.user;
    this.services.dbService.
      delBookFromBasket(user, this.data)
      .then(() => {
        this.remove();
      })
      .catch(() => { });
  }
}