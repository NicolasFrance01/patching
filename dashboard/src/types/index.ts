export interface ServerStatus {
  id: string;
  serverName: string;
  grupo?: string | null;
  ambiente?: string | null;
  domain: string | null;
  ip: string | null;
  os: string | null;
  osVersion?: string | null;
  installDate: string | null;
  installedKBs: string | null;
  rebootDate?: string | null;
  runningTime?: string | null;
  diskSpace?: string | null;
  errorDescription: string | null;
  updatedAt: Date;
  createdAt: Date;
}
