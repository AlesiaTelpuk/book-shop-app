import { Component } from './Abstact/Component';
import { Footer } from './Common/Footer';
import { Router } from './Common/Router';
import { Header } from './Common/Header';
import { MainPage } from './Pages/MainPage';
import { Account } from './Pages/Account';
import { Authorization } from './Pages/Authorization';
import { Reviews } from './Pages/Reviews';
import { Catalog } from './Pages/Catalog';
import { Basket } from './Pages/Basket';
import './style.scss';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../configFB";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { TServices } from './Abstact/Type';
import { AuthService } from './Services/AuthService';
import { LogicService } from './Services/LogicService';
import { getFirestore } from 'firebase/firestore';
import { DBService } from './Services/DBService';


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
const DBFirestore = initializeApp(firebaseConfig);
const db = getFirestore(DBFirestore);

const services = {
  authService: new AuthService(),
  logicService: new LogicService(),
  dbService: new DBService(DBFirestore)
};

class App {
  constructor(parrent: HTMLElement) {
    const wrap = new Component(body, 'div', ["wrapper"]);
    new Header(wrap.root, services);
    const main = new Component(wrap.root, "main");

    const links = {
      "#": new MainPage(main.root, services),
      "#catalog": new Catalog(main.root, services),
      "#account": new Account(main.root, services),
      "#basket": new Basket(main.root, services),
      "#authorization": new Authorization(main.root, services),
      "#reviews": new Reviews(main.root, services)
    };

    new Router(links, services);
    new Footer(wrap.root);
  }
}

declare global {
  interface Window {
    app: App;
  }
}


const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  services.authService.user = user;
  services.dbService
    .getDataUser(user)
    .then(() => {
      if (!window.app) window.app = new App(document.body);
    })
    .catch((error) => {
      console.log(error);
    });
});

