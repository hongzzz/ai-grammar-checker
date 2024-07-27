interface Config {
  key1: string;
  key2: string;
  key3: string;
  // Add more configuration properties as needed
}

// Define a function to save the configuration to chrome storage
const saveConfig = (config: Config) => {
  chrome.storage.sync.set(config, () => {
    console.log("Configuration saved successfully!");
  });
};

// Define a function to retrieve the configuration from chrome storage
const getConfig = () => {
  return new Promise<Config>((resolve) => {
    chrome.storage.sync.get(null, (result) => {
      const mergedConfig = { ...result };
      console.log("Merged configuration:", mergedConfig);
      resolve(mergedConfig as Config);
    });
  });
};
