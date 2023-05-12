import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { ctx, start } from "./app.js";

const PLUGINS_FOLDER = "plugins";
const PLUGIN_FILE = "plugin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, PLUGINS_FOLDER);
const filesInPluginFolder = fs.readdirSync(directoryPath);

const plugins = filesInPluginFolder.reduce((list, file) => {
  const full = path.join(directoryPath, file);

  if (!fs.lstatSync(full).isDirectory()) return list;
  const plugin = path.join(full, PLUGIN_FILE);

  if (fs.existsSync(plugin)) {
    console.log(`[Found] ${plugin}`);
    list.push(plugin);
  }
  
  return list;
}, []);

const importPromises = plugins.map(
  (plugin) =>
    new Promise((res, rej) => {
      //we retrieve the module and associate it to the plugin path so we can log it later
      import(plugin)
        .then((module) => res({ module, plugin }))
        .catch((err) => rej(err));
    })
);

const pluginModules = await Promise.all(importPromises);

pluginModules.forEach(({ module, plugin }) => {
  if (module.default) {
    module.default(ctx);
    console.log(`[Loaded] ${module.meta?.name ? module.meta.name : plugin}`);
  } else {
    console.log(`[Skip] ${plugin} CAUSE: no default export`);
  }
});

console.log("[Plugins] Loaded plugins");
console.log("[App] Starting app\n");

start();

console.log("\n[App] Main task finished executing. Some promises could still be pending.");