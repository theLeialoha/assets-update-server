import { Types } from 'mongoose';

export * from './Objects';
export * from './Generics';

export type GenericMongoEntry = {
    _id: Types.ObjectId;
}

