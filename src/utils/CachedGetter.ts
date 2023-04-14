export class CachedGetter<T> {
    _cached?: {
        version: number,
        value: T,
    };

    constructor(
        public _getVersion: () => number,
        public _computeValue: () => T,
    ) {
    }

    getValue() {
        const version = this._getVersion();
        if (this._cached && this._cached.version === version) {
            return this._cached.value;
        }
        return (this._cached = {
            version,
            value: this._computeValue(),
        }).value;
    }
}

export function createCachedGetter<T>(
    getVersion: () => number,
    computeValue: () => T,
) {
    const cachedGetter = new CachedGetter(getVersion, computeValue);
    return Object.assign(
        cachedGetter.getValue.bind(cachedGetter),
        {
            cachedGetter,
        },
    );
}
