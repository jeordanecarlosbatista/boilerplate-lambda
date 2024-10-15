export abstract class HelloWorldRepository {
  abstract store(data: any): Promise<void>;
}
