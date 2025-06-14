import {Edge, Node, Position} from "@xyflow/react";
import Dagre from "@dagrejs/dagre";

const DEFAULT_NODE_WIDTH = 152;
const DEFAULT_NODE_HEIGHT = 20;

export const getLayoutedElements = (
	nodes: Node[],
	edges: Edge[],
	direction: "LR" | "TB"
) => {
	const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
	g.setGraph({rankdir: direction});

	edges.forEach((edge) => g.setEdge(edge.source, edge.target));
	nodes.forEach((node) =>
		g.setNode(node.id, {
			...node,
			width: node.measured?.width ?? DEFAULT_NODE_WIDTH,
			height: node.measured?.height ?? DEFAULT_NODE_HEIGHT,
		})
	);

	Dagre.layout(g);

	return {
		nodes: nodes.map((node) => {
			const position = g.node(node.id);
			const x = position.x - (node.measured?.width ?? 0) / 2;
			const y = position.y - (node.measured?.height ?? 0) / 2;

			return {...node, position: {x, y}};
		}),
		edges,
	};
};

export const assignDefaultHandlePositions = (
	nodes: Node[],
	edges: Edge[]
): Node[] => {
	return nodes.map((node) => {
		const hasIncoming = edges.some((edge) => edge.target === node.id);
		const hasOutgoing = edges.some(
			(edge) => edge.source === node.id && !edge.hidden
		);

		const updatedNode = {...node};

		updatedNode.targetPosition = hasIncoming ? Position.Top : undefined;

		updatedNode.sourcePosition = hasOutgoing ? Position.Bottom : undefined;

		return updatedNode;
	});
};

export function getNodeColor(status: string) {
	switch (status) {
		case "Pendiente":
			return "#FFF2CC"; // Amarillo crema
		case "En curso":
			return "#CCE5FF"; // Azul lavanda
		case "Completada":
			return "#D4F1D4"; // Verde menta claro
		default:
			return "#CBD5E0";
	}
}

export function getBorderStyle(degree: string) {}
