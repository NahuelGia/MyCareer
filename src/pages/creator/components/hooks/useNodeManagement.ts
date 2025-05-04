import { useState } from "react";
import { Node, useNodesState } from "@xyflow/react";
import { SubjectNode } from "../SubjectTreeEditor";

export const useNodeManagement = (nodes: Node[], setNodes: ReturnType<typeof useNodesState>[1]) => {
  const [selectedNode, setSelectedNode] = useState<SubjectNode | null>(null);
  const [originalNodeData, setOriginalNodeData] = useState<SubjectNode['data'] | null>(null);

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as SubjectNode);
    setOriginalNodeData({ ...(node as SubjectNode).data });
  };

  const handleNodeUpdate = (updatedData: Partial<SubjectNode['data']>) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updatedData,
            },
          };
        }
        return node;
      })
    );

    setSelectedNode((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        data: {
          ...prev.data,
          ...updatedData,
        },
      };
    });
  };

  const handleCancel = () => {
    if (selectedNode && originalNodeData) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: originalNodeData,
            };
          }
          return node;
        })
      );
    }
    setSelectedNode(null);
    setOriginalNodeData(null);
  };

  const handleSave = () => {
    setSelectedNode(null);
    setOriginalNodeData(null);
  };

  return {
    selectedNode,
    originalNodeData,
    handleNodeClick,
    handleNodeUpdate,
    handleCancel,
    handleSave,
  };
}; 