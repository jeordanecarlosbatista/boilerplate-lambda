import { config } from "dotenv";
config();

import { QueueListenerManaged } from "@jeordanecarlosbatista/jcb-aws-sqs";
import { SQSQueueListener } from "./app/queue/sqs-hello-world-listener";
import { HelloWorldCommand } from "./domain/command/hello-world-command";
import { InMemoryHelloWorldRepository } from "./app/db/in-memory-hello-world-repository";

const command = new HelloWorldCommand(new InMemoryHelloWorldRepository());

const manager = new QueueListenerManaged({
  pollingInterval: 11000,
  receiveMaxNumberOfMessages: 1,
  waitTimeSeconds: 10,
  queues: [
    {
      queueName: "hello-world.fifo",
      listener: new SQSQueueListener(command),
    },
  ],
});

manager.start();
