import Logger from './core/Logger';
import app from './app';
import { port } from './config';

app
  .listen(port, () => {
    Logger.info(`server running on port : ${port}`);
  })
  .on('error', (e) => Logger.error(e));
