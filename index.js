// * Bağımlılıklar
// * Addictions
import "dotenv/config";
import Fastify from "fastify";
import amqp from "amqplib";

// * Yapılandırma
// * Config
const fastify = Fastify({
  logger: {
    level: process.env.FASTIFY_LOGGER || "warn",
  },
});
const rabbitUrl = `amqp://${process.env.RABBITMQ_CONNET || "localhost"}`;
const queueName = process.env.QUEUE_NAME || "tasks";

// * RabbitMQ bağlantısı oluşturma ve kuyruk oluşturma
// * RabbitMQ connection creation and queue creation
const connectRabbitMQ = async () => {
  const connection = await amqp.connect(rabbitUrl);
  const channel = await connection.createChannel();

  // * Kuyruğu RAM'de tutma
  // * Keeping the queue in RAM
  await channel.assertQueue(queueName);

  // * Kuyruk Dayanıklılığı - Diske kaydetme
  // * Queue Durability - Saving to disk
  // await channel.assertQueue(queueName, { durable: true });

  return channel;
};

// * Fastify sunucusunu başlatma
// * Starting the Fastify server
fastify.get("/addTask", async (request, reply) => {
  const { task } = request.query;

  if (!task) {
    reply.code(400).send("Task parameter is required.");
    return;
  }

  const channel = await connectRabbitMQ();

  // * RAM'de tutma
  // * Keep in RAM
  channel.sendToQueue(queueName, Buffer.from(task));

  // * Mesaj Dayanıklılığı - Diske kaydetme
  // * Message Durability - Saving to disk
  // channel.sendToQueue(queueName, Buffer.from(task), { persistent: true });

  reply.send("Task added to queue.");
});

// * Taskları işleme
// * Processing tasks
fastify.get("/processTask", async (request, reply) => {
  const channel = await connectRabbitMQ();

  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      // * Kuyruktaki task işlenir
      // * The task in the queue is processed
      console.log("Received task:", msg.content.toString());

      // * Task kuyruktan kaldırılır
      // * Task is removed from the queue
      channel.ack(msg);
    }
  });

  // * response
  reply.send("Processing tasks from queue.");
});

// * İş sayısını verir
// * Returns the number of jobs
fastify.get("/tasks", async (request, reply) => {
  const channel = await connectRabbitMQ();

  await channel.assertQueue(queueName);

  const { messageCount } = await channel.checkQueue(queueName);

  reply.send(`Number of tasks in queue: ${messageCount}`);
});

// * Sunucuyu belirtilen port üzerinden başlatma
// * Starting the server on the specified port
fastify.listen({ port: process.env.PORT || 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
