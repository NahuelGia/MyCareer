import { Edge, Node, Position } from "@xyflow/react";
import { assignDefaultHandlePositions } from "../helper/TreeChatHelper";
import { SubjectStates } from "./SubjectStates";

const rawNodesMockup: Node[] = [
    // Primer nivel
    { 
      id: '1', 
      position: { x: 100, y: 50 }, 
      data: { label: 'Matemática', status: SubjectStates.COMPLETED }, 
      type: 'custom',
    },
    { 
      id: '2', 
      position: { x: 300, y: 50 }, 
      data: { label: 'Elementos de Programación y Lógica', status: SubjectStates.IN_PROGRESS },
      type: 'custom',
    },
    { 
      id: '3', 
      position: { x: 500, y: 50 }, 
      data: { label: 'Lectura y Escritura Académica', status: SubjectStates.IN_PROGRESS },
      type: 'custom',
    },
    { 
      id: '4', 
      position: { x: 700, y: 50 }, 
      data: { label: 'Organización de Computadores', status: SubjectStates.COMPLETED },
      type: 'custom',
    },
  
    // Segundo nivel (conexión a Matemática)
    { 
      id: '5', 
      position: { x: 100, y: 150 }, 
      data: { label: 'Matemática I' },
      type: 'custom',
    },
    { 
      id: '6', 
      position: { x: 300, y: 150 }, 
      data: { label: 'Matemática II' }, 
      type: 'custom',
    },
    { 
      id: '7', 
      position: { x: 500, y: 150 }, 
      data: { label: 'Introducción a la Programación' },  
      type: 'custom',
    },
    
    // Tercer nivel (conexión a Introducción a la Programación)
    { 
      id: '8', 
      position: { x: 700, y: 150 }, 
      data: { label: 'Programación con Objetos I' }, 
      type: 'custom', 
    },
    { 
      id: '9', 
      position: { x: 900, y: 150 }, 
      data: { label: 'Programación con Objetos II' }, 
      type: 'custom',
    },
  
    // Cuarto nivel (conexión entre otros cursos)
    { 
      id: '10', 
      position: { x: 100, y: 250 }, 
      data: { label: 'Estructuras de Datos' },  
      type: 'custom',
    },
    { 
      id: '11', 
      position: { x: 300, y: 250 }, 
      data: { label: 'Bases de Datos' }, 
      type: 'custom',
    },
  
    // Conexiones de las materias complementarias
    { 
      id: '12', 
      position: { x: 500, y: 250 }, 
      data: { label: 'Complementaria 1' }, 
      type: 'custom',
    },
    { 
      id: '13', 
      position: { x: 700, y: 250 }, 
      data: { label: 'Complementaria 2' }, 
      type: 'custom',
    },
    { 
      id: '14', 
      position: { x: 900, y: 250 }, 
      data: { label: 'Complementaria 3' }, 
      type: 'custom',
    },
  
    // Materias de programación avanzada y desarrollo
    { 
      id: '15', 
      position: { x: 300, y: 350 }, 
      data: { label: 'Construcción de Interfaces de Usuario' },
      type: 'custom',
    },
    { 
      id: '16', 
      position: { x: 500, y: 350 }, 
      data: { label: 'Desarrollo de Aplicaciones' },
      type: 'custom',
    },
    { 
      id: '17', 
      position: { x: 700, y: 350 }, 
      data: { label: 'Estrategias de Persistencia' },
      type: 'custom',
    },
  
    // Materias de redes y sistemas operativos
    { 
      id: '18', 
      position: { x: 100, y: 450 }, 
      data: { label: 'Sistemas Operativos' },
      type: 'custom',
    },
    { 
      id: '19', 
      position: { x: 300, y: 450 }, 
      data: { label: 'Redes de Computadores' },
      type: 'custom',
    },
  
    // Final de la cadena
    { 
      id: '20', 
      position: { x: 500, y: 450 }, 
      data: { label: 'Trabajo de Inserción Profesional' },
      type: 'custom',
    },
  ];

export const edgesMockup: Edge[] = [
  // Relaciones directas entre materias
  { id: "e1-5", source: "1", target: "5" },
  { id: "e1-6", source: "1", target: "6" },
  { id: "e2-7", source: "2", target: "7" },
  { id: "e3-18", source: "3", target: "18" },
  { id: "e4-19", source: "4", target: "19" },

  // Relaciones de dependencias entre materias
  { id: "e5-8", source: "7", target: "8" },
  { id: "e5-9", source: "7", target: "9" },
  { id: "e8-10", source: "8", target: "10" },
  { id: "e9-11", source: "9", target: "11" },

  // Conexiones complementarias
  { id: "e6-12", source: "5", target: "12" },
  { id: "e7-13", source: "6", target: "13" },
  { id: "e8-14", source: "6", target: "14" },

  // Conexión con materias avanzadas
  { id: "e9-15", source: "8", target: "15" },
  { id: "e10-16", source: "10", target: "16" },
  { id: "e11-17", source: "11", target: "17" },

  // Finalización
  { id: "e12-20", source: "17", target: "20" },
];

export const nodesMockup = assignDefaultHandlePositions(rawNodesMockup, edgesMockup);