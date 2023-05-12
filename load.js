import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { ctx, start } from "./app.js";

const PLUGINS_FOLDER = "plugins";
const PLUGIN_FILE = "plugin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluginsDirPath = path.join(__dirname, PLUGINS_FOLDER);
const pluginsDirContent = fs.readdirSync(pluginsDirPath);

const plugins = pluginsDirContent.reduce((list, item) => {
  const itemPath = path.join(pluginsDirPath, item);
  if (!fs.lstatSync(itemPath).isDirectory()) return list;

  const pluginFilePath = path.join(itemPath, PLUGIN_FILE);
  if (fs.existsSync(pluginFilePath)) {
    console.log(`[Found] ${pluginFilePath}`);
    list.push(pluginFilePath);
  }

  return list;
}, []);

const importPromises = plugins.map(
  (pluginPath) =>
    new Promise((res, rej) => {
      //we retrieve the module and associate it to the plugin path so we can log it later
      import(pluginPath)
        .then((module) => res({ module, pluginPath }))
        .catch((err) => rej(err));
    })
);

const pluginModules = await Promise.all(importPromises);

pluginModules.forEach(({ module, plugin: pluginPath }) => {
  if (module.default) {
    module.default(ctx);
    console.log(`[Loaded] ${module.meta?.name ? module.meta.name : pluginPath}`);
  } else {
    console.log(`[Skip] ${pluginPath} CAUSE: no default export`);
  }
});

console.log("[Plugins] Loaded plugins");
console.log("[App] Starting app\n");

start();

console.log("\n[App] Main task finished executing. Some promises could still be pending.");