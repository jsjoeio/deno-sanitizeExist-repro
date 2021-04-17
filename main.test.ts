import { helloWorld, exitGracefully } from "./main.ts"
import { assertEquals } from "https://deno.land/std@0.93.0/testing/asserts.ts"

Deno.test({
  name: "helloWorld should return 'Hello world!'",
  fn() {
    assertEquals(helloWorld(), "Hello world!")
  },
})

Deno.test({
  name: "exitGracefully should log an error",
  fn() {
    let errorMessage = null
    const error = console.error

    console.error = (x) => {
      errorMessage = x
    }

    exitGracefully("something went wrong")

    console.error = error
    assertEquals(errorMessage, `something went wrong`)
  },
  sanitizeExit: false,
})
