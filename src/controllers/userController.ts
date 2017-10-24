import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as passport from 'koa-passport';
import { codeErrors } from '../config/config';
import { IUser } from '../interfaces/';
import {
  confirmUserEmail,
  registerUser,
  restoreUserPassword,
  sendRestorePasswordEmail,
  updateUserProfile
} from '../services/';
import { emailRegExp, getToken, nameRegExp, passwordRegExp } from '../utils';
import { SecureError } from '../utils/errors';

export const signUp = async (ctx: Koa.Context) => {
  try {
    const userData = ctx.request.body;
    if (
      !emailRegExp.test(userData.email) ||
      !nameRegExp.test(userData.name) ||
      !passwordRegExp.test(userData.password)
    ) {
      throw new SecureError(codeErrors.VALIDATION_ERROR);
    }
    await registerUser(ctx.request.body);
    ctx.status = HttpStatus.CREATED;
  } catch (err) {
    ctx.status = HttpStatus.CONFLICT;
    ctx.body = {
      error: err.data
    };
  }
};

export const confirmEmail = async (ctx: Koa.Context) => {
  try {
    const user = await confirmUserEmail(ctx.request.body);
    const token = getToken(user);
    ctx.status = HttpStatus.OK;
    ctx.body = {
      token
    };
  } catch (error) {
    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body = { error: error.data };
  }
};

export const signin = async (ctx: Koa.Context) => {
  ctx.status = HttpStatus.OK;
  ctx.body = { token: getToken(ctx.state.user) };
};

export const forgotPassword = async (ctx: Koa.Context) => {
  const userData = ctx.request.body;
  try {
    if (!emailRegExp.test(userData.email)) {
      throw new SecureError(codeErrors.VALIDATION_ERROR);
    }
    await sendRestorePasswordEmail(userData.email);
    ctx.status = HttpStatus.OK;
  } catch (error) {
    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body = { error: error.data };
  }
};

export const restorePassword = async (ctx: Koa.Context) => {
  const userData = ctx.request.body.data;
  try {
    if (!passwordRegExp.test(userData.password)) {
      throw new SecureError(codeErrors.VALIDATION_ERROR);
    }
    if (!userData.token) {
      throw new SecureError(codeErrors.AUTH_ERROR);
    }
    await restoreUserPassword(userData);
    ctx.status = HttpStatus.OK;
  } catch (error) {
    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body = { error: error.data };
  }
};

export const updateProfile = async (ctx: Koa.Context) => {
  const userData = ctx.request.body;
  try {
    if (!userData.token) {
      throw new SecureError(codeErrors.AUTH_ERROR);
    }
    if (!emailRegExp.test(userData.email) || !nameRegExp.test(userData.name)) {
      throw new SecureError(codeErrors.VALIDATION_ERROR);
    }
    const user = await updateUserProfile(userData);
    const token = getToken(user);
    ctx.status = HttpStatus.OK;
    ctx.body = {
      token
    };
  } catch (error) {
    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body = { error: error.data };
  }
};
