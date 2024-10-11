import { HelloWorldRepository } from "@app/domain/repository/hello-world-repository";

export class InMemoryHelloWorldRepository implements HelloWorldRepository {
  private data: Record<string, string> = {};

  async store() {
    this.data["hello"] = "world";
  }

  getAll() {
    return this.data;
  }
}
