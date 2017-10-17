import * as mongoose from 'mongoose';
import { IMarkModel, Mark } from '../db';
import { IMark } from '../interfaces';

export const update = async (mark: IMark) => {
  const newMark = new Mark(mark);
  await newMark.save(err => {
    return err;
  });
};

export const getAll = async () => {
  return await Mark.find();
};
