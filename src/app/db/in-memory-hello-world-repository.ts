import { HelloWorldRepository } from "@app/domain/repository/hello-world-repository";

export class InMemoryHelloWorldRepository implements HelloWorldRepository {
  private readonly data: Map<string, string> = new Map();

  async store() {
    console.log("Storing data...");
    this.data.set("hello", "world");
  }

  getAll() {
    return this.data.get("hello");
  }
}
