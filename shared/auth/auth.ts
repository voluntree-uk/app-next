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
   * @return A user object representing the newly created user
   */
  signIn(email: string, password: string): Promise<User|null>

  /**
   * Signs up the user given an email address and a password 
   * @param email User account email address
   * @param password User account password
   * @return A boolean representing the success of the method
   */
  signUp(email: string, password: string): Promise<Boolean>

  /**
   * Signs out the currently logged in user
   * @return A boolean representing the success of the method
   */
  signOut(): Promise<boolean>

  /**
   * Resets user password via email
   * @param email email for which to reset password
   * @param redirectTo a URL location to which to redirect user to
   * @return A boolean representing the success of the method
   */
  resetPassword(email: string, redirectTo: string): Promise<Boolean>

  /**
   * Updates user's password
   * @param password user's new password
   * @return A boolean representing the success of the method
   */
  updatePassword(password: string): Promise<{ success: Boolean, message: string}>

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