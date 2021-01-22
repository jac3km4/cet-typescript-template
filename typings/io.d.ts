declare const io: IOModule;

/** @noSelf **/
declare interface IOModule {
    open(file: String, mode?: String): File
    input(file: File): void
    output(file: File): void
    lines(file: File): Lines
}

declare interface File {
    read(): String | undefined
    write(...args: WriteValues): String
    lines(): Lines
    flush(): void
    close(): void
}

/** @luaIterator */
type Lines = Iterable<String>;

/** @vararg */
type WriteValues = String[];
