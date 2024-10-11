import { v4 as uuid } from "uuid";
import { Enqueuer } from "@jeordanecarlosbatista/jcb-aws-sqs/dist/enqueuer";
import { HelloWorldEnqueuerProvider } from "../../domain/service/hello-world-enqueuer-provider";

export class SQSHelloWorldEnqueuerProvider
  implements HelloWorldEnqueuerProvider
{
  constructor(private readonly enqueuer: Enqueuer) {}

  async enqueue(message: object): Promise<void> {
    this.enqueuer.enqueue({
      queueName: "hello-world.fifo",
      payload: message,
      messageDeduplicationId: uuid(),
      messageGroupId: uuid(),
    });
  }
}
