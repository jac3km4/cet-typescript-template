declare const io: IOModule;

/** @noSelf **/
declare interface IOModule {
    open(file: String, mode?: String): File
    input(file: File): void
    output(file: File): void
    lines(file: File): Lines
    read(): String | undefined
    write(...args: WriteValues): String
    close(file: File): void
}

declare interface File { }

type Lines = Iterable<String>;

/** @vararg */
type WriteValues = String[];
