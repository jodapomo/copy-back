import expressLoader from './express';
import socketsLoader from './sockets';
import mongooseLoader from './mongoose';
import loggerLoader from './logger';
import dependencyInjectorLoader from './dependencyInjector';
import chalk from 'chalk';

export const init = async ({ expressApp, httpServer }) => {
  const log = console.log;

  try {
    await mongooseLoader();
    log(`✔ Mongodb: ${chalk.green('ready')}`);
  } catch (error) {
    log(`✖ Mongodb: ${chalk.red('error')}`);
    log(error);
  }

  dependencyInjectorLoader();
  log(`✔ Dependencies: ${chalk.green('injected')}`);

  socketsLoader(httpServer);
  log(`✔ Sockets: ${chalk.green('loaded')}`);

  const logger = loggerLoader();
  log(`✔ Logger: ${chalk.green('loaded')}`);

  expressLoader({ app: expressApp, logger });
  log(`✔ Express: ${chalk.green('loaded')}`);
};
