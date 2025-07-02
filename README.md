# `Vedpiler`

## Overview

`Vedpiler` is a Babel plugin that automatically transforms **direct mutations of Zustand store state** into safe functional updates that preserve reactivity.

### Why does this exist?

Zustand and similar state management libraries require that all state updates go through their `set` method to ensure that subscribers are notified. However, developers often accidentally mutate store state directly, like this:

```js
store.count++;
store.name = "Ved";
```

This bypasses Zustand’s reactivity system and results in stale UI or bugs that are difficult to debug.

This plugin enforces **safe mutation patterns at compile time**, so you never accidentally break your state updates.

---

## What does it do?

* Finds `UpdateExpression` nodes like `store.count++` and `store.count--`
* Finds `AssignmentExpression` nodes like `store.name = "Ved"`
* Rewrites them into functional updates:

  ```js
  store.set(state => ({ count: state.count + 1 }));
  store.set(state => ({ name: "Ved" }));
  ```
* Ensures that **all mutations use `store.set`**, so state changes propagate correctly.

---

## How it works

This plugin is purely compile-time:

* It inspects your JavaScript or TypeScript source code using Babel.
* It matches patterns where your store is mutated directly.
* It replaces unsafe mutations with a functional update that Zustand understands.
* There is no runtime cost.

---

## Installation

If you want to run it locally without publishing:

1. Install Babel CLI if you haven’t:

   ```bash
   npm install --save-dev @babel/core @babel/cli @babel/preset-env
   ```

2. Add this plugin to your project. If local:

   ```
   ./zustand-plugin.js
   ```

If you publish it to npm:

```bash
npm vedpiler
```

---

## Usage

### Command line

For local testing:

```bash
npx babel input.js --out-file output.js --plugins ./zustand-plugin.js
```

If you installed from npm:

```bash
npx babel input.js --out-file output.js --plugins transform-zustand-mutations
```

### `.babelrc` configuration

Add the plugin to your Babel config:

```json
{
  "plugins": ["transform-zustand-mutations"]
}
```

---

## Example input and output

**Input:**

```js
store.count++;
store.likes--;
store.name = "Ved";
store.age = 21;
store.online = true;

// Should not transform (not the store)
let other = {};
other.count++;
```

**Output:**

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

store.set(state => ({
  online: true
}));

// This stays unchanged
let other = {};
other.count++;
```

---

## How to test it locally

1. Create a test file `input.js` with some direct mutations.
2. Run the Babel CLI command above.
3. Inspect `output.js` to verify that all direct mutations were transformed.
4. Add `console.log` statements in your plugin if you want to debug how nodes are matched and replaced.

---

## Limitations and future improvements

This version assumes your store is named `store`. It does not yet handle:

* Aliases like `const myStore = store`
* Imports like `import myStore from './store'`
* Nested mutations such as `store.profile.name = "Ved"` (you would need to generate deep merge logic)

For more robust usage, you can extend the plugin to resolve variable bindings and nested props.

---

## Contributing

This plugin is intentionally simple and educational to help you learn how Babel plugins work for enforcing safe state updates.

If you’d like to contribute:

* Add support for scope-aware aliases (use `path.scope.getBinding`)
* Handle destructured stores or multiple store instances
* Improve nested property updates by generating deep merges
* Add tests and examples in a `tests` folder

---

## License

MIT License

---

If you have suggestions or want to extend this for other state libraries, feel free to fork it and build your own version.

---