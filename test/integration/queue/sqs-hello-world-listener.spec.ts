import { v4 as uuid } from "uuid";
import {
  EnqueuerProvider,
  SQSProvider,
} from "@jeordanecarlosbatista/jcb-aws-sqs";
import { retry } from "async";
import { SQSQueueListener } from "@app/app/queue/sqs-hello-world-listener";
import { helloWorldRepository, TestSetup } from "@test/resource/test-setup";

const makeSut = () => {
  const enqueuer = EnqueuerProvider.factory();
  const queueProvider = SQSProvider.factory();

  const testSetup = new TestSetup();

  return {
    testSetup,
    enqueuer,
    queueProvider,
  };
};

describe(SQSQueueListener.name, () => {
  jest.setTimeout(30000);

  it("should process a valid message correctly", async () => {
    const { enqueuer: enqueuer, testSetup } = makeSut();
    const payload = { message: "Hello, World!" };
    const queue = testSetup.queue();
    // TODO: Refactor this to a helper function
    await queue.run();
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
      // TODO: Refactor this to a helper function
      await queue.purgeQueues();
      await queue.tearDown();
    });
  });

  it("should process a invalid payload correctly", async () => {
    const { enqueuer: enqueuer, testSetup, queueProvider } = makeSut();
    const payload = { messages: "Hello, World!" };
    const queue = testSetup.queue();

    // TODO: Refactor this to a helper function
    await queue.run();
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
      // TODO: Refactor this to a helper function
      await queue.purgeQueues();
      await queue.tearDown();
    });
  });
});
