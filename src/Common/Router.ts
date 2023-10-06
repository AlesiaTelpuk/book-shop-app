import { getAuth } from "firebase/auth";
import { Component } from "../Abstact/Component";

export class Router {
  constructor(public links: Record<string, Component>) {
    this.openPage();

    window.onhashchange = () => {
      this.openPage();
    }
  }

  openPage() {
    Object.values(this.links).forEach((el) => el.remove());

    const url = window.location.hash.slice(1);

    const auth = getAuth();
    const user = auth.currentUser;

    if (url === 'reviews' && !user) {
      this.links['#authorization'].render();
    } else {
      this.links['#' + url].render();
    }
  }
}