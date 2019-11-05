import { Container } from 'typedi';
import { models } from '../models';

export default () => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });
  } catch (e) {
    throw e;
  }
};
