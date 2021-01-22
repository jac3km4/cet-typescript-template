declare const io: IOModule;

/** @noSelf **/
declare interface IOModule {
  open(path: String, mode?: "r"): ROFile;
  open(path: String, mode?: "w" | "a"): WOFile;
  open(path: String, mode?: "r+" | "w+" | "a+"): RWFile;

  input(file: File): void;
  output(file: File): void;
  lines(path: String): Lines;
}

declare interface File {
  close(): void;
  seek(whence: "set" | "cur" | "end", offset: number): void;
}

declare interface ROFile extends File {
  read(mode: "n"): number | undefined;
  read(mode: "a"): String;
  read(mode: "*l"): String | undefined;
  read(count: number): String | undefined;

  lines(): Lines;
}

declare interface WOFile extends File {
  write(...args: WriteValues): String;
  flush(): void;
}

declare interface RWFile extends ROFile, WOFile { }

/** @luaIterator */
type Lines = Iterable<String>;

/** @vararg */
type WriteValues = String[];
