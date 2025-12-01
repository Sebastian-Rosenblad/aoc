declare function require<T = any>(path: string): T;

declare namespace require {
  function context(
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp
  ): __WebpackModuleApi.RequireContext;
}
