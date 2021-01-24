declare const sqlite3: sqlite3;

/** @noSelf **/
declare interface sqlite3 {
    complete(sql: string): boolean
    open(filename: string, flags?: string): DB
    version(): string
    lversion(): string
}

declare interface DB {
    close(): void
    rows(sql: string): Rows
    urows(sql: string): Rows
    changes(): number
    exec(sql: string): void
    isopen(): boolean
    total_changes(): number
}

/** @luaIterator */
type Rows = Iterable<string>;