import { z } from "zod";
import { v4 as uuid } from "uuid";
import { Message } from "@aws-sdk/client-sqs";
import { QueueListener } from "@jeordanecarlosbatista/jcb-aws-sqs";
import { Command } from "@app/domain/command";

export const MessagePayload = z.object({
  message: z.string(),
});
export type MessagePayload = z.infer<typeof MessagePayload>;

export class SQSQueueListener extends QueueListener {
  constructor(private readonly command: Command) {
    super();
  }

  async handleMessage(message: Message): Promise<void> {
    return await this.resolveWith({
      message,
      schema: MessagePayload,
      resolveCallback: async (message) => {
        await this.command.execute(message);
      },
      payloadErrorCallback: async (errors) => {
        return this.toMessageDLQ({
          queueName: "hello-world-dlq.fifo",
          payload: message,
          messageDeduplicationId: uuid(),
          messageGroupId: uuid(),
        });
      },
    });
  }
}
