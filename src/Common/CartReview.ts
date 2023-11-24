import { Component } from "../Abstact/Component";
import { TBookBasket, TDataHistory, TDataHistoryWithId, TReviews, TServices } from "../Abstact/Type";

export class CartReview extends Component {
  // divBooks: Component;
  constructor(parrent: HTMLElement, private data: TReviews) {
    super(parrent, 'div', ["cart__review"])

    // const inner = new Component(this.root, 'div', ["cart_history__inner"]);
    const divReview = new Component(this.root, 'div', ["cart__reviews"]);
    const rowUser = new Component(divReview.root, 'div', ["cart__reviewrow"]);
    new Component(rowUser.root, 'img', [], null, ["src", "alt"], ["./assets/Icons/Person1.svg", ""])
    new Component(rowUser.root, 'span', [], `${data.username}`);
    new Component(divReview.root, 'span', [], `${data.comment}`);
    // services.dbService.addListener('addInHistory',(history)=>)
  }
}