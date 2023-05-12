# ESM plugin system
An example of how to build a simple plugin system in Node.js with ES Modules

## How It Works

On startup, this node application will check for a 'plugins' folder in the current execution path. It will check every folder inside that one for files called 'plugin.js' and load them as esm modules to run their default export function with a context object as parameter.
The context object has a 'addHandler' method that allows the plugin to register a handler that will run once at app execution time, after all the plugins are loaded/

## How to test
- clone repository
- add anoter folder with a plugin.js file and register a handler in the default exported function
- export a meta object with a name prop if you want to see a specific name loggeed when the plugin is loaded
- npm run start
