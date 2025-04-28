import { useMemo, useState, useEffect } from "react";
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
} from "@xyflow/react";
import {
   assignDefaultHandlePositions,
} from "../../helper/TreeChatHelper";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode/CustomNode";
import { Box, Checkbox, Text } from "@chakra-ui/react";
import { BasicCheckbox } from "../../../../components/Checkbox";
import { DegreeModule } from "../../../../types/enums/degreeModule";
import { useSubjects } from "../../../../context/SubjectsContext";

const nodeTypes = { custom: CustomNode };

const AcademicTree: React.FC = () => {
   const { subjectsData, isLoading } = useSubjects();

   if (isLoading) return <div>Loading...</div>;
   if (!subjectsData) return <div>No data available</div>;

   const { materias, conexiones } = subjectsData;

   const baseNodes = useMemo(
      () => assignDefaultHandlePositions(materias, conexiones),
      [materias, conexiones]
   );
   const baseEdges = useMemo(() => conexiones, [conexiones]);

   const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
   const [edges, setEdges, onEdgesChange] = useEdgesState(baseEdges);
   const [showComplementarias, setShowComplementarias] = useState(false);
   const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

   const edgesToRender = useMemo<Edge[]>(() => {
      if (!hoveredNodeId) return edges;
      return edges.map((e) => {
         return e.target === hoveredNodeId
            ? {
                 ...e,
                 style: { stroke: "red", strokeWidth: 2 },
                 animated: true,
                   markerEnd: {
                     type: "arrow",
                     color: "red",
                   }
              }
            : e;
      });
   }, [edges, hoveredNodeId]);

   useEffect(() => {
      const validIds = new Set(
         showComplementarias
            ? baseNodes.map((n) => n.id)
            : baseNodes
                 .filter((n) => n.data.degreeModule !== DegreeModule.COMPLEMENTARIO)
                 .map((n) => n.id)
      );

      const filteredNodes = nodes.map((n) => ({ ...n, hidden: !validIds.has(n.id) }));

      const filteredEdges = edges.map((e) => ({
         ...e,
         hidden: !validIds.has(e.source) || !validIds.has(e.target),
      }));

      setNodes(assignDefaultHandlePositions(filteredNodes, filteredEdges));
      setEdges(filteredEdges);
   }, [showComplementarias, setNodes, setEdges, baseNodes]);

   const onCheckedChange = () => {
      setShowComplementarias(!showComplementarias);
   };

   return (
      <>
         <ReactFlow
            nodes={nodes}
            edges={edgesToRender}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodesDraggable={false}
            nodesConnectable={false}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{ type: "step" }}
            onNodeMouseEnter={(_, node: Node) => setHoveredNodeId(node.id)}
            onNodeMouseLeave={(_, node: Node) => setHoveredNodeId(null)}
         >
            <Panel position="top-right">
               <Box bgColor={"white"} p={2} borderRadius="md" boxShadow="md">
                  <BasicCheckbox
                     label="Ver complementarias"
                     checked={showComplementarias}
                     onCheckedChange={onCheckedChange}
                  />
               </Box>
            </Panel>
            <Background />
            <Controls />
         </ReactFlow>
      </>
   );
};

const AcademicTreeWrapper: React.FC = () => (
   <ReactFlowProvider>
      <AcademicTree />
   </ReactFlowProvider>
);

export default AcademicTreeWrapper;
