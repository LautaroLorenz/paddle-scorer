export interface SnapshotStatus<T> {
    clone(status: T): T;
}

export class Snapshot<T> {
    private _history: T[] = [];

    constructor(private snapshotStatus: SnapshotStatus<T>) {}

    get history(): T[] {
        return this._history;
    }

    generate(status: T): void {
        const snapshot = this.snapshotStatus.clone(status);
        this._history = this._history.concat(snapshot);
    }

    get(): T {
        const status = this._history[this._history.length - 1];
        const snapshot = this.snapshotStatus.clone(status);
        return snapshot;
    }

    undo(): T {
        if (this._history.length > 1) {
            this._history = this._history.slice(0, -1);
        }
        return this.get();
    }

    clearHistory(): void {
        this._history = this._history.slice(0, 1);
    }
}
