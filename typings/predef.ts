
/** @noSelf **/
declare interface Game extends GameInstance {
  Raw: { [key: string]: any }
}

declare const Game: Game;

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

/** @noSelf **/
declare class GetSingleton {
  constructor(name: string)
  FromTDBID(tweakDBID: TweakDBID): number
}

declare interface Uint8 { }
declare interface Uint16 { }
declare interface Uint32 { }
declare interface Uint64 { }
declare interface Int8 { }
declare interface Int16 { }
declare interface Int32 { }
declare interface Int64 { }
declare interface Float { }
declare interface Variant { }
declare interface NodeRef { }

type Bool = boolean;
type LocalizationString = string;

/** @noSelf **/
function u8(value: number): Uint8 {
  return value as Uint8;
}

/** @noSelf **/
function u16(value: number): Uint16 {
  return value as Uint16;
}

/** @noSelf **/
function u32(value: number): Uint32 {
  return value as Uint32;
}

/** @noSelf **/
function u64(value: number): Uint64 {
  return value as Uint64;
}

/** @noSelf **/
function i8(value: number): Int8 {
  return value as Int8;
}

/** @noSelf **/
function i16(value: number): Int16 {
  return value as Int16;
}

/** @noSelf **/
function i32(value: number): Int32 {
  return value as Int32;
}

/** @noSelf **/
function i64(value: number): Int64 {
  return value as Int64;
}

/** @noSelf **/
function float(value: number): Float {
  return value as Float;
}

/** @noSelf **/
declare function registerForEvent(name: string, cb: (delta: number) => void): void;

/** @noSelf **/
declare function print(str: string): void;

/** @noSelf **/
/** @tupleReturn */
declare function GetDisplayResolution(): [number, number];

/** @noSelf **/
declare function registerHotkey(id: string, name: string, cb: () => void): void;
