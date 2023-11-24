import { Timestamp } from "firebase/firestore";
import { AuthService } from "../Services/AuthService";
import { DBService } from "../Services/DBService";
import { LogicService } from "../Services/LogicService";

export type TServices = {
  authService: AuthService;
  logicService: LogicService;
  dbService: DBService;
}

export type TBook = {//переменная для карточки книги
  name: string,
  author: string,
  price: string,
  genre: string[],
  url: string,
  favorite: boolean,
  rating: string,
  id: string
}

export type TBookBasket = {//переменная для карточки книги в корзине
  book: TBook,
  count: number
}
export type TBookFavorite = {//переменная для карточки в избранных книгах
  book: TBook,
}

export type TDataUser = {//переменная для пользователя
  name: string,
  fotoUrl: string,
  email: string,
  basket: TBookBasket[],
  favorite: TBookFavorite[]
}

export type TCriteria = {//переменная для критерий фильтрации и сортировки
  genre: string,
  price: string
}

export type TDataBasket = {//переменная для вычисления стоимости корзины
  summa: number,
  percent: number,
  allSumma: number,
  count: number
}

export type TDataHistory = {//переменная для оформленного заказа
  basket: TBookBasket[],
  dataBasket: TDataBasket,
  date: Timestamp,
}
export type TDataHistoryWithId = {//переменная для оформленного заказа с id
  basket: TBookBasket[],
  dataBasket: TDataBasket,
  date: Timestamp,
  id: string,
}

export type TDataGraph = {
  x: Date,
  y: number
}
export type TReviews = {
  comment: string,
  username: string,
  // date: Timestamp
}
