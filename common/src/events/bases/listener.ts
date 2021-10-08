import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "../types/subjects";

// generic event interface
export interface Event {
  subject: Subjects;
  data: any;
}
// abstract STAN listner class
export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  // object that subscripts to the NATS publisher
  protected client: Stan;
  // protect here means subclass can define it
  protected ackWait = 5000; //5 seconds

  constructor(client: Stan) {
    this.client = client;
  }
  subscriptionOptions() {
    return (
      this.client
        // Returns a SubscriptionOptions initialized to defaults
        .subscriptionOptions()
        // Configures the subscription to require manual acknowledgement of messages using Message#acknowledge.
        .setManualAckMode(true)
        // Sets the number of milliseconds before a message is considered unacknowledged by the streaming server.
        .setAckWait(this.ackWait)
        // Configures the subscription to replay from first available message.
        .setDeliverAllAvailable()
        // use queue group name as the Subscription Durable name
        .setDurableName(this.queueGroupName)
    );
  }

  // listens to the subscription
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      // abstract method that the subclass can modify
      // receives both Message and the parseData
      this.onMessage(parsedData, msg);
    });
  }

  // parses the Message
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data) //parses string
      : JSON.parse(data.toString("utf8")); //parses buffer
  }
}
