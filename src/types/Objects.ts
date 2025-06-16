import { GenericMongoEntry } from ".";

export type ApiKey = {
    apiKey: string;
    mods: string[];
} & GenericMongoEntry

export type Mod = {
    id: string;
    name: string;
    assetsURL?: string;
} & GenericMongoEntry;
