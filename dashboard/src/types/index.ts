export interface ServerStatus {
  id: string;
  serverName: string;
  domain: string | null;
  ip: string | null;
  os: string | null;
  installDate: string | null;
  installedKBs: string | null;
  rebootDate: string | null;
  errorDescription: string | null;
  updatedAt: Date;
  createdAt: Date;
}
