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
import { getLayoutedElements } from "../../helper/TreeChatHelper";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

const AcademicTree = () => {
  const layoutedData = useMemo(
    () => getLayoutedElements(nodesMockup, edgesMockup, "LR"),
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
      <Controls/>
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
