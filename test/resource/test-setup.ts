import { InMemoryHelloWorldRepository } from "@app/app/db/in-memory-hello-world-repository";
import { SQSQueueListener } from "@app/app/queue/sqs-hello-world-listener";
import { HelloWorldCommand } from "@app/domain/command/hello-world-command";
import { QueueListenerManaged } from "@jeordanecarlosbatista/jcb-aws-sqs";
import {
  IntegrationTestManage,
  TestSetupSQS,
} from "@jeordanecarlosbatista/test";

export const helloWorldRepository = new InMemoryHelloWorldRepository();

class TestSetup extends IntegrationTestManage {
  constructor() {
    super();
  }

  queue() {
    return new TestSetupSQS({
      listenerManager: new QueueListenerManaged({
        pollingInterval: 1000,
        receiveMaxNumberOfMessages: 1,
        waitTimeSeconds: 20,
        queues: [
          {
            queueName: "hello-world.fifo",
            dql: {
              queueName: "hello-world-dlq.fifo",
            },
            listener: new SQSQueueListener(
              new HelloWorldCommand(helloWorldRepository)
            ),
          },
        ],
      }),
    });
  }

  async setup(callback: () => Promise<void>) {
    await this.queue().run();
    super.run(async () => {}).finally(async () => {});
  }
}

export { TestSetup };
