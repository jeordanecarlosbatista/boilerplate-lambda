export abstract class Command {
  abstract execute(data: any): Promise<void>;
}
