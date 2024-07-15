import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined');
    }
    if(!process.env.MONGO_URI){
        throw new Error ('Mongo URI must be defined');
    }
    if(!process.env.RABBITMQ_USERNAME){
        throw new Error('RabbitMQ username must be defined');
    }
    if(!process.env.RABBITMQ_PASSWORD){
        throw new Error ('RabbitMQ password must be defined');
    }

    try{
        await mongoose.connect(process.env.MONGO_URI);    
        console.log("League Service connected to MongoDb");   
    } catch(err){
        console.log(err);
    }
    app.listen(3000, () => {
        console.log('Listening on port 3000!!');
    });
};

start();