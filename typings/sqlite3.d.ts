declare const sqlite3: sqlite3;

/** @noSelf **/
declare interface sqlite3 {
    open(name: string): DB
}

declare interface DB {
    close(): void
}