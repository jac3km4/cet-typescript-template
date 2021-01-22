
declare const ImGui: ImGui;

/** @noSelf **/
declare interface ImGui {
  IsKeyDown(key: number): boolean
  IsKeyPressed(key: number, b: boolean): boolean
  PushStyleColor(col: ImGuiCol, r: number, g: number, b: number, a: number): void
  Begin(name: String, b: boolean, flags: ImGuiWindowFlags): void
  SetWindowPos(x: number, y: number): void
  SetWindowFontScale(number): void
  Spacing(): void
  TextColored(r: number, g: number, b: number, a: number, text: String): void
  Separator(): void
  End(): void
  PopStyleColor(n: number): void
}

declare enum ImGuiCol {
  WindowBg,
  Border,
  Separator,
}

declare enum ImGuiWindowFlags {
  NoResize,
  NoMove,
  NoTitleBar,
  AlwaysAutoResize,
}
