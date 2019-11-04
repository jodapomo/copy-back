import 'reflect-metadata'; // For use of @Decorators

import express from 'express';
import config from './config';

async function startServer() {
  const app = express();

  app.listen(config.port, err => {
    if (err) {
      console.error(err);
      process.exit(1);
      return;
    }
    console.log(`
      #######################################
          Server listening on port: ${config.port} 
      #######################################
    `);
  });
}

startServer();
