import { HelloWorldRepository } from "@app/domain/repository/hello-world-repository";

export class InMemoryHelloWorldRepository implements HelloWorldRepository {
  private readonly data: Map<string, string> = new Map();

  async store(data: any) {
    this.data.set(data.id, data);
  }

  getAll() {
    return Array.from(this.data.values());
  }
}
