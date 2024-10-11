import { v4 as uuid } from "uuid";
import { EnqueuerProvider } from "@jeordanecarlosbatista/jcb-aws-sqs";
import { helloWorldRepository, testSetup } from "@test/resource/test-setup";
import { retry } from "async";
import { SQSQueueListener } from "@app/app/queue/sqs-hello-world-listener";

const makeSut = () => {
  const queueProvider = EnqueuerProvider.factory();

  return {
    queueProvider,
  };
};

describe(SQSQueueListener.name, () => {
  jest.setTimeout(30000);

  it("should process a valid message correctly", async () => {
    await testSetup.run(async () => {
      const { queueProvider } = makeSut();
      queueProvider.enqueue({
        queueName: "hello-world.fifo",
        payload: { message: "Hello, World!" },
        messageGroupId: uuid(),
        messageDeduplicationId: uuid(),
      });

      await retry({ times: 30, interval: 300 }, async () => {
        expect(helloWorldRepository.getAll()).toEqual({ hello: "world" });
      });
    });
  });
});
