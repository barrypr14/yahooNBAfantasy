import mongoose from 'mongoose';
import { app } from './app';
import { connectRabbitMQ, publishLeageCreateEvent, rabbitmqListener } from './utils/rabbitmq';

const start = async () => {
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined');
    }
    if(!process.env.MONGO_URI){
        throw new Error ('Mongo URI must be defined');
    }

    try{
        await mongoose.connect(process.env.MONGO_URI);    
        console.log("League Service connected to MongoDb");   
    } catch(err){
        console.log(err);
    }

    try{
        await connectRabbitMQ();
        // await publishLeageCreateEvent("league_create", {"access_token": "0000", "league_prefix": "428", "league_id": ["27006", "1976009"]});
        console.log("League Service connected to RabbitMQ!!");
    } catch(err){
        console.log(err);
    }
    
    rabbitmqListener();
    app.listen(3000, () => {
        console.log('Listening on port 3000!!');
    });
};

start();