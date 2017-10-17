import { positiveNumsRegExp, yearRegExp } from '../';
import { codeErrors } from '../../config/config';
import { RequestError } from '../errors';

export const validateFilterRequest = (req: any) => {
  if (!req.filter || !req.filter.markId) {
    throw new RequestError(codeErrors.REQUIRED_FIELD);
  }
  if (req.limit && !positiveNumsRegExp.test(req.limit)) {
    throw new RequestError(codeErrors.VALIDATION_ERROR);
  }
  if (req.skip && !positiveNumsRegExp.test(req.skip)) {
    throw new RequestError(codeErrors.VALIDATION_ERROR);
  }
  if (req.filter.yearFrom && !yearRegExp.test(req.filter.yearFrom)) {
    throw new RequestError(codeErrors.VALIDATION_ERROR);
  }
  if (req.filter.yearTo && !yearRegExp.test(req.filter.yearTo)) {
    throw new RequestError(codeErrors.VALIDATION_ERROR);
  }
  if (req.filter.yearFrom && req.filter.yearTo && req.filter.yearFrom > req.filter.yearTo) {
    throw new RequestError(codeErrors.VALIDATION_ERROR);
  }
  if (req.filter.priceFrom && !positiveNumsRegExp.test(req.filter.priceFrom)) {
    throw new RequestError(codeErrors.VALIDATION_ERROR);
  }
  if (req.filter.priceTo && !positiveNumsRegExp.test(req.filter.priceTo)) {
    throw new RequestError(codeErrors.VALIDATION_ERROR);
  }
  if (req.filter.priceFrom && req.filter.priceTo && req.filter.priceFrom > req.filter.priceTo) {
    throw new RequestError(codeErrors.VALIDATION_ERROR);
  }
  if (req.filter.kmsFrom && !positiveNumsRegExp.test(req.filter.kmsFrom)) {
    throw new RequestError(codeErrors.VALIDATION_ERROR);
  }
  if (req.filter.kmsTo && !positiveNumsRegExp.test(req.filter.kmsTo)) {
    throw new RequestError(codeErrors.VALIDATION_ERROR);
  }
  if (req.filter.kmsFrom && req.filter.kmsTo && req.filter.kmsFrom > req.filter.kmsTo) {
    throw new RequestError(codeErrors.VALIDATION_ERROR);
  }
};
