import { Node } from '@xyflow/react';

export interface SubjectData {
    label: string;
    status: string;
    weeklyHours: number;
    credits: number;
    prerequisites: string[];
    degreeModule: string;
    available: boolean;
    [key: string]: any;
}

export interface Subject extends Node {
    id: string;
    position: {
        x: number;
        y: number;
    };
    data: SubjectData;
    type: string;
}

export interface SubjectConnection {
    id: string;
    source: string;
    target: string;
}

export interface SubjectsData {
    materias: Subject[];
    conexiones: SubjectConnection[];
} 