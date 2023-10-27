import { Component } from "../Abstact/Component";
import { TBook, TServices } from "../Abstact/Type";
import { BookCart } from "../Common/BookCart";


export class Catalog extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["catalog"]);
    const container = new Component(this.root, 'div', ["container"]);
    const title = new Component(container.root, 'div', ["catalog__title"]);
    new Component(title.root, 'h1', ["h1__title"], "Popular books");
    new Component(title.root, 'img', ["title-img"], null, ["src", "alt"], ["./assets/Icons/Filter.svg", "filter"]);
    new Component(title.root, 'img', ["title-img"], null, ["src", "alt"], ["./assets/Icons/Sort.svg", "srtirowka"]);

    const Cartbooks = new Component(container.root, 'div', ["cartbooks"]);
    const Cartinner = new Component(Cartbooks.root, 'div', ["cartbooks__inner"]);

    services.dbService.getAllBooks().then((books) => {
      console.log(books);
      this.putBooksOnPage(Cartinner, books);
    });

  }

  putBooksOnPage(teg: Component, books: TBook[]) {
    books.forEach((product) => {
      new BookCart(teg.root, this.services, product);
    })
  }
}