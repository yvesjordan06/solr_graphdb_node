import Koa from 'koa';

import { MainRouter } from './routes/index.js';
import { initServer } from './server/bootstrap.js';


const app = new Koa();

//Starting the prerequest
initServer(app);


app.use(MainRouter())

app.use(async ctx => {
    ctx.body = "First Middleware";
});





app.listen(3000);