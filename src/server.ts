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
app.use('/user/account', require('../routes/user/account'));
app.use('/starter/hunter', require('../routes/starter/hunters'))
app.use('/starter/dungeon', require('../routes/starter/dungeons'))

app.get('/', (req: Request, res: Response) => {
    return res.json({
        message: 'Welcome to The Cosmic Array'
    })
})

app.get('/test', async (req: Request, res: Response) => {
    const users = await prisma.user.findMany()

    const hunter = await prisma.hunter.findFirst({
        where: {
            name: 'cool hunter'
        }
    })


    return res.json({
        users,
        hunter
    })
})

// start the Express server
app.listen(port, () => {
    console.log(`Server is listening on  http://localhost:${port}`);
})