import { Container } from 'typedi';
import { models } from '../models';

export default () => {
  try {
    models.forEach(model => {
      Container.set(model.name, model.model);
    });
  } catch (e) {
    throw e;
  }
};
