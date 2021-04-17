export function helloWorld() {
  return "Hello world!"
}

export function exitGracefully(msg: string) {
  console.error(msg)
  Deno.exit(1)
}
