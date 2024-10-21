/**
 * class Validation
 */
export default class Validation {
  sucess: boolean;
  message: string;

  /**Creates a new Validation Object
   * @param sucess If the validation was sucessful
   * @param message The validation message, if it failed
   */
  constructor(sucess: boolean = true, message: string = "") {
    this.sucess = sucess;
    this.message = message;
  }
}
