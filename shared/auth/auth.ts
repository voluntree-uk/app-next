import { NextApiRequest, NextApiResponse } from "next";
import { User, Session } from "@schemas";

export interface Auth {
  /**
   * Returns currently logged in user
   * @return A currently logged in user
   */
  getUser(): Promise<User|null>

  /**
   * Returns currently logged in user given a request object
   * @param request A request object
   */
  getUserByCookie(request: NextApiRequest): Promise<User|null>

  /**
   * Signs in the user given an email address and a password 
   * @param email User account email address
   * @param password User account password
   * @return A boolean representing the success of the method
   */
  signIn(email: string, password: string): Promise<boolean>

  /**
   * Signs up the user given an email address and a password 
   * @param email User account email address
   * @param password User account password
   * @return A user object representing the newly created user
   */
  signUp(email: string, password: string): Promise<User|null>

  /**
   * Signs out the currently logged in user
   * @return A boolean representing the success of the method
   */
  signOut(): Promise<boolean>

  /**
   * Sets an authentication cookie
   * @param req a request object
   * @param res a response object
   */
  setAuthCookie(req: NextApiRequest, res: NextApiResponse): void

  /**
   * Hooks in an auth [Session] object
   * @return A current auth session
   */
  useSession(): Session | null

  /**
   * Updates the cookie value on auth change
   */
  updateCookieOnAuthChange(): void
}