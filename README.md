
## CET typescript template

### setup
```
npm install
```


### build
```
npm run build
```
The lua bundle is saved to dist/bundle.lua.


### usage
This template contains automatically generated bindings to most functions exposed by the game's scripting language. You can leverage them for auto-completion and error checking.
I recommend use of VS Code for a good IDE experience.

<img src="https://media.giphy.com/media/XcWYom9J9l4ipCKLnq/giphy.gif">


Apart from using the default `Game` object you can also access static methods directly like this:
```ts
let quality: gamedataQuality =
  Game.Raw.RPGManager.GetItemQuality(float(1));
```
This is an unsafe API that is not checked at compile time and does not provide autocompletion, but provides raw access to all of their API. This template contains a plugin that translates calls like above (starting with `Game.Raw`) into static method invokations. The plugin automatically generates a mangled name for the function based on argument types. The above call generates `Game["gameRPGManager::GetItemQuality;Float"](1)`. Numeric types have to be wrapped with a function that specifies the exact type (`i32`, `float`, `u32`, `i16` etc). Other types don't require such wrapping.

### credits

I took the list of mappings between script statics and game engine statics from Expired's very useful Google Sheet.
