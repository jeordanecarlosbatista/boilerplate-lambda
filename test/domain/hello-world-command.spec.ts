import { HelloWorldCommand } from "../../src/domain/command/hello-world-command";
import { InMemoryHelloWorldRepository } from "../resource/in-memory/in-memory-hello-world-repository";

describe(HelloWorldCommand.name, () => {
  it("should store a message in the repository", async () => {
    const repository = new InMemoryHelloWorldRepository();
    const command = new HelloWorldCommand(repository);

    await command.execute();

    expect(repository.getAll()).toEqual({ hello: "world" });
  });
});
