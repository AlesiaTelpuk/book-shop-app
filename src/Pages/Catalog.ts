import { Component } from "../Abstact/Component";
import { TBook, TCriteria, TServices } from "../Abstact/Type";
import { BookCart } from "../Common/BookCart";


export class Catalog extends Component {
  criteria: TCriteria = {
    genre: "all",
    price: "up"
  }
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["catalog"]);
    const container = new Component(this.root, 'div', ["container"]);
    const title = new Component(container.root, 'div', ["catalog__title"]);
    new Component(title.root, 'h1', ["h1__title"], "Popular books");

    const select = new Component(title.root, 'select', ["title-img", "select__filter"])
    new Component(select.root, 'option', [], " ", ["disabled", "selected", "hidden"], ["true", "true", "true"])
    new Component(select.root, 'option', [], "психология", ['data-genre'], ["психология"])
    new Component(select.root, 'option', [], "самосовершенствование", ['data-genre'], ["самосовершенствование"])
    new Component(select.root, 'option', [], "роман", ['data-genre'], ["роман"])
    new Component(select.root, 'option', [], "классика", ['data-genre'], ["классика"])
    new Component(select.root, 'option', [], "детектив", ['data-genre'], ["детектив"])
    new Component(select.root, 'option', [], "фантастика", ['data-genre'], ["фантастика"])
    new Component(select.root, 'option', [], "фэнтези", ['data-genre'], ["фэнтези"])
    new Component(select.root, 'option', [], "медицина", ['data-genre'], ["медицина"])
    new Component(select.root, 'option', [], "бизнес", ['data-genre'], ["бизнес"])
    new Component(select.root, 'option', [], "пьеса", ['data-genre'], ["пьеса"])
    new Component(select.root, 'option', [], "менеджмент", ['data-genre'], ["менеджмент"])
    new Component(select.root, 'option', [], "приключения", ['data-genre'], ["приключения"])
    new Component(select.root, 'option', [], "биография", ['data-genre'], ["биография"])
    new Component(select.root, 'option', [], "маркетинг", ['data-genre'], ["маркетинг"])

    select.root.onchange = (event) => {
      const param = (event.target as HTMLSelectElement).value
      this.criteria.genre = param;
      console.log(this.criteria);

      services.dbService.getAllBooks(this.criteria).then((books) => {
        // console.log(books);
        Cartinner.root.innerHTML = '';
        this.putBooksOnPage(Cartinner, books);
      });
    }

    // new Component(title.root, 'img', ["title-img"], null, ["src", "alt"], ["./assets/Icons/Filter.svg", "filter"]);
    // new Component(title.root, 'img', ["title-img"], null, ["src", "alt"], ["./assets/Icons/Sort.svg", "srtirowka"]);
    const btnSort = new Component(title.root, 'input', ["title-img"], null, ["value", "type", "data-price"], [" ", "button", "up"]);

    btnSort.root.onclick = (event) => {
      const param = (event.target as HTMLElement).dataset;
      if (!param.price) return;
      if (param.price) this.criteria.price = param.price;


      services.dbService.getAllBooks(this.criteria).then((books) => {
        // console.log(books);
        Cartinner.root.innerHTML = '';
        this.putBooksOnPage(Cartinner, books);
      });

      if (param.price === 'up') {
        param.price = 'down';
      } else {
        param.price = 'up';
      }
    }

    const Cartbooks = new Component(container.root, 'div', ["cartbooks"]);
    const Cartinner = new Component(Cartbooks.root, 'div', ["cartbooks__inner"]);

    services.dbService.getAllBooks(this.criteria).then((books) => {
      // console.log(books);
      this.putBooksOnPage(Cartinner, books);
    });

  }

  putBooksOnPage(teg: Component, books: TBook[]) {
    books.forEach((product) => {
      new BookCart(teg.root, this.services, product);
    })
  }
}