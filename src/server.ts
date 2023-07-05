import express, {Request, Response} from 'express';
import dotenv from 'dotenv';

const app = express();
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

dotenv.config();
const port = process.env.SERVER_PORT;


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
// starter endpoints
app.use('/user/account', require('../routes/user/account'));
app.use('/starter/hunter', require('../routes/starter/hunters'))
app.use('/starter/dungeon', require('../routes/starter/dungeons'))

app.use('/adventure/dungeon', require('../routes/adventure/dungeons'));


app.get('/', (req: Request, res: Response) => {
    return res.json({
        message: 'Welcome to The Cosmic Array'
    })
})

app.get('/test', async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();

    return res.json({
        users: users
    })
})

// start the Express server
app.listen(port, () => {
    console.log(`Server is listening on  http://localhost:${port}`);
})