// Installed Utils
import mongoose from 'mongoose';

const mongoDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_DB ?? '');
        console.log('Database connected successfully.');
    } catch (error) {
        console.log(error);
        process.exit(1)
    }

}

export default mongoDB;