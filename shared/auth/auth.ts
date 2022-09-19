import { User } from "../schemas";

export interface Auth {
  /**
   * Returns currently logged in user
   * @return A currently logged in user
   */
  getUser(): Promise<User>
}