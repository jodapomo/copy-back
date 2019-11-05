const morgan = require('morgan');
import chalk from 'chalk';

morgan.token('status', (req, res) => {
  const statusCode = res.statusCode;
  const color = getStatusCodeColor(statusCode);
  return chalk[color](statusCode);
});

morgan.token('method', (req, res) => {
  const method = req.method;
  const color = getHttpMethodColor(method);
  return chalk[color].bold(method);
});

morgan.token('date', function getDateToken(req, res, format) {
  const date = new Date();

  switch (format || 'web') {
    case 'iso':
      return chalk.gray(date.toISOString());
    case 'web':
      return chalk.gray(date.toUTCString());
  }
});

const getStatusCodeColor = (code: number): string => {
  return code >= 500 ? 'red' : code >= 400 ? 'yellow' : code >= 300 ? 'cyan' : 'green';
};

const getHttpMethodColor = (method: string): string => {
  switch (method) {
    case 'GET':
      return 'blue';
    case 'POST':
      return 'green';
    case 'PUT':
      return 'yellow';
    case 'PATCH':
      return 'cyan';
    case 'DELETE':
      return 'red';
    default:
      return 'white';
  }
};

export default () =>
  morgan((tokens, req, res) => {
    return [
      tokens.date(req, res),
      '-',
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ');
  });
