export interface Audit {
  action: string;
  status: boolean;
  time: Date;
  details: string;
  userId: number;
}
