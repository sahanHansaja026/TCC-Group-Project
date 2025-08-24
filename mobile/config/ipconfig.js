import Constants from "expo-constants";

let API_BASE_URL;

// Try to auto-detect host from Metro bundler
if (Constants.manifest && Constants.manifest.debuggerHost) {
  const host = Constants.manifest.debuggerHost.split(":")[0]; 
  API_BASE_URL = `http://${host}:8000`; // <-- your backend port
} else if (Constants.expoConfig && Constants.expoConfig.hostUri) {
  // New Expo SDKs use expoConfig
  const host = Constants.expoConfig.hostUri.split(":")[0];
  API_BASE_URL = `http://${host}:8000`;
} else {
  // fallback (you can set your default here)
  API_BASE_URL = "http://localhost:8000";
}

export default API_BASE_URL;
