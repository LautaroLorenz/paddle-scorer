export class Snapshot<T> {
    private _history: T[] = [];

    get history(): T[] {
        return this._history;
    }

    generate(status: T): void {
        this._history = this._history.concat(status);
    }

    get(): T | null {
        if (this._history.length === 0) {
            return null;
        }
        return this._history[this._history.length - 1];
    }

    undo(): T | null {
        if (this._history.length === 0) {
            return null;
        }
        this._history = this._history.slice(0, -1);
        return this.get();
    }

    clearHistory(): void {
        this._history = [];
    }
}
