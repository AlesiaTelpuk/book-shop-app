import { Component } from "../Abstact/Component";
import { TDataHistory, TDataHistoryWithId, TServices } from "../Abstact/Type";
import { CartHistory } from "../Common/CartHistory";


export class Orders extends Component {
  divHistory: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["orders"]);
    const container = new Component(this.root, 'div', ["container"]);
    new Component(container.root, 'h1', ["h1__title"], "Orders");

    const divStat = new Component(container.root, 'div', ["stat__data"]);
    const spanCount = new Component(divStat.root, 'span', [], "0");
    const spanSumma = new Component(divStat.root, 'span', [], "0");

    services.dbService.addListener('changeStat', (count, summa) => {
      spanCount.root.innerHTML = `Number of orders: ${count}`;
      spanSumma.root.innerHTML = `The total amount of ransoms:  ${summa} BYN`;
    });

    this.divHistory = new Component(container.root, 'div', ["order__history"]);

    const user = services.authService.user;
    services.dbService.calcCountDocsHistory(user);

    services.dbService.getAllHistory(user).then((historys) => {
      this.putHistoryOnPage(this.divHistory, historys);
    });

    services.dbService.addListener('addInHistory', (history) => {
      this.putHistoryOnPage(this.divHistory, [history as TDataHistoryWithId]);
    });

  }
  putHistoryOnPage(teg: Component, historys: TDataHistoryWithId[]) {
    historys.forEach((history) => {
      new CartHistory(teg.root, this.services, history);
    })
  }
}