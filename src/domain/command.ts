export abstract class Command {
  abstract execute(): Promise<void>;
}
