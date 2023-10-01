import { Component } from './Abstact/Component';
import { Footer } from './Common/Footer';
import { Header } from './Common/Header';
import { MainPage } from './Pages/MainPage';
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
    new MainPage(wrap.root);
    new Footer(wrap.root);
  }
}

declare global {
  interface Window {
    app: App;
  }
}
window.app = new App(document.body);