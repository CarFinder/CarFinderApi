import * as mongoose from 'mongoose';
import { IMarkModel, Mark } from '../db';
import { IMark } from '../interfaces';

export const create = async (mark: IMark) => {
  const newMark = new Mark(mark);
  await newMark.save(err => {
    return err;
  });
};
