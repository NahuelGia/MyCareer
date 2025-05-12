import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Router, Routes } from "react-router";
import { MateriasPage } from "./pages/materias/MateriasPage";
import { SubjectsProvider } from "./context/SubjectsContext";
import "./app.css";
import { CreatorPage } from "./pages/creator/CreatorPage";
import { CalendarPage } from "./pages/calendario";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <ChakraProvider value={defaultSystem}>
         <SubjectsProvider>
            <BrowserRouter>
               <Routes>
                  <Route path="/creator" element={<CreatorPage />} />
                  <Route path="/materias/:id/calendar" element={<CalendarPage />} />
                  <Route path="/calendario/:id" element={<CalendarPage />} />
                  <Route path="/materias/:id" element={<MateriasPage />} />
                  <Route path="/:id" element={<MateriasPage />} />
                  <Route path="/" element={<App />} />
               </Routes>
            </BrowserRouter>
         </SubjectsProvider>
      </ChakraProvider>
   </React.StrictMode>
);
