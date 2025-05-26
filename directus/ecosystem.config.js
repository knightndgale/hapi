module.exports = {
  apps: [
    {
      // General
      name: "directus",
      script: "cli.js",
      args: ["start"],
      cwd: "/directus/",
      autorestart: true,
    },
  ],
};
