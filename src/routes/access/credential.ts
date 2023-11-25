import { RoleRequest } from 'app-request';
import bcrypt from 'bcrypt';
import express from 'express';
import _ from 'lodash';

import authentication from '../../auth/authentication';
import authorization from '../../auth/authorization';
import { BadRequestError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import { RoleCode } from '../../database/model/Role';
import User from '../../database/model/User';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import UserRepo from '../../database/repository/UserRepo';
import asyncHandler from '../../helpers/asyncHandler';
import role from '../../helpers/role';
import validator from '../../helpers/validator';

import schema from './schema';

const router = express.Router();

//----------------------------------------------------------------
router.use(authentication, role(RoleCode.ADMIN), authorization);
//----------------------------------------------------------------

router.post(
  '/user/assign',
  validator(schema.credential),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('User do not exists');

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    await UserRepo.updateInfo({
      _id: user._id,
      password: passwordHash,
    } as User);

    await KeystoreRepo.removeAllForClient(user);

    new SuccessResponse(
      'User password updated',
      _.pick(user, ['_id', 'name', 'email']),
    ).send(res);
  }),
);

export default router;
