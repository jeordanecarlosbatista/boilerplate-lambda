import { Consumer } from "sqs-consumer";
import { SQSClient } from "@aws-sdk/client-sqs";
import { QueueListener } from "@jeordanecarlosbatista/jcb-aws-sqs";

export class QueueListenerManager {
  private readonly consumers: { queueUrl: string; consumer: Consumer }[] = [];

  addListener(queueUrl: string, listener: QueueListener): this {
    const consumer = Consumer.create({
      queueUrl,
      handleMessage: listener.handleMessage.bind(listener),
      sqs: new SQSClient({
        endpoint: process.env.LOCALSTACK_BASE_URL,
        region: process.env.AWS_REGION,
      }),
    });

    this.consumers.push({ queueUrl, consumer });

    return this;
  }

  async startAll(): Promise<void> {
    const startPromises = this.consumers.map(
      ({ queueUrl, consumer }) =>
        new Promise<void>((resolve) => {
          consumer.on("started", () => {
            console.log(`Consumer for queue ${queueUrl} has started`);
            resolve();
          });
          consumer.start();
        })
    );

    await Promise.all(startPromises);
  }

  async stopAll(): Promise<void> {
    console.log("Stopping all consumers...");
    const stopPromises = this.consumers.map(
      ({ queueUrl, consumer }) =>
        new Promise<void>((resolve) => {
          consumer.on("stopped", () => {
            console.log(`Consumer for queue ${queueUrl} has stopped`);
            resolve();
          });
          consumer.stop();
        })
    );

    await Promise.all(stopPromises);
    console.log("All consumers have been stopped");
  }
}
