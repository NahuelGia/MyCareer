import { MutableRefObject } from "react";
import { Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
import { CareerData } from "../SubjectTreeEditor";

export const useFileHandling = (
  nodes: Node[],
  setNodes: ReturnType<typeof useNodesState>[1],
  edges: Edge[],
  setEdges: ReturnType<typeof useEdgesState>[1],
  careerData: CareerData,
  setCareerData: React.Dispatch<React.SetStateAction<CareerData>>,
  fileInputRef: MutableRefObject<HTMLInputElement | null>
) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        setNodes(
          jsonData.materias.map((materia: any) => ({
            id: materia.id,
            type: "subject",
            position: materia.position,
            data: {
              nombre: materia.data.label,
              degreeModule: materia.data.degreeModule,
              weeklyHours: materia.data.weeklyHours,
              credits: materia.data.credits,
            },
          }))
        );

        setEdges(
          jsonData.conexiones.map((conexion: any) => ({
            id: conexion.id,
            source: conexion.source,
            target: conexion.target,
          }))
        );

        setCareerData({
          id: jsonData.id,
          nombre: jsonData.nombre,
          materias: jsonData.materias,
          conexiones: jsonData.conexiones,
        });

        window.alert("Archivo cargado exitosamente");
      } catch (error) {
        window.alert("Error al cargar el archivo: El archivo no tiene el formato correcto");
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const jsonStr = JSON.stringify(careerData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${careerData.id.toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    handleFileUpload,
    handleDownload,
  };
}; 