import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
import colors from 'colors'
import users from './data/user.js'
import locations from './data/location.js'
// import chats from './data/data.js'
import User from './models/userModel.js'
import Location from "./models/locationModel.js";
// import Chat from "./models/chatModel.js";
import connectDB from './config/db.js'

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Location.deleteMany();
        // await Chat.deleteMany();
        // await Estate.deleteMany();

        const createdUsers = await User.insertMany(users);
        const createdLocations = await Location.insertMany(locations);
        const adminUser = createdUsers[0]._id;
        // const createChats = await Chat.insertMany(chats)

    //     await Estate.insertMany(estates);
        console.log('Data Imported'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async() => {
    try {
        await User.deleteMany();
        // await Chat.deleteMany()
        // await Estate.deleteMany();

        console.log('Data Destroyed'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if(process.argv[2] === '-d'){
    destroyData();
}else{
    importData();
};
