import { ExpoConfig } from "expo/config";

export default ({ config }: { config: ExpoConfig }): ExpoConfig => ({
	...config,
	name: "el-hodh0d",
	slug: "el-hodh0d",
	scheme: "elhodh0d",
	version: "1.0.0",
	orientation: "portrait",
	jsEngine: "hermes",
	newArchEnabled: true,
	plugins: ["expo-router"],
	experiments: { typedRoutes: true },
});


