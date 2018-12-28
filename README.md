# TypeScript `compilerOptions.types` in combination with a module file

This repository is an experiment in seeing whether TypeScript will correctly see types on a global scope
when type checking JavaScript and pulling in packages who export their types in a module file.

See the [**online demo**](https://tomashubelbauer.github.io/ts-types-module/)

The JavaScript project may be a simple file:

`index.js`
```js
console.log(depA());
console.log(depB());
```

The dependencies are pulled in using plain `script` tags:

```html
<script src="lib/depA.js"></script>
<script src="lib/depB.js"></script>
```

These are also just plain JavaScript files.

At runtime, everything works, because the dependencies provide the functions on `window`.

At type check time, TypeScript isn't aware of the dependencies, so it will yell saying `depA` and `depB` are not declared.

To fix this, we need to pull in typings for the two modules. This being a JavaScript project,
we can't do it through code, by say using ES modules and using `import`, making TS aware of the dependencies.

What we can use is `compilerOptions.types`:

`tsconfig.json`
```json
{
  "compilerOptions": {
    "noEmit": true,
    "allowJs": true,
    "checkJs": true,
    "types": [
      "depA",
      "depB"
    ]
  }
}
```

This way the TypeScript compiler will know to pull in the typings off those two packages, even thought they
are not referenced in the project in any way.

This will work for package A, because its typings are declared like this:

```ts
declare function depA() => string;
```

But it doesn't seem to work for package A, because its typings are declared like this:

```ts
declare function depB(): string;
export default depB;
```

It seems with this we are locked in, because on the consuming side, we'd still have to
import something. Which is not possible in JavaScript. So the typings are wrong to make it a module file,
because they don't communicate the function is also declared on the global scope.

That's why this works at runtime, but not in type check time.

The fix should be to change the typings to communicate the function is both import-able as a module,
but is also at the global scope.

Whether that is even possible is the question.

- [ ] Flesh out the demo code to demonstrate the above
- [ ] Figure out how to solve it / ask for help
