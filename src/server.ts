import express, {Request, Response} from 'express';
const port = 3001;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
app.get('/', (req: Request, res: Response) => {

    
    return res.send('Welcome to Dungeon Looters!');
})

// start the Express server
app.listen(port, () => {
    console.log(`Server is listening on  http://localhost:${port}`);
})