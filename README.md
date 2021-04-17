# Exit sanitizer swallows subsequent tests results

Reproduction repo for https://github.com/denoland/deno/issues/10229

## Description

Using the exit sanitizer in one test causes the test runner to swallow all messages for subsequent tests.

## Steps to Reproduce

1. create `main.ts`

```typescript
export function helloWorld() {
  return "Hello world!"
}

export function exitGracefully(msg: string) {
  console.error(msg)
  Deno.exit(1)
}
```

2. create `main.test.ts`

```typescript
import { helloWorld, exitGracefully } from "./main.ts"
import { assertEquals } from "https://deno.land/std@0.93.0/testing/asserts.ts"

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

Deno.test({
  name: "helloWorld should return 'Hello world!'",
  fn() {
    assertEquals(helloWorld(), "Hello world!")
  },
})
```

3. Run `deno test`

## Expected

All test runner results/logs are shown.

## Actual

Results/Logs are swallowed. Only shows part of the first test result.

```shell
➜  deno-sanitizeExit deno test
Check file:///Users/jp/Dev/repros/deno-sanitizeExit/$deno$test.ts
running 2 tests
test exitGracefully should log an error ... %
```

## Demo

https://user-images.githubusercontent.com/3806031/115122584-7f3eb600-9f6d-11eb-97ae-ffe0fd8e1063.mov

## Additional Notes

If you switch the order of the tests, the test runner shows part of the results, until it gets to the test with `sanitizeExit: false`

```shell
➜  deno-sanitizeExit deno test
Check file:///Users/jp/Dev/repros/deno-sanitizeExit/$deno$test.ts
running 2 tests
test helloWorld should return 'Hello world!' ... ok (3ms)
test exitGracefully should log an error ... %
```
