export abstract class HelloWorldRepository {
  abstract store(): Promise<void>;
}
