import Constants from "expo-constants";

const ENV = {
  development: {
    SHOW_DEBUG_BUTTONS: true,
  },
  production: {
    SHOW_DEBUG_BUTTONS: false,
  },
};

const getEnvVars = (env = Constants.manifest?.releaseChannel) => {
  // __DEV__ is true when running locally, false when published
  if (__DEV__) {
    return ENV.development;
  }
  return ENV.production;
};

export default getEnvVars();
