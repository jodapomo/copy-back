import 'reflect-metadata';
import express from 'express';
import http from 'http';
import chalk from 'chalk';
import config from './config';

async function startServer() {
  const app = express();
  const server = new http.Server(app);

  const log = console.log;

  await require('./loaders').init({ expressApp: app, httpServer: server });

  server.listen(config.port, (err: any) => {
    if (err) {
      log(err);
      process.exit(1);
      return;
    }

    log(`
          Server listening on port: ${chalk.green(String(config.port))} 
    `);
  });
}

startServer();
