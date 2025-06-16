import { Request, Response, Router } from "express";
import { ApiKey, ExpressError } from "../types";
import { ApiKeyModel } from "../database";
import { validateMasterApiKey } from ".";

export const apiKeyRoute = Router();

apiKeyRoute.get('/', validateMasterApiKey, async (req: Request, res: Response) => {
    const keys: ApiKey[] = await ApiKeyModel.find();
    res.json(keys);
});

apiKeyRoute.post('/add', validateMasterApiKey, async (req: Request, res: Response) => {
    const { mods } = req.body;
    if (!Array.isArray(mods) || mods.length == 0)
        throw new ExpressError(400, 'Field "mods" in body, must be an array and not empty');

    const key: ApiKey = await ApiKeyModel.create({ mods }).catch(err => null);
    if (key == null) throw new ExpressError(500, 'Error whilst creating API key');
    res.json(key);
});

apiKeyRoute.delete('/:key', validateMasterApiKey, async (req: Request, res: Response) => {
    const { key: apiKey } = req.params;

    const key: ApiKey = await ApiKeyModel.findOneAndDelete({ apiKey });
    if (key == null) throw new ExpressError(404, "API key not found");
    res.json({ status: '200', message: 'API key was deleted' });
});
