declare const io: io;

/** @noSelf **/
declare interface io {
    open(file: String, mode: String)
    lines(file: String)
    read()
    close(file: String)
    output(file: String)
    write(string: String, param?: String)
}