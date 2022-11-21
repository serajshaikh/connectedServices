import express, { Express} from 'express';
import bodyParser from 'body-parser';
import userRout from './routes/user'
import dotenv from 'dotenv';
dotenv.config();
const app:Express = express();
app.use(express.json());
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(userRout.router);

app.listen(port, () => {
  console.log(`⚡️[server]: Port: ${port}`);
});
