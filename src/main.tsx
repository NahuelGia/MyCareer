import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Router, Routes } from "react-router";
import { MateriasPage } from "./pages/materias/MateriasPage";
import { SubjectsProvider } from "./context/SubjectsContext";
import "./app.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <ChakraProvider value={defaultSystem}>
         <SubjectsProvider>
            <BrowserRouter>
               <Routes>
                  <Route path="/" element={<MateriasPage />} />
                  {/* <Route path="/" element={<App />} /> */}
                  {/* Cuando tengamos la pantalla de inicio Materias debe estar en /materias */}
               </Routes>
            </BrowserRouter>
         </SubjectsProvider>
      </ChakraProvider>
   </React.StrictMode>
);
