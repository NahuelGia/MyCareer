import { useMemo, useState, useEffect, useRef } from "react";
import {
   ReactFlow,
   ReactFlowProvider,
   useNodesState,
   useEdgesState,
   Background,
   Controls,
   Node,
   Edge,
   Panel,
   addEdge,
   Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Box, Button, VStack, Text, Input, HStack } from "@chakra-ui/react";
import { DegreeModule } from "@/types/enums/degreeModule";
import SubjectNode from "./SubjectNode";
import tpi from "@/pages/materias/utils/jsonDbs/tpi.json";
import { useNodeManagement } from "./hooks/useNodeManagement";
import { useFileHandling } from "./hooks/useFileHandling";
import { EditPanel } from "./components/EditPanel";
import { AddSubjectPanel } from "./components/AddSubjectPanel";
import { useUser } from "@/context/UserContext";
import {
   createCustomCarrera,
   getUsedCarreraNames,
   getUserCustomCarrera,
} from "@/lib/supabaseClient";
import { useNavigate } from "react-router";

const nodeTypes = { subject: SubjectNode };

export interface SubjectNode {
   id: string;
   type: string;
   position: { x: number; y: number };
   data: {
      nombre: string;
      degreeModule: DegreeModule;
      weeklyHours: number;
      credits: number;
   };
}

export interface CareerData {
   id: string;
   nombre: string;
   materias: {
      id: string;
      position: { x: number; y: number };
      data: {
         label: string;
         status: string;
         weeklyHours: number;
         credits: number;
         prerequisites: string[];
         degreeModule: string;
      };
      type: string;
   }[];
   conexiones: {
      id: string;
      source: string;
      target: string;
   }[];
}

const SubjectTreeEditor = ({ id }: { id?: string }) => {
   const fileInputRef = useRef<HTMLInputElement>(null);
   const { user } = useUser();
   const [nodes, setNodes, onNodesChange] = useNodesState<SubjectNode>([]);
   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
   const [usedNames, setUsedNames] = useState<string[]>([]);
   const [careerData, setCareerData] = useState<CareerData>({
      id: "NUEVA_CARRERA",
      nombre: "Nueva Carrera",
      materias: [],
      conexiones: [],
   });
   const navigate = useNavigate();

   const {
      selectedNode,
      originalNodeData,
      handleNodeClick,
      handleNodeUpdate,
      handleCancel,
      handleSave,
      setSelectedNode,
   } = useNodeManagement(nodes, setNodes);

   const { handleFileUpload, handleDownload } = useFileHandling(
      nodes,
      setNodes,
      edges,
      setEdges,
      careerData,
      setCareerData,
      fileInputRef
   );

   // Update careerData when nodes or edges change
   useEffect(() => {
      const nodeNameMap = new Map(nodes.map((node) => [node.id, node.data.nombre]));

      const updatedMaterias = nodes.map((node) => {
         const prerequisites = edges
            .filter((edge) => edge.target === node.id)
            .map((edge) => nodeNameMap.get(edge.source) || "")
            .filter(Boolean);

         return {
            id: node.id,
            position: node.position,
            data: {
               label: node.data.nombre,
               status: "Pendiente",
               weeklyHours: node.data.weeklyHours,
               credits: node.data.credits,
               prerequisites,
               degreeModule: node.data.degreeModule,
            },
            type: "custom",
         };
      });

      const updatedConexiones = edges.map((edge) => ({
         id: edge.id || `${edge.source}-${edge.target}`,
         source: edge.source,
         target: edge.target,
      }));

      setCareerData((prev) => ({
         ...prev,
         materias: updatedMaterias,
         conexiones: updatedConexiones,
      }));
   }, [nodes, edges]);

   useEffect(() => {
      if (user && id != "TPI" && id != "LI") {
         getUsedCarreraNames(user?.id).then((response) => setUsedNames(response));

         if (id) {
            getUserCustomCarrera(id, user.id).then((response) => {
               setCareerData(response);

               const initialNodes = response.materias.map((materia) => ({
                  id: materia.id,
                  type: "subject",
                  position: materia.position,
                  data: {
                     nombre: materia.data.label,
                     degreeModule: materia.data.degreeModule as DegreeModule,
                     weeklyHours: Number(materia.data.weeklyHours),
                     credits: Number(materia.data.credits),
                  },
               }));

               const initialEdges = response.conexiones.map((conexion) => ({
                  id: conexion.id,
                  source: conexion.source,
                  target: conexion.target,
               }));

               setNodes(initialNodes);
               setEdges(initialEdges);
            });
         }
      }
   }, [user]);

   if (id && !usedNames.includes(id) || id == "TPI" || id == "LI") {
      return <Text> Page not found </Text>;
   }

   const onConnect = (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
   };

   const handleCreation = () => {
      user && createCustomCarrera(user.id, careerData);
      navigate("/");
   };

   return (
      <Box
         h="100vh"
         w="100vw"
         position="fixed"
         top={"4.5rem"}
         right={"0.5rem"}
         overflow="hidden"
      >
         <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{ type: "step" }}
            nodesDraggable={true}
            nodesConnectable={true}
            fitView
            style={{ width: "100%", height: "100%" }}
         >
            <Panel position="top-right">
               <VStack align="stretch">
                  <Box bg="white" p={4} borderRadius="md" boxShadow="md" w="400px">
                     <VStack gap={4} align="stretch">
                        <Text fontWeight="bold">Configuración de la Carrera</Text>
                        <HStack>
                           <Button
                              onClick={() => fileInputRef.current?.click()}
                              colorScheme="blue"
                              flex={1}
                           >
                              Cargar JSON
                           </Button>
                           <Button onClick={handleDownload} colorScheme="green" flex={1}>
                              Descargar JSON
                           </Button>
                        </HStack>
                        <input
                           type="file"
                           ref={fileInputRef}
                           onChange={handleFileUpload}
                           accept=".json"
                           style={{ display: "none" }}
                        />
                        <Input
                           value={careerData.nombre}
                           onChange={(e) =>
                              setCareerData((prev) => ({
                                 ...prev,
                                 nombre: e.target.value,
                                 id: e.target.value.toUpperCase(),
                              }))
                           }
                           placeholder="Nombre de la carrera"
                        />
                        {usedNames.some(
                           (name) => careerData.nombre.toUpperCase() == name.toUpperCase()
                        ) && (
                           <Text color={"red.500"} fontSize="sm">
                              Nombre en uso
                           </Text>
                        )}
                        <Button
                           onClick={handleCreation}
                           colorScheme="green"
                           flex={1}
                           disabled={
                              !careerData.materias.length ||
                              !careerData.nombre ||
                              usedNames.some(
                                 (name) =>
                                    careerData.nombre.toUpperCase() == name.toUpperCase()
                              )
                           }
                        >
                           Crear carrera
                        </Button>
                     </VStack>
                  </Box>

                  <AddSubjectPanel
                     nodes={nodes}
                     setNodes={setNodes}
                     careerData={careerData}
                     setCareerData={setCareerData}
                  />
               </VStack>
            </Panel>

            {selectedNode && (
               <EditPanel
                  selectedNode={selectedNode}
                  onUpdate={handleNodeUpdate}
                  onCancel={handleCancel}
                  onSave={handleSave}
                  onDelete={() => {
                     setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
                     setSelectedNode(null);
                  }}
               />
            )}

            <Background />
            <Controls />
         </ReactFlow>
      </Box>
   );
};

export const SubjectTreeEditorWrapper = ({ id }: { id?: string }) => (
   <ReactFlowProvider>
      <SubjectTreeEditor id={id} />
   </ReactFlowProvider>
);
