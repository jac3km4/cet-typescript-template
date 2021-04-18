
/** @customConstructor CName.new */
declare class CName {
  constructor(str: string);
}

/** @customConstructor TweakDBID.new */
declare class TweakDBID {
  constructor(str: string);
}

/** @customConstructor CRUID.new */
declare class CRUID {
  constructor(str: string);
}

declare interface Variant { }
declare interface NodeRef { }

type Uint8 = number;
type Uint16 = number;
type Uint32 = number;
type Uint64 = number;
type Int8 = number;
type Int16 = number;
type Int32 = number;
type Int64 = number;
type Float = number;
type Double = number;
type Bool = boolean;
type LocalizationString = string;

/** @noSelf **/
declare function registerForEvent(name: string, cb: (delta: number) => void): void;

/** @noSelf **/
declare function print(str: string): void;

/** @noSelf **/
declare function Dump(obj: any, detailed: boolean): string;

/** @noSelf **/
declare function DumpType(name:string, detailed:boolean): string;

/** @noSelf **/
/** @tupleReturn */
declare function GetDisplayResolution(): [number, number];

/** @noSelf **/
declare function registerHotkey(id: string, name: string, cb: () => void): void;
