declare module "next/types.js" {
  export type ResolvingMetadata = Record<string, unknown>;
  export type ResolvingViewport = Record<string, unknown>;
}

declare module "next/server.js" {
  export type NextRequest = Request;
}
