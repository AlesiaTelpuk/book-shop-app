import { Component } from "../Abstact/Component";
import { TServices } from "../Abstact/Type";


export class MainPage extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["main__page"]);
    const container = new Component(this.root, 'div', ["container", "container__main-page"]);
    const page__inner = new Component(container.root, 'div', ["container", "main__page-inner"]);
    new Component(page__inner.root, 'p', ["main__page-paragraf"], "Welcome to our bookshop Bookshop! <br>We are delighted to offer you a wide range of books to suit every taste and interest. You will find both classic literature and the latest releases from contemporary authors. We carefully select each book to satisfy even the most discerning readers. We have various genres, from novels and detective stories to science fiction and non-fiction.<br>We also offer books in foreign languages to help you broaden your horizons. Our team is ready to assist you in choosing and finding a book that suits you perfectly. Visit our website and immerse yourself in the world of captivating reading!");
    new Component(page__inner.root, 'img', null, null, ["src", "alt"], ["./assets/Photo/Photo3d.svg", 'Photo3d']);
    const btn = new Component(container.root, 'a', null, null, ["href"], ["#catalog"])
    new Component(btn.root, 'input', ["mainbutton"], null, ["type", "value"], ["button", "See books"])
  }
}