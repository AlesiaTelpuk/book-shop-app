import { AuthService } from "../Services/AuthService";
import { DBService } from "../Services/DBService";
import { LogicService } from "../Services/LogicService";

export type TServices = {
  authService: AuthService;
  logicService: LogicService;
  dbService: DBService;
}

export type TBook = {
  name: string,
  author: string,
  price: number,
  genre: string[],
  url: string
}