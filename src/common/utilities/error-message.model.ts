export class AppErrorMessage {
  message: string;
  messageKey: string;

  private constructor(message: string, messageKey: string = '') {
    this.message = message;
    this.messageKey = messageKey;
  }

  static create(message: string, messageKey: string = '') {
    return new AppErrorMessage(message, messageKey);
  }
}
