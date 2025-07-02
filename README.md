# Vedpiler

## built for learning purposes

**Vedpiler** is a Babel plugin that automatically transforms direct state mutations in Zustand into safe, functional updates that keep your store reactive.

---

## Why Vedpiler?

Zustand requires all state updates to go through its `set` method to ensure subscribers are notified. Direct mutations like `store.count++` or `store.name = "Ved"` bypass this and can cause bugs or stale UI.

Vedpiler catches these direct mutations at compile time and rewrites them to safe updates, so your state stays predictable.

---

## What it does

**Transforms:**

```js
store.count++;
store.name = "Ved";
```

**Into:**

```js
store.set(state => ({
  count: state.count + 1
}));

store.set(state => ({
  name: "Ved"
}));
```

It supports:

* Increment (`++`) and decrement (`--`)
* Direct assignment (`=`)

---

## Installation

Install Vedpiler as a dev dependency:

```bash
npm install --save-dev vedpiler
```

or

```bash
yarn add -D vedpiler
```

---

## Usage

Add Vedpiler to your Babel config.

**With `.babelrc`:**

```json
{
  "plugins": ["vedpiler"]
}
```

**Or with Babel CLI:**

```bash
npx babel src --out-dir lib --plugins vedpiler
```

---

## Example

**Before:**

```js
store.count++;
store.likes--;
store.name = "Ved";
store.age = 21;
```

**After:**

```js
store.set(state => ({
  count: state.count + 1
}));

store.set(state => ({
  likes: state.likes - 1
}));

store.set(state => ({
  name: "Ved"
}));

store.set(state => ({
  age: 21
}));
```

Only mutations on a variable named `store` are transformed. Other variables are not affected.

---

## Limitations

* Only works if your store is named `store`.
* Does not handle variable aliases yet (like `const myStore = store`).
* Does not handle nested mutations (like `store.profile.name = "Ved"`).

Future versions may add scope resolution and nested property support.

---

## When to use

Use Vedpiler if:

* You want to enforce safe Zustand usage across a team.
* You want compile-time safety against direct mutations.
* You prefer no runtime overhead — the transform happens before your code runs.

---

## License

MIT

---

## Author

Built and maintained by Ved Pawar.

---

If you find bugs or want to contribute improvements (like scope resolution or nested property support), open an issue or PR on GitHub.

---
