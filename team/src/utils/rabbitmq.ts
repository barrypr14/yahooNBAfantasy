// rabbitmq.ts
import amqp, { Connection } from 'amqplib';
import { updateDB } from './updateDB';

let connection: Connection | null = null;

const connectRabbitMQ = async () => {
  if (!process.env.RABBITMQ_DEFAULT_USER || !process.env.RABBITMQ_DEFAULT_PASS) {
    throw new Error('RabbitMQ credentials must be defined');
  }

  try {
    connection = await amqp.connect(`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@rabbitmq-srv:5672`);
  } catch (err) {
    throw new Error("Can't connect to rabbitmq");
  }
};

const rabbitmqListener = async () => {
    if (!connection) {
        throw new Error('RabbitMQ connection is not established');
    }

    const channel = await connection.createChannel();
    if(!channel){
        throw new Error('create channel error')
    }
    const exchange = "league_create";
    const queue = "team_service_queue";

    await channel.assertExchange(exchange, 'fanout', { durable: true});
    const q = await channel.assertQueue(queue, {durable: true});

    await channel.bindQueue(q.queue, exchange, '');

    channel.consume(q.queue, async (msg) => {
        if(msg && msg.content){
            const data = msg.content.toString();
            console.log("in listener: ", data);

            // Convert into JSON and update the Team Datebase
            const event = JSON.parse(data);
            await updateDB(event.access_token, event.league_prefix, event.league_id);

            channel.ack(msg);
        }
    })
}

export { connectRabbitMQ, rabbitmqListener };
