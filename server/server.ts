import {app} from './app';
require ('dotenv').config();
import connectDB from './utils/db';

//Server setup

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
})