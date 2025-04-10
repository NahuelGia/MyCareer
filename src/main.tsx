import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Router, Routes } from "react-router";
import { MateriasPage } from "./pages/materias/materiasPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ChakraProvider value={defaultSystem}>
			<ThemeProvider attribute="class" disableTransitionOnChange>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<App />} />
            <Route path="/materias" element={<MateriasPage />} />
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</ChakraProvider>
	</React.StrictMode>
);
