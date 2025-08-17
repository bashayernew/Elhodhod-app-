import { Text, View } from "react-native";
import { Button } from "@el-hodh0d/ui";

export default function Index() {
	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
			<Text style={{ color: "#fafafa", fontSize: 20 }}>el-hodh0d Mobile</Text>
			<Button onClick={() => {}}>Shared UI Button</Button>
		</View>
	);
}


