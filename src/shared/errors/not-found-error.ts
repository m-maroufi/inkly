import { AppError } from "./app-error";

export class NotFoundError extends AppError {
  constructor(messsage = "Resource Not found") {
    super(messsage, 404);
    this.name = "NotFoundError";
  }
}
