import {BehaviorSubject} from "rxjs";

export class VersionSubject extends BehaviorSubject<number> {
    constructor() {
        super(0);
    }

    increment() {
        this.next(this.value + 1);
    }
}
