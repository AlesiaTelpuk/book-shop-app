import { Component } from './Abstact/Component';
import { Footer } from './Common/Footer';
import { Router } from './Common/Router';
import { Header } from './Common/Header';
import { MainPage } from './Pages/MainPage';
import { Account } from './Pages/Account';
import { Reviews } from './Pages/Reviews';
import { Catalog } from './Pages/Catalog';
import { Basket } from './Pages/Basket';
import './style.scss';

const body = document.body;
/*const btn1 = new Component(body, 'input', ["btnspace"], null, ["type", "value"], ["button", "Отобразить"]);
const btn2 = new Component(body, 'input', ["btnspace"], null, ["type", "value"], ["button", "Удалить"]);
const prg = new Component(body, 'p', null, 'I prefer you');
btn2.root.onclick = () => {
  prg.remove();
}
btn1.root.onclick = () => {
  prg.render();
}*/

class App {
  constructor(parrent: HTMLElement) {
    const wrap = new Component(body, 'div', ["wrapper"]);
    new Header(wrap.root);
    const main = new Component(wrap.root, "main");

    const links = {
      "#": new MainPage(main.root),
      "#catalog": new Catalog(main.root),
      "#basket": new Basket(main.root),
      "#account": new Account(main.root),
      "#reviews": new Reviews(main.root)
    };

    new Router(links);
    new Footer(wrap.root);
  }
}

declare global {
  interface Window {
    app: App;
  }
}
window.app = new App(document.body);