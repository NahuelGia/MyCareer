export type CareerData = {
   id: number;
   data: any;
   data_name: CareerDataName;
   updated_at: string;
};

export enum CareerDataName {
   CALENDAR = "calendar",
   ACADEMIC_TREE = "academic_tree",
}
