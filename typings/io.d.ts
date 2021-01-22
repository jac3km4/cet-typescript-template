declare const io: IOModule;

/** @noSelf **/
declare interface IOModule {
  open(path: string, mode?: "r"): ROFile;
  open(path: string, mode?: "w" | "a"): WOFile;
  open(path: string, mode?: "r+" | "w+" | "a+"): RWFile;

  input(file: File): void;
  output(file: File): void;
  lines(path: string): Lines;
}

declare interface File {
  close(): void;
  seek(whence: "set" | "cur" | "end", offset: number): void;
}

declare interface ROFile extends File {
  read(mode: "n"): number | undefined;
  read(mode: "a"): string;
  read(mode: "*l"): string | undefined;
  read(count: number): string | undefined;

  lines(): Lines;
}

declare interface WOFile extends File {
  write(...args: WriteValues): string;
  flush(): void;
}

declare interface RWFile extends ROFile, WOFile { }

/** @luaIterator */
type Lines = Iterable<string>;

/** @vararg */
type WriteValues = string[];
