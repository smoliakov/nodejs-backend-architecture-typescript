import { RoleRequest } from 'app-request';
import { NextFunction,Response } from 'express';

import { RoleCode } from '../database/model/Role';

export default (...roleCodes: RoleCode[]) =>
  (req: RoleRequest, res: Response, next: NextFunction) => {
    req.currentRoleCodes = roleCodes;
    next();
  };
