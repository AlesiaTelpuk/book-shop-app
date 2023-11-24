import { Component } from "../Abstact/Component";
import { TBookBasket, TDataHistory, TDataHistoryWithId, TServices } from "../Abstact/Type";

export class CartHistory extends Component {
  divBooks: Component;
  constructor(parrent: HTMLElement, private services: TServices, private data: TDataHistoryWithId) {
    super(parrent, 'div', ["cart__history"])

    // const inner = new Component(this.root, 'div', ["cart_history__inner"]);
    const divOrder = new Component(this.root, 'div', ["cart_history__orders"]);
    const numOrder = new Component(divOrder.root, 'div', [])
    new Component(numOrder.root, 'span', ["histori__number"], "Order №: ");
    new Component(numOrder.root, 'span', [], data.id);
    new Component(divOrder.root, 'span', ["history__date"], data.date.toDate().toLocaleDateString("ru"));

    this.divBooks = new Component(this.root, 'div', ["cart__history__books"]);
    data.basket.forEach(bookBasket => {
      const divBook = new Component(this.divBooks.root, 'div', ["cart__history__book"]);
      new Component(divBook.root, 'img', ["cart__history-img"], null, ["src", "alt"], [bookBasket.book.url, "ghjk"]);
      new Component(divBook.root, 'span', ["cart__history__name"], bookBasket.book.name);
      new Component(divBook.root, 'span', [], `Prise: ${services.dbService.calcCostBook(bookBasket.count, Number(bookBasket.book.price))} BYN`);
    })

    const divData = new Component(this.root, 'div', ["cart__history__data"]);
    new Component(divData.root, 'span', [], `Summa: ${data.dataBasket.summa} BYN`);
    new Component(divData.root, 'span', [], `Percent: ${data.dataBasket.percent}%`);
    new Component(divData.root, 'span', [], `Total: ${data.dataBasket.allSumma} BYN`);

    // services.dbService.addListener('addInHistory',(history)=>)
  }
}