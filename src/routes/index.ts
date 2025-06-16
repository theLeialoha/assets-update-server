import { NextFunction, Request, Response } from 'express';
import { ApiKey, ExpressError } from '../types';
import { validate as validateUUID } from 'uuid';
import { MASTER_KEY } from '../constants';
import { ApiKeyModel } from '../database';

export * from './ApiKeys';
export * from './Mods';


export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
    const { mod } = req.params;
    
    const apiKey = req.headers.authorization?.split(' ')[1];
    if (!validateUUID(apiKey)) throw new ExpressError(401, 'API Key not provided');
    else if (MASTER_KEY.toLowerCase() == apiKey.toLowerCase()) return next();

    const result: ApiKey = await ApiKeyModel.findOne({ apiKey });

    if (result?.mods?.includes('*')) return next();
    else if (result?.mods?.includes(mod.toLowerCase())) return next();
    throw new ExpressError(403, 'Unauthorized');
}

export async function validateMasterApiKey(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers.authorization?.split(' ')[1];
    if (!validateUUID(apiKey)) throw new ExpressError(401, 'API Key not provided');
    else if (MASTER_KEY.toLowerCase() != apiKey.toLowerCase()) throw new ExpressError(403, 'Unauthorized');
    next();
}
