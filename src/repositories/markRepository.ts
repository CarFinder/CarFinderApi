import * as mongoose from 'mongoose';
import { IMarkModel, Mark } from '../db';
import { IMark } from '../interfaces';
import { handleDatabaseError } from '../utils';

export const update = async (mark: IMark) => {
  const newMark = new Mark(mark);
  const error = await newMark.save(err => {
    if (err) {
      handleDatabaseError(err);
    }
  });
};

export const getAll = async () => {
  return await Mark.find();
};

export const getByName = async (name: string) => {
  return await Mark.findOne({ name });
};

export const getById = async (id: string) => {
  return await Mark.findOne({ _id: id });
};
