declare module "*.txt" {
  const content: string
  export default content
}

declare module "*.sqlite" {
  const content: ArrayBuffer
  export default content
}

declare module "*.wasm" {
  const content: WebAssembly.Module
  export default content
}
