import { ApiKey, ExpressError } from "../types";
import { ApiKeyModel } from "../database";
import { Request, Response, Router } from "express";
import { validateMasterApiKey, asyncRoute } from ".";

export const apiKeyRoute = Router();

apiKeyRoute.get('/', validateMasterApiKey, asyncRoute(async (req: Request, res: Response) => {
    const keys: ApiKey[] = await ApiKeyModel.find();
    res.json(keys);
}));

apiKeyRoute.post('/add', validateMasterApiKey, asyncRoute(async (req: Request, res: Response) => {
    let { mods } = req.body;
    if (!Array.isArray(mods) || mods.length == 0)
        throw new ExpressError(400, 'Field "mods" in body, must be an array and not empty');

    // Make sure every mod id is lowercase
    mods = mods.map(mod => mod.toLowerCase());

    const key: ApiKey = await ApiKeyModel.create({ mods }).catch(err => null);
    if (key == null) throw new ExpressError(500, 'Error whilst creating API key');
    res.json(key);
}));

apiKeyRoute.delete('/:key', validateMasterApiKey, asyncRoute(async (req: Request, res: Response) => {
    const { key: apiKey } = req.params;

    const key: ApiKey = await ApiKeyModel.findOneAndDelete({ apiKey });
    if (key == null) throw new ExpressError(404, "API key not found");
    res.json({ status: '200', message: 'API key was deleted' });
}));
