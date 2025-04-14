import { useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from "@xyflow/react";
import { edgesMockup, nodesMockup } from "../../utils/NodesAndEdgesMockup";
import {
  assignDefaultHandlePositions,
  getLayoutedElements,
} from "../../helper/TreeChatHelper";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import data from "../../utils/jsonDbs/tpi.json";

const nodeTypes = {
  custom: CustomNode,
};

const AcademicTree = () => {
  const { materias, conexiones } = data;

  const layoutedData = useMemo(
    () =>
      getLayoutedElements(
        assignDefaultHandlePositions(materias, conexiones),
        conexiones,
        "LR"
      ),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedData.edges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodesDraggable={false}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};

const AcademicTreeWrapper: React.FC = () => {
  return (
    <ReactFlowProvider>
      <AcademicTree />
    </ReactFlowProvider>
  );
};

export default AcademicTreeWrapper;
