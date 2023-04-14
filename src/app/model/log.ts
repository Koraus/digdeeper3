import {VersionSubject} from "../../utils/VersionSubject";

export const log = new class Log {
    dataVersion = new VersionSubject();
    data = [] as Array<{
        entry: string,
        count: number,
        extra: number,
    }>;

    write(entry: string, extra: number) {
        if (this.data[0] && (entry === this.data[0].entry)) {
            this.data[0].count++;
            this.dataVersion.increment();
            return;
        }
        this.data.unshift({
            entry,
            count: 1,
            extra,
        });
        this.dataVersion.increment();
    }
};
