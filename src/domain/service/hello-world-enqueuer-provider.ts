export interface HelloWorldEnqueuerProvider {
  enqueue(message: object): Promise<void>;
}
