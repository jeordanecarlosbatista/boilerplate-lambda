import { v4 as uuid } from "uuid";
import {
  EnqueuerProvider,
  QueueListenerManaged,
  SQSProvider,
} from "@jeordanecarlosbatista/jcb-aws-sqs";
import { retry } from "async";
import { SQSQueueListener } from "@app/app/queue/sqs-hello-world-listener";
import { InMemoryHelloWorldRepository } from "@app/app/db/in-memory-hello-world-repository";
import { TestSetupManager } from "@jeordanecarlosbatista/test";
import { HelloWorldCommand } from "@app/domain/command/hello-world-command";

const makeSut = () => {
  const helloWorldRepository = new InMemoryHelloWorldRepository();
  const enqueuer = EnqueuerProvider.factory();
  const queueProvider = SQSProvider.factory();
  const testSetup = new TestSetupManager({
    listenerManager: new QueueListenerManaged({
      pollingInterval: 1000,
      receiveMaxNumberOfMessages: 1,
      waitTimeSeconds: 20,
      queues: [
        {
          queueName: "hello-world.fifo",
          listener: new SQSQueueListener(
            new HelloWorldCommand(helloWorldRepository)
          ),
        },
      ],
    }),
  });

  return {
    testSetup,
    enqueuer,
    queueProvider,
    helloWorldRepository,
  };
};

describe(SQSQueueListener.name, () => {
  jest.setTimeout(30000);

  it("should process a valid message correctly", async () => {
    const { enqueuer: enqueuer, testSetup, helloWorldRepository } = makeSut();

    const payload = { message: "Hello, World!" };
    await testSetup.run(async () => {
      enqueuer.enqueue({
        queueName: "hello-world.fifo",
        payload,
        messageGroupId: uuid(),
        messageDeduplicationId: uuid(),
      });

      await retry({ times: 30, interval: 300 }, async () => {
        expect(helloWorldRepository.getAll()).toEqual([payload]);
      });
    });
  });

  it("should process a invalid payload correctly", async () => {
    const {
      enqueuer: enqueuer,
      testSetup,
      helloWorldRepository,
      queueProvider,
    } = makeSut();
    const payload = { messages: "Hello, World!" };
    await testSetup.run(async () => {
      enqueuer.enqueue({
        queueName: "hello-world.fifo",
        payload,
        messageGroupId: uuid(),
        messageDeduplicationId: uuid(),
      });

      await retry({ times: 30, interval: 300 }, async () => {
        const { Attributes } = await queueProvider.getQueueAttributes(
          "hello-world-dlq.fifo"
        );
        expect(Attributes?.ApproximateNumberOfMessages).toEqual("1");
      });
    });
  });
});
