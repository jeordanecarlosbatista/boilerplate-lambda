import { SQSQueueListener } from "../../src/app/queue/sqs-hello-world-listener";
import { QueueListenerManaged } from "@jeordanecarlosbatista/jcb-aws-sqs";
import { InMemoryHelloWorldRepository } from "./in-memory/in-memory-hello-world-repository";
import { HelloWorldCommand } from "@app/domain/command/hello-world-command";
import { TestSetupManager } from "@jeordanecarlosbatista/test";

// const testSetup = new TestSetupManager({
//   queues: new QueueListenerManaged({
//     pollingInterval: 1000,
//     receiveMaxNumberOfMessages: 1,
//     waitTimeSeconds: 20,
//     queues: [
//       {
//         queueName: "hello-world.fifo",
//         listener: new SQSQueueListener(
//           new HelloWorldCommand(helloWorldRepository)
//         ),
//       },
//     ],
//   }),
// });

// export { testSetup };
