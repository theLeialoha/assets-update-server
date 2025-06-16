import { model, Schema, SchemaOptions } from "mongoose";
import { ApiKey, Mod } from "../types";
import { v4 as UUIDv4 } from "uuid";

const ModSchema = new Schema<Mod>({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    assetsURL: { type: String },
}, getHideOptions());

const ApiKeySchema = new Schema<ApiKey>({
    apiKey: { type: String, default: UUIDv4() },
    mods: [{ type: String }],
}, getHideOptions());

export const ModModel = model<Mod>('Mods', ModSchema);
export const ApiKeyModel = model<ApiKey>('ApiKeys', ApiKeySchema);

function getHideOptions<T>(): SchemaOptions<T> {
    return {
        toJSON: {    
            transform(_, ret) {
                delete ret._id;
                delete ret.__v;
            }
        },
        toObject: {
            transform(_, ret) {
                delete ret._id;
                delete ret.__v;
            }
        },
        strict: true
    }
}