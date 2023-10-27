import { Component } from "../Abstact/Component";
import { TBook, TServices } from "../Abstact/Type";


export class BookCart extends Component {
  constructor(parrent: HTMLElement, services: TServices, data: TBook) {
    super(parrent, 'div', ["cart"]);
    const cart = new Component(this.root, 'div', ["cart__inner"])

    new Component(cart.root, 'img', ["book-img"], null, ["src", "alt"], [data.url, data.name]);


    new Component(cart.root, 'p', ["book__price"], data.price.toString() + " BYN");
    new Component(cart.root, 'p', ["book__name"], data.name);
    new Component(cart.root, 'p', ["book__author"], data.author);
    // new Component(this.root, 'p', ["book__genre"], "Genre: " + data.genre.join(', '));
    // new Component(this.root, 'p', ["book__genre"], data.genre.reduce((s, el) => "Genre: " + s + ", " + el));
    const buttons = new Component(this.root, 'div', ["cart__buttons"])

    const btnLike = new Component(buttons.root, 'button', ["btn-basket"]);
    new Component(btnLike.root, 'img', ["cartbook-btn"], null, ["src", "alt"], ["./assets/Icons/Like.svg", "Like"]);

    const btnBasket = new Component(buttons.root, 'button', ["btn-basket"]);
    new Component(btnBasket.root, 'img', ["cartbook-btn"], null, ["src", "alt"], ["./assets/Icons/Basket+.svg", "Basket"]);
  }
}