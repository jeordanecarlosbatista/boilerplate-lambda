import { HelloWorldRepository } from "../repository/hello-world-repository";

export class HelloWorldCommand {
  constructor(private readonly repository: HelloWorldRepository) {}

  async execute(data: any): Promise<void> {
    return this.repository.store(data);
  }
}
