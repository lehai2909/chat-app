// import { Kafka } from "kafkajs";

// const kafka = new Kafka({
//   clientId: "my-app",
//   brokers: ["localhost:9092"],
// });

// const producer = kafka.producer();

// export async function putMessageOnTopic(message) {
//   await producer.connect();
//   await producer.send({
//     topic: "app-topic",
//     messages: [{ value: message }],
//   });
//   await producer.disconnect();
// }

// export async function loadMessagesFromTopic() {
//   const consumer = kafka.consumer({ groupId: "test-group" });
//   await consumer.connect();
//   await consumer.subscribe({ topic: "my-topic", fromBeginning: false });

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       console.log(`Received message: ${message.value.toString()}`);
//     },
//   });
// }
