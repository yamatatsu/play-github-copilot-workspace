import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { useState } from "react";

const App = () => {
	const [value, setValue] = useState("");

	return (
		<SpaceBetween size="m">
			<Header variant="h1">Hello World!</Header>

			<Container>
				<SpaceBetween size="s">
					<span>Start editing to see some magic happen</span>
					<Input
						value={value}
						onChange={(event) => setValue(event.detail.value)}
					/>
					<Button variant="primary">Click me</Button>
				</SpaceBetween>
			</Container>
		</SpaceBetween>
	);
};

export default App;
