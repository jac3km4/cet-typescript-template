declare const spdlog: spdlog;

/** @noSelf **/
declare interface spdlog {
    info(text: string): void
    warn(text: string): void
    trace(text: string): void
    debug(text: string): void
    error(text: string): void
    critical(text: string): void
}