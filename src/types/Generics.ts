import { EXPIRATION_DELAY } from "../constants";

export type EmptyEntry = null | undefined
export type Optional<T> = T | EmptyEntry;

type Concrete<T, K extends keyof T> = { [P in K]-?: T[P] };
export type RequiredPartial<T, K extends keyof T> = Partial<T> & Concrete<T, K>

export class ExpirableMap<K, V> {
    private map: Map<K, V> = new Map();
    private expiration: number = 0;
    private clearTimer: NodeJS.Timeout;

    set(key: K, value: V): this {
        this.checkExpiration();
        this.map.set(key, value);
        return this;
    }

    get(key: K): V | undefined {
        this.checkExpiration();
        return this.map.get(key);
    }

    has(key: K): boolean {
        this.checkExpiration();
        return this.map.has(key);
    }

    delete(key: K): boolean {
        this.checkExpiration();
        return this.map.delete(key);
    }

    clear(): void {
        this.map.clear();
        this.expiration = Date.now() + EXPIRATION_DELAY;

        // Removes the current timeout
        if (this.clearTimer != null) clearTimeout(this.clearTimer);
        // We want to clear the array and stop the timeout.
        // The timer only restarts whenever clear() is called again.
        this.clearTimer = setTimeout(() => this.map.clear(), EXPIRATION_DELAY + 1500);
    }

    hasExpired(): boolean {
        return this.expiration <= Date.now();
    }

    private checkExpiration(): void {
        if (this.hasExpired()) this.clear();
    }

    entries(): IterableIterator<[K, V]> {
        this.checkExpiration();
        return this.map.entries();
    }

    keys(): IterableIterator<K> {
        this.checkExpiration();
        return this.map.keys();
    }

    values(): IterableIterator<V> {
        this.checkExpiration();
        return this.map.values();
    }

    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void): void {
        this.checkExpiration();
        this.map.forEach(callbackfn);
    }

    get size(): number {
        this.checkExpiration();
        return this.map.size;
    }
}

export type Cache = {
    buffer: Buffer;
    contentType: string;
    url: string;
}

export class ExpressError extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);

        this.status = status;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ExpressError.prototype);
        this.name = 'ExpressError';
    }

    get json() {
        const status = this.status.toString();
        const message = this.message;

        return { status, message };
    }
}
