import * as React from "react";
import { Pressable, Text } from "react-native";

type ButtonProps = React.ComponentProps<typeof Pressable> & {
	children?: React.ReactNode;
	variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", children, style, ...props }: ButtonProps) {
	const backgroundColor = variant === "primary" ? "#6e56cf" : "#2a2a2e";
	const color = "#fafafa";
	return (
		<Pressable
			style={[{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor }, style]}
			{...props}
		>
			<Text style={{ color, fontSize: 14, fontWeight: "600" }}>{children}</Text>
		</Pressable>
	);
}


