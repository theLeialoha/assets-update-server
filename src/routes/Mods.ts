import { Cache, ExpirableMap, ExpressError, Mod } from "../types";
import { default as axios } from "axios";
import { ModModel } from "../database";
import { NextFunction, Request, Response, Router } from "express";
import { posix } from "path";
import { URL } from "url";
import { validateApiKey } from ".";
const asyncHandler = require("express-async-handler");

const cache = new ExpirableMap<string, Map<String, Cache>>();

export const modRoute = Router();

modRoute.get('/', async (req: Request, res: Response) => {
    const mods = await ModModel.find();
    res.json(mods);
});

modRoute.get('/:mod/index.json', asyncHandler(async (req: Request, res: Response) => {
    getAsset(req, res, false);
}));

modRoute.get('/:mod', asyncHandler(async (req: Request, res: Response) => {
    const { mod: modID } = req.params;
    const mod: Mod = await ModModel.findOne({ modID });

    if (mod == null) throw new ExpressError(404, 'Mod does not exist');
    res.json(mod);
}));

modRoute.use('/:mod/', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.method != 'GET') return next();
    getAsset(req, res, true);
}));

modRoute.delete('/:mod', validateApiKey, asyncHandler(async (req: Request, res: Response) => {
    const { mod: modID } = req.params;
    const mod: Mod = await ModModel.findOneAndDelete({ modID });

    if (mod == null) throw new ExpressError(404, 'Mod does not exist');
    res.json({ status: "200", message: `Successfully deleted mod "${modID}"` })
}));

modRoute.post('/add', validateApiKey, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { modID, name, assetsURL } = req.body;

    const mod = await ModModel.create({ modID, name, assetsURL }).catch(err => null);
    if (mod == null) throw new ExpressError(400, 'Mod already exists');
    res.json({ status: "200", message: "Successfully added mod" });
}));

modRoute.post('/:mod/edit', validateApiKey, asyncHandler(async (req: Request, res: Response) => {
    const { mod } = req.params;
    const { modID, name, assetsURL } = req.body;

    const filtered = Object.entries({ modID, name, assetsURL }).filter(([_, v]) => v != null);
    const body = Object.fromEntries(filtered);

    const updated = await ModModel.findOneAndUpdate({ modID: mod }, { $set: body }, { new: false });
    if (updated == null) throw new ExpressError(404, 'Mod does not exist');
    res.json({ status: "200", message: "Successfully updated mod" });
}));

modRoute.post('/:mod/pack', validateApiKey, (req: Request, res: Response) => {
    throw new ExpressError(500, 'function not implmented');
});



async function getAsset(req: Request, res: Response, hasPath: boolean) {
    const { mod: modID } = req.params;

    // Let's grab our path and see if it exists
    let path = hasPath ? posix.normalize(req.url) : "#index";

    // Skip lookup if cached beforehand
    if (cache.has(modID) && cache.get(modID).has(path)) {
        const { buffer, contentType } = cache.get(modID).get(path);
        
        // If we don't have the buffer, it was preloaded
        if (buffer != null) {
            res.header('Content-Type', contentType).end(buffer);
            return;
        }
    } else if (!cache.has(modID)) {
        // If the mod hasn't been loaded, let's get it
        const result: Mod = await ModModel.findOne({ modID });
        if (result == null) throw new ExpressError(404, 'Mod does not exist');
        else if (!result.assetsURL) throw new ExpressError(500, 'Mod\'s asset URL does not exist');

        // Let's not forget to add the mod lookup table
        cache.set(modID, new Map());

        // Let's preload this
        cache.get(modID).set("#index", { buffer: null, contentType: null, url: result.assetsURL });
    }

    // We try to keep the url "loaded" at all times
    const { url: baseURL } = cache.get(modID).get('#index');
    const assetsURL = new URL(baseURL);
    const { pathname } = assetsURL;

    if (!hasPath)
        // This was preloaded and without the path
        // Let's use the original path from the assetsURL
        path = pathname.replace(/.*(\/[^\\]*)/gi, '$1');
    else
        // Let's fix the pathname to include our new path
        // And let's hope that we aren't dealing with a ending slash
        assetsURL.pathname = posix.join(pathname, pathname.endsWith('/') ? '.' : '..', path);
    
    // Now we got our URL, lets make a request
    const url = assetsURL.toString();
    const response = await axios.get(url, { responseType: 'arraybuffer' }).catch(err => err.response);

    // If we get an error, we send a 404
    if (response.status != 200) throw new ExpressError(404, 'Mod\'s asset does not exist');

    // Save to cache
    const buffer = Buffer.from(response.data);
    const contentType = response.headers['content-type'];
    cache.get(modID).set(path, { buffer, contentType, url });

    // Save the preloaded path with our new information
    if (!hasPath) cache.get(modID).set("#index", { buffer, contentType, url });

    // Send the information to the client
    res.header('Content-Type', contentType).end(buffer);

}
