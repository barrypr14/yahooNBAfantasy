// rabbitmq.ts
import amqp, { Connection } from 'amqplib';

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

const publishLeageCreateEvent = async (exchange: string, msg: string) => {
  try{
    if (!connection) {
      throw new Error('RabbitMQ connection is not established');
    }
  
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, 'fanout', { durable: true});
    channel.publish(exchange, '', Buffer.from(JSON.stringify(msg)));
    console.log('send the msg ', msg);

  } catch (error) {
      console.log(error);
  }
}

const rabbitmqListener = async () => {
  if (!connection) {
      throw new Error('RabbitMQ connection is not established');
  }

  const channel = await connection.createChannel();
  if(!channel){
      throw new Error('create channel error')
  }
  const exchange = "update";
  const queue = "league_service_queue";

  await channel.assertExchange(exchange, 'fanout', { durable: true});
  const q = await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(q.queue, exchange, '');

  channel.consume(q.queue, (msg) => {
      if(msg && msg.content){
          console.log("in listener: ", msg.content.toString());

          channel.ack(msg);
      }
  })
}

export { connectRabbitMQ, publishLeageCreateEvent, rabbitmqListener };
