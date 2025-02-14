import mongoose from 'mongoose';

export const connectDb = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Mongodb connected:',conn.connection.host);
        
    } catch (error) {
        console.log('Failed to connect MongoDb ', error);
    }  
}; 

   