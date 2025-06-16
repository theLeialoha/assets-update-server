import { ApiKey, ExpressError } from '../types';
import { ApiKeyModel } from '../database';
import { MASTER_KEY } from '../constants';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { validate as validateUUID } from 'uuid';

export * from './ApiKeys';
export * from './Mods';

export const validateApiKey = asyncRoute(async function (req: Request, res: Response, next: NextFunction) {
    const { mod } = req.params;
    
    const apiKey: string = req.headers['apikey'] as any;
    if (!validateUUID(apiKey)) throw new ExpressError(401, 'API Key not provided');
    else if (MASTER_KEY?.toLowerCase() == apiKey.toLowerCase()) return next();

    const result: ApiKey = await ApiKeyModel.findOne({ apiKey });

    if (result?.mods?.includes('*')) return next();
    else if (result?.mods?.includes(mod.toLowerCase())) return next();
    throw new ExpressError(403, 'Unauthorized');
});

export const validateMasterApiKey = asyncRoute(async function (req: Request, res: Response, next: NextFunction) {
    const apiKey: string = req.headers['apikey'] as any;
    if (!validateUUID(apiKey)) throw new ExpressError(401, 'API Key not provided');
    else if (MASTER_KEY?.toLowerCase() != apiKey.toLowerCase()) throw new ExpressError(403, 'Unauthorized');
    next();
});

export function asyncRoute(handler: RequestHandler) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Weird catch system... :/
        Promise.resolve(handler(req, res, next)).catch(e => next(e));
    }
}
