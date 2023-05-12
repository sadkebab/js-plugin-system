export default function ({ addHandler }) {
  addHandler(() => {
    console.log("[plugin::logger] executing handler");
    console.log("astagfirullah");
  });
}

export const meta = {
  name: "logger",
  description: "logs stuff",
};
