// Auto-generated from multiple CSVs
export type ServerType = 'BSC' | 'BSJ' | 'CORP' | 'NBERSA' | 'NBSF';
export type Ambiente = string;

export interface ServerInfo { type: ServerType; ambiente: Ambiente; grupo?: string; }

export const SERVER_TYPES: ServerType[] = ['BSC', 'BSJ', 'CORP', 'NBERSA', 'NBSF'];

export const GROUPS: string[] = ["DCGrupo1", "DCGrupo2", "DCGrupo3", "DCGrupo4", "DCGrupo5", "DCGrupo6", "DCGrupo7", "DCGrupo8", "Desarrollo1", "Desarrollo2", "Fix1", "Fix2", "Fix3", "Produccion1", "Produccion2", "Produccion3", "Produccion4", "Produccion5", "Produccion6", "Producci�n1", "Producci�n2", "Producci�n3", "Producci�n4", "Producci�n5", "Producci�n6", "Proxy1", "Proxy2", "Proxy3", "Sucursal1", "Sucursal2", "Sucursal3", "Sucursal4", "Testing1", "Testing2", "Testing3", "Testing4", "Veeam1", "Veeam2"];

export const serverTypeMap: Record<string, ServerInfo> = {
  "4DBAS240SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "ABS9-AZUDEV": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "ABS9-BUILD01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "ABS9-BUILD02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "ABS9-DEVSU": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "ABS9-RT01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "ABS9-SUP01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "ABS9-SUP02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "ABS9-TOOLS": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "ABSDEVPROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "ABSDEVTEST_restore": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "ABSPREPROD15DKP": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "ABSRUNDRS": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "ABSRUNPROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "ABSRUNTEST_replica": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "ACCESO238VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "ACCESOSUC": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "ADINTAP-D": {
    "type": "NBERSA",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "ADINTAP-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "ADINTAP-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "ADINTARWS-BEE-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "ADINTDB-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "ADMPAI108SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "ADMPAI108TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "AONOCEDB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "APEXONE56SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "APIDMEDIA47SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "APIDMEDIA74SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "APPCOR6-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "APPCOR6VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "APPDRS222SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "APPPAI22VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "APPS19VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "APPTI250VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "APPV01VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "APPV02TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "APPV02VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "APPV03SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "APPV04SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "ASJDC01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "ASJDC04": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "ASJDC05": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "ASJDC06": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "ATE49SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "AUPDT11SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "App0401": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "App17201": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "App25001": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "App25002": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "BATCH240VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BD2016": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "BDBSM84VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "BDLINK118VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BERABSDEV-W2019S01T- Octavio Palomino": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BERABSRUNUAT": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BERABSTFS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BERAPPRAT01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BERBPRISMSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BERBPRISMSRV01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BERCBANKIIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BERDC01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "BERDC01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "BERDEBMEDIADB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BERDEBMEDIAPP01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BERDEBMEDIAPP01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BERENROLLBFF01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BERENROLLWEB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BERENROLLWEB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BERFDSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BERFDSQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BERGCONTASQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BERGCONTAWEB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BERINSTBFF01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BERINSTBFF01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BERINSTBFF02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BERINSTWEB01DEV": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BERINSTWEB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BERINSTWEB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BERINSTWEB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BERINSTWEB02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BERJENKCON01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BERJENKCON02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BERMCESIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BERMCESIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BERMCESIS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BERMCISIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BERMCISIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BERMCISIS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BERMCISIS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BEROCEAPI01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BEROCEAPI01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BEROCEAPI01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BEROCEAPI02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BEROCEAPI03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BEROCEDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BEROCEDB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BEROCEDB03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BEROCEIS01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BEROCEIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BEROCEIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BEROCEIS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BEROCEMS01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BEROCEMS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BEROCEMS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BEROCEMS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BEROCEMS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BEROMNIFS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BEROMNIPB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BEROMNIWS02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BERONBOARDDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BERONBOARDDB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BERONBOARDMS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BERONBOARDMS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BERONBOARDMS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BERONBOARDMS02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BERPREX01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BERPRICINGWEBP": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BERPRICINGWEBT": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BERPWRCRVDA01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BERPWRCRVDA01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BERPWRCRVDA02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BERPWRCRVDAS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BERPWRCRVDAS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BERSBALSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BERSBALSQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BERSONPRTG01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BERSONPRTG01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BERSONPRTG02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BERSONPRTG02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BERSTDINSQL01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BERSTDINWEB01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BERSTDINWEB02D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BERVUFADB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BERVUFADB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BERVUFADB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BERVUFADB02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BERVUFADB03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BIETL-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "BMC45SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BMC45SRV-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "BOMGAR163VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BOMGARV165VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "BRS111SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BRS11SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSC0103": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSC0131": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSCABSRUNUAT": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSCBPRISMSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSCBPRISMSRV01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSCCBANKIIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSCDEBMEDAPP01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSCDEBMEDIADB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSCDEBMEDIADB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSCDEBMEDIAPP01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSCDESA08": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSCDESANICO": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSCEAE01": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "BSCFDSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSCFDSQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSCGCONTASQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSCGCONTAWEB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSCINSTBFF01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSCINSTBFF01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSCINSTBFF02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSCINSTWEB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSCINSTWEB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSCINSTWEB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSCINSTWEB02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSCMCESIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSCMCESIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSCMCESIS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSCMCISIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSCMCISIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSCMCISIS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSCOCEAPI01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSCOCEAPI01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSCOCEAPI01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSCOCEAPI02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSCOCEAPI03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSCOCEDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSCOCEDB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSCOCEDB03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSCOCEIS01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSCOCEIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSCOCEIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSCOCEIS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSCOCEIS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSCOCEMS01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSCOCEMS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSCOCEMS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSCOCEMS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSCOCEMS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSCOMNIFS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSCOMNIRATL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSCOMNISQL02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSCOMNIWS02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSCONBOARDDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSCONBOARDDB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSCONBOARDMS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSCONBOARDMS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSCONBOARDMS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSCONBOARDMS02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSCPRICINGWEBP": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSCPWRCRVDA01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSCPWRCRVDA01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSCPWRCRVDA02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSCPWRCRVDAS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSCSBALSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSCSBALSQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSCSONPRTG01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSCSONPRTG01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSCSONPRTG02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSCSONPRTG02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSCSTDINSQL01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSCSTDINWEB01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSCSTDINWEB02D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSCVUFADB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSCVUFADB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSCVUFADB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSCVUFADB02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSCVUFADB03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSF000XPRE02": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSF001APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF001DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF002APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF002DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF003APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF003DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF004APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF004DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF005APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF005DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF006APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF006DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF008APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF008DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF009APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF014APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF014DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSF021APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF021DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF022APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF022DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF023APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF023DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF024APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF024DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF025APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF025DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF026APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF027APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF027DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF028APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF028DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF030DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF031APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF031DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF032APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF032DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF033APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF033DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF034APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF034DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF035APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF035DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF036APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF036DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF037APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF037DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF038DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF040APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF040DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF041APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF041DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF042APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF042DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF043APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF043DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF044APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF044DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF045APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF045DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF046APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF046DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF048APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF048DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF050APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF050DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF051APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF051DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF054APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF054DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF055APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF055DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF056APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSF056DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF057APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF057DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF058APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF058DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF059APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF059DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF061APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF061DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF062APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF062DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF067APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF067DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF071APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF071DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF074APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF074DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF076APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF076DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF078APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF078DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF080APPWP1.nbsf.com.ar": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF080DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF081APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF081DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF101APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF101DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF202APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSF202DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF400APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF400DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF406APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF406DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF410APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF410DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF421APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF421DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF426APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF426DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF428APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF428DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF429APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF429DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF431APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF431DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF434APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF434DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF438APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF438DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF440APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF440DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF441APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF441DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF442APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF442DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF444APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF444DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF457APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF457DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF476APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF476DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF500APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF500DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF501APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF501DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF502APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF502DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF503APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF503DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF504APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF504DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF505APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF505DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF506APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF506DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF507APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF507DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF508APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF508DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF509DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF510APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF510DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF511APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF511DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF512APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF512DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF514APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF514DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF515APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF515DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF516APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF516DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF517APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF517DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF518APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF518DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSF519DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF520APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF520DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSF521APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF521DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF522APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF522DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF523APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF523DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF524APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF524DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF526APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSF526DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF527APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF527DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF528APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF528DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF530APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF530DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF531APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF531DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF532APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF532DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF533APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF533DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF534APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF534DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF535APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF535DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF536APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF536DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF537APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF537DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF538APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF538DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF539APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF539DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF540APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF540DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF541APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF541DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF542APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF542DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF543APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF543DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF544APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF544DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF545APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF545DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF546APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF546DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF547APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF547DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF548APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF548DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF549APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSF549DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF550APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF550DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSF551APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF551DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF552APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSF552DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF553APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF553DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF554APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF554DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF555APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF555DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF556APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF556DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF558APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF558DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF560APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF560DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF563APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF563DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF565APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF565DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSF566APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF566DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF569APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF569DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF596APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF596DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSF599APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF599DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF600APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF600DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF601APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF601DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF700APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF700DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF701APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSF701DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF706DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF716DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSF718APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF718DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF722APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF722DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF727APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF727DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSF733APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF733DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF742APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF742DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF755APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF755DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF766APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF766DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF767APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF767DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF798APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF798DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF799APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF799DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF800APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF800DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF826APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF826DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "BSF857APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSF857DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "BSF900APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "BSF900DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "BSF933APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "BSF933DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "BSF990APPWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "BSFACTAPPWD1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFACTDMZWEBTW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFACTENGSQLDW1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTENGWEBDW1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFACTESSTW01": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTESSTW02": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFACTEVODW1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTEVOWT1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTGXPTW1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFACTGXPTW2": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFACTHIKTW1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTINFRASQL1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFACTINFRASRV1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTMAILPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFACTMAILPW2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFACTMSGWT1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTMSGWT2": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTPDFWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFACTPOLICYT1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFACTPTFWT1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFACTPWRDASWT1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFACTPWRDAWT1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTSQL07TW1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTSQLM4T": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFACTSQLSDYW": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTSQLW1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTSQLW3": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTSQLW4": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTSQLWD1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTSRVINFRA1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFACTSRVTW1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFACTSRVTW2": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTTSNWT1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFACTWACW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFACTWEBWT1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFACTWEBWT2": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFAPI1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFAPI1T": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFAPI2P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFAPIMGRDMZT1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFAPIMGRTEST1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFAPR1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFAST1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFAST2P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFBPRISMSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSFBPRISMSRV01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSFBRK1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFBRK1T": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFBS1T": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFCACC1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFCBANKIIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSFCCEVOWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFCCPACLWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFCCPASSETPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFCCPBSTW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFCCPDBSITEPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFCCPDMZWEBPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFCCPEMSP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFCCPESSPW01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFCCPESSPW02": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFCCPGOAGWPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFCCPGOAPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCPGOAPW2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFCCPGOASQLPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCPLEXDMZWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFCCPLEXWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFCCPMAEPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFCCPMAILPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFCCPMAILPW2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFCCPMOBPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFCCPMODODMZP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFCCPMODOINPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFCCPMSGPW2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFCCPOMNIPRTG1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCPPBCWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCPPDFWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCPPDFWP2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCPPDFWP3": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFCCPPEMPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFCCPPROBATCH1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCPQRADARWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCPRNPERWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFCCPSAAPW2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFCCPSEGMIM1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFCCPSIPW21": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCPSIPW22": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFCCPSOP0PW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFCCPSQLPW01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFCCPSQLSDYW": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFCCPSQLW02": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFCCPSQLW03": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFCCPSQLW04": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFCCPSRVPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFCCPSRVPW2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFCCPTSNWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCPWEBWP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCPWEBWP2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFCCSQLM4WP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFDEBMEDAPP01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSFDEBMEDDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSFDEBMEDIADB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFDEBMEDIAPP01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFDEBMEDIAPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFDEEP1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFDEMEDIATW1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFDESAPP01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFDMZTMC1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFDMZTMC1T": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFDRPDC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFDRPDC2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFDRPDCPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "BSFDRPDCPW2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "BSFDRPROSPXY01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam1"
  },
  "BSFDRPROSPXY02": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam1"
  },
  "BSFDRPSNMPC902": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFDRPSNMPCW2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFENG3D": {
    "type": "NBSF",
    "ambiente": "Desarrollo",
    "grupo": "Testing1"
  },
  "BSFENG3P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFENG3T": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFENROLLBFF01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSFENROLLWEB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSFENROLLWEB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSFESCO1T": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFEXCE1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFFDSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSFFDSQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFGCONTASQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSFGCONTAWEB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSFGXSQL1P": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFHELIX1P": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFHELIX1T": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFINSTBFF01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSFINSTBFF01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFINSTBFF02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSFINSTWEB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSFINSTWEB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSFINSTWEB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSFINSTWEB02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSFINSTWEB03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSFLEG1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFLOG1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFLOG1T": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFMBAM01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFMCESIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSFMCESIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFMCESIS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSFMCISIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSFMCISIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSFMCISIS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSFMCISIS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSFMCISIS04P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSFOCEAPI01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSFOCEAPI01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSFOCEAPI01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFOCEAPI02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSFOCEAPI03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSFOCEDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSFOCEDB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSFOCEDB03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSFOCEIS01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSFOCEIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSFOCEIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFOCEIS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSFOCEIS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSFOCEMS01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSFOCEMS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSFOCEMS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFOCEMS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSFOCEMS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSFOMNIFS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSFOMNISQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFONBOARDDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSFONBOARDDB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSFONBOARDMS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSFONBOARDMS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSFONBOARDMS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSFONBOARDMS02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFPAI1T": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFPTF1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFPWRCRVDA01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSFPWRCRVDA01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSFPWRCRVDA02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSFPWRCRVDA02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSFPWRCRVDA03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSFPWRCRVDAS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSFPWRCRVDAS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFPWS1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFPWS2P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFRAD1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "BSFRAD2P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFRAS1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFREGFIRMSQL": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSFREGFIRMSQLT": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFREP1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFSBALSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSFSBALSQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFSONPRTG01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSFSONPRTG01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSFSONPRTG02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSFSONPRTG02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSFSQL1D": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFSQL1T": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFSQL7D": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSFSQL7P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFSVN1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "BSFSWP1P-WEB": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "BSFTSC1D": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "BSFVUFADB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSFVUFADB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSFVUFADB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSFVUFADB02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSFVUFADB03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSFWEB1D": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "BSFWEB1P": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "BSFWEB1T": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSJABSRUNUAT": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSJAPIWSO2T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSJAPIWSO2TDMZ": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSJBPRISMSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSJBPRISMSRV01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSJCBANKIIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSJCORP112DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSJCORP113DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSJCORP114DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "BSJCORP130DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSJCORP131DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSJCORP132DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSJCORP133DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSJCORP134DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "BSJDC01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "BSJDEBMEDAPP01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSJDEBMEDDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSJDEBMEDIADB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSJDEBMEDIAP01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSJDRPPXY01": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSJDRPPXY02": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSJENROLLWEB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSJFDSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSJFDSQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSJGCONTASQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSJGCONTAWEB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSJINSTBFF01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSJINSTBFF01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSJINSTBFF02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSJINSTWEB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSJINSTWEB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSJINSTWEB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSJINSTWEB02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSJMCESIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSJMCESIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSJMCESIS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSJMCISIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSJMCISIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSJMCISIS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSJOCEAPI01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSJOCEAPI01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSJOCEAPI01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSJOCEAPI02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSJOCEAPI03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSJOCEDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSJOCEDB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSJOCEDB03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSJOCEIS01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSJOCEIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSJOCEIS01T_03_12_restored": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSJOCEIS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSJOCEMS01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSJOCEMS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSJOCEMS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSJOCEMS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSJOCEMS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSJOMNIFS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSJOMNIRATL02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSJOMNISQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSJOMNISQL02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSJOMNIWS02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSJONBOARDDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSJONBOARDDB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSJONBOARDMS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSJONBOARDMS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSJONBOARDMS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSJONBOARDMS02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSJONBOARDMS03T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSJPRICINGWEBP": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSJPWRCRVDA01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSJPWRCRVDA01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSJPWRCRVDA02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSJPWRCRVDAS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSJPWRCRVDAS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "BSJSBALSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSJSBALSQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "BSJSIBLINKUAT": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "BSJSOCORP213DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BSJSOCORP214DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSJSOCORP215DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "BSJSOCORP216DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSJSOCORP217DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSJSONPRTG01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "BSJSONPRTG01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSJSONPRTG02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "BSJSONPRTG02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSJSTDINSQL01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSJSTDINWEB01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSJSTDINWEB02D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "BSJVUFADB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "BSJVUFADB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "BSJVUFADB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "BSJVUFADB03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "BomgarV162vrt": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "CAC67VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "CAJAVDIF2K": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "CAPS147VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "CAXCOM32VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "CC111SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "CC148SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "CDP168SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "CDP68SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "CLOUDERAAPI01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "CLOUDERAAPI01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "CLOUDERAAPI02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "CLOUDERAAPI03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "CLOUDERAAPI04P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "CLOUDERAAPI05P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "CLOUDERAAPI06P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "CLOUDERAAPI07P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "CLOUDERAAPI08P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "CLOUDERADB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "CLOUDERADB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "CLOUDERAIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "CLOUDERAIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "CLOUDERAIS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "CLOUDERAMS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "CLOUDERAMS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "CLOUDERAMS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "CLOUDERAMS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "CLOUDERAMS04P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "CLOUDERAMS05P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "CLOUDERAMS06P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "CLOUDERAMS07P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "CLOUDERAMS08P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "CM244VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "CODEX64VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "COMX33SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "CONECADINVP": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "CONNECT88F2K": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "CORP000DC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "CORP000GC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "CORPDRPDCPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "CORPDRPDCPW2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "CSMH01SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "CSRH02SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "CST135SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "CST35SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "CTRWET01T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "CTRWET02T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "CUSD57VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "CUSD75VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "DB04VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "DB10VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "DB11VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "DB12VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "DB13VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "DB14VRT-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "DB15VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "DB16VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "DB17VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "DB3VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "DB5VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "DB65VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "DB6VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "DB6VRT-PRE": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "DB7VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "DB87SQL2008": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "DB88SQL2012": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "DB8VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "DB97SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "DB9VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "DBCOR60-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "DBCOR60VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "DBEngageDesa": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "DBHZN19VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "DBLINKVRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "DBMDE27VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "DBPRMQ25": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "DBRDM31VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "DC01DMZ": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "DC01EMPTST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "DC01SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "DC01TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "DC02DMZ": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "DC02EMPTST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "DC02SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "DC02TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "DCP100VRT": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "DCSEMP01": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "DCSEMP02": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "DEEP55VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "DEVABS143": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "DEVABS143PREP": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "DEVOC14DRS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "DHCP76SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "DHCP77SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "DKPREPROD13VRT": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "DLOGS218SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "DLOGS228SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "DVI121DKP-F2K": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "Dimensional-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "ECHECK50SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "EDH-SUPPORTWIN": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "EFLOWDB62SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "EMA75SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "EMADB75VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "EMADB76VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "ENG19DBSRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "ENGAGE07VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "ENGAGEMD": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "ENGDB59SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "ER-SERVICIOS": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "ERSERVICIOSDC03": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "ETSDB38VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "EWF60": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "F2K021DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "F2K500DKP": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "F2K600DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "FAC83DSK": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "FATCA": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "FRDBSJ01DC": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "FRDBSJ03DC": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "FS-CDG154": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "FS-COM155": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "FS-DVI231": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "FS-FINAN157": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "FS-GGDIR158": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "FS-LEXAUDIT151": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "FS-OHVDI89": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "FS-OPERAC153": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "FS-RHMRO159": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "FS-RROP160": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "FS-SYS152": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "FS156VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "GOA47SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "GOA48SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "GOAD47SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "GOAD48SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "GPC85SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "GPSECMODO01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "GPSECMODO01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "GRAF121SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "GRAFO33VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "GRAFODESA": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "HCS230SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "HK110SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "HUB02SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "INFOC92VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "INTRANETUSERS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "INVGCONEC01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "INVGCONEC02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "IS4DB": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "IS4SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "IWBCA13SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "Invgate_Assets_BSJ": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "Invgatebsj2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "JUD61SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "LD187SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "LEGD62VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "LEGDB40VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "LXD74VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "MBT192VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "MCK12VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "MDE26CLON": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "MDE26SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "MDE26VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "MDE26VRT-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "MEAPMFA10SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "MERCAP131VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "MERCAP31SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "MERCAP32VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "MERCAP36DB": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "MERCAPDB136VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "MESCON115": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "MIM16SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "MOBSEC243VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "MONITORWF": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "MSEXC01VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "MSEXC02VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NBSF000APPCSH01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "NBSF000BESMART1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "NBSF000CA02": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "NBSF000DC2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "NBSF000DC3": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "NBSF000DC4": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "NBSF000DC5": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "NBSF000DEXMGR01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "NBSF000DHCP1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "NBSF000DHCP2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "NBSF000GC1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "NBSF000JIRA": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "NBSF000KMS01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "NBSF000PAI02": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "NBSF000PROBATCH": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "NBSF000SOS01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "NBSF000SQL17": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "NBSF000SQLALGN01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "NBSF000VEEAM02": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam2"
  },
  "NBSF000VEEAM03": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam1"
  },
  "NBSF000VEEAMONE": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam2"
  },
  "NBSFADDSPAI01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "NBSFDESMSG01": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "NBSFDESSQL06": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "NBSFDMZWEB12": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "NBSFINFRASQL01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "NBSFMGRSQL02": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "NBSFMGRSQL04": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "NBSFPTFLOG03": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "NBSFSFEMPDC3": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "NBSFSFEMPDC4���": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "NBSFSIAPEX1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "NBSFTESTSOS01": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "NBSFVEEAMMNT01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam1"
  },
  "NBSFVEEAMPXY03": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam1"
  },
  "NBSFVEEAMPXY04": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam2"
  },
  "NBSFVEEAMPXY05": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam2"
  },
  "NBSFVMWAPPCSH1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "NBSFVMWAPR103": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "NBSFVMWBESMART1": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "NBSFVMWDMZWEB04": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "NBSFVMWPROBATCH": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "NBSFVMWSIDESYS1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "NBSFVMWSOS01": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "NIW85VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS0001DC": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS020": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS020DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS020PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS020PRX1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS020PRX2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS020SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS021": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS021SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS022": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS022SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS100DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS100PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS100PRX1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS100PRX2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS100SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS100V": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS101": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS101DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS101SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS101TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "NTS102": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS102DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS102PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS102PRX2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS102SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS103": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS103DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS103PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS103PRX2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS103SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS105": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS105DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS105PROX2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS105PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS105SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS106DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS106PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS106PRX1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS106PRX2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS106SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS106V": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS107": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS107DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS107PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS107PRX": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS107SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS11": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS113DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS113PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS113PRX": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS113SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS113V": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS115": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS115DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS115PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS115PRX": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS115SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS116": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS116DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS116PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS116SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS119": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "NTS119DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS119PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS119PRX1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS119PRX2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS119SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS119V": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "NTS120": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS120DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS120PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS120PRX1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS120PRX2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS120SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS126BVRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS126VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS128": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS128SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS128T": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "NTS15": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "NTS174VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS17VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS183VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS187": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS18VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS19": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS190VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS202VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "NTS203": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS203DCS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS203PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS203PRX1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS203PRX2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS203SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS204": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS204DC": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS204PRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS204PRX1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS204PRX2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS204SAM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS20VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS21": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS21VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS23VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS24VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "NTS28VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS29VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS30B": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS30VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS32": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "NTS32VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS32desa": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "NTS32test": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "NTS33VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS34VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS36": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "NTS36VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "NTS36desa": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "NTS36test": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "NTS37": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "NTS41": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS41TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "NTS43NVO": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "NTS43VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS46VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS47VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS49SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "NTS49VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "NTS501V": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS502V": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS51VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS52VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS53VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS54VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS57VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS58VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS60": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "NTS601": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS60A": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS60BVRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS60VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "NTS66VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS67VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS76VRTFS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS77VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "NTS78ABS": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "NTS78ABSPREP": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "NTS78VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "NTS80VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS80VRT_TMP": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "NTS81VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "NTS82PKIVRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS82VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS83PKIVRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS84VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTS87SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS87VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS88VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTS94VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTS96": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "NTS96AFIP_NV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTS98VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTS9VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "NTSMDC02": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "NTSMDC03": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "NTSMDC04": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "NTSMDC05": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "NTSMDC06": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "OCPFE123SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "OCPFE23SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "OCPMS99SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "OSXG130VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "PAI-BLACKLIST": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "PAI10VM": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "PAI74SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "PAISVR07VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "PC80DSK": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "PHPWIN93SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "PIVOT-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "PIVOT21DMZ": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "PIVOT242SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "PIVOTCORP12SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "PIVOTL150VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "POCDVI89F2K": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "PP40VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "PRA218SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "PRA219SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "PROB14-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "PROB14ABSPREP": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "PROB14VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "PROBATCHWEBP": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "PROBATCHWEBT": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "PROBDB23-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "PROBDB23ABSPREP": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "PROBDB23SRV": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "PROBDB23VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "PROBDB48SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "PROBW214": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "PROBWEB24ABSPREP": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "PRT75VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "PRTG186VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "PRXCPD201SJ": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "PRXVBK30SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "PRXVBK31SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "PRXVBK32SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "PRXVBK33SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "PRXVBK34SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "PRXVBK35SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "PRXVBK36SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "PRXVBK37SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "PTCDC01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "PTCDC02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "PTCDC03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "PTCDMZ01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "PTCDMZ01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "PTCDMZ01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "PTCEDC01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "PTCEDC02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "PTCEDC03": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "PTCEDC04": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "PTCEXC02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "PWCCE-DAS-01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "PWCCE-DAS-01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "PWCCE-SDS-01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "PWCCI-DAS-01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "PWCCI-DAS-01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "PWCCI-DAS-01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "PWCCI-SDS-01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "PWCCI-SIS-01D": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "PWS215SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "PWS216SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "PY40SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "PortalAPP": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "PortalAPP02": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "PortalWeb-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "QUALIADC01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "QUALIADC02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "QUALIADC03": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "RDSPIVOT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "REPOPAI38SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "RITEST-TEST": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "RMA44": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "ROOTDC1601": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "ROOTDC1602": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "ROOTDC1603": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "RSGO210DKP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "RTABS142": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "RTABS142PREP": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "RUNDECK125SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "SCF116SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "SCO53-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "SCO53VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SDR70TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "SDR70VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SDR71TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "SDR71VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SDR95VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SEGINFOSHP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SERV23SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SFBPRINT39VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "SFEDRPDCPW1": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "SFEDRPDCPW2": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SFR71SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "SFRBD72SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "SI58SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SI59SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SIDB62ABSPREP": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "SIDB62VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SINCRO54SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SINCRO54VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "SIOPELBSC_RST": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SLPNTIQS69SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "SNMPC250SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SONDA23SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SOS18VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "SPOT247VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SPPC17SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "SQLW2012-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "SRV-001-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRV-001-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SRV-002-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "SRV-002-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SRV-003-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "SRV-004-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "SRV-005-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRV-006-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRV-006-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SRV-007-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "SRV-008-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRV-009-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRV-010-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "SRV-011-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "SRV-012-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "SRV-013-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRV-013-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SRV-014-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRV-014-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SRV-015-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "SRV-016-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRV-017-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRV-018-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "SRV-019-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "SRV-020-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "SRV-020-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SRV-021-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRV-022-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRV-023-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "SRV-023-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SRV-024-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRV-024-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SRV-025-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRV-026-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "SRV-026-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SRV-027-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "SRV-028-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "SRV-029-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRV-030-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRV-030-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SRV-031-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "SRV-031-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SRV-032-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRV-033-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRV-034-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "SRV-034-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SRV-035-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "SRV-036-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "SRV-038-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRV-040-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRV-041-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "SRV-042-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRV-042-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SRV-044-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRV-044-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SRV-046-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "SRV-046-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SRV-047-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "SRV-048-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "SRV-049-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRV-050-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRV-050-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SRV-051-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "SRV-051-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SRV-052-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRV-053-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRV-055-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "SRV-055-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SRV-057-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "SRV-060-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "SRV-062-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRV-062-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SRV-063-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRV-063-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SRV-064-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "SRV-064-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SRV-065-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRV-065-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SRV-066-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRV-066-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SRV-068-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "SRV-069-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "SRV-070-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "SRV-071-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRV-072-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRV-073-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "SRV-073-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SRV-078-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRV-079-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRV-080-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "SRV-080-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SRV-081-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "SRV-083-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "SRV-083-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SRV-084-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRV-085-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRV-086-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "SRV-087-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRV-091-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRV-092-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "SRV-093-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "SRV-093-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SRV-094-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "SRV-094-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SRV-095-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRV-197-DC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRV-197-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SRV-DB2": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SRV-DC001": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRV-DC002": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRV-DCCERRITO": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "SRV.009-DC-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SRV120VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRV181VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVAGCTRLR01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVAPIWIN03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVAPP01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVAPPFCI01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVAPPFCI01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "SRVAUDITORIAVRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVAZADCONN01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRVAZDCONN03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRVAZRSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVBEYOND01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVBEYOND02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVBPRISM01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "SRVBSJDC01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVBTAUX01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVBTAUX02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVCA01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVCAMPADOBEP01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVCAMPADOBEP02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVCAMPADOBEP03": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVCAMPADOBEP04": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVCAPAPP01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVCAPDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVCCTVGP01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVCITASWEB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVCITASWEB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVCMSBO01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVCOMANAG01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVCOMANAG01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVCOMBACK01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVCOMBACK01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVCOMFRON01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVCOMFRON01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVCORPWEB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVCORPWEB02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVDB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVDBACADGDD01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVDBFCI01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVDBFCI01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVDBVRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "SRVDC01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRVDC01BSF": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "SRVDC02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRVDCBSF01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "SRVDCBSF1": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVDCDRS01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "SRVDCNBER01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVDCOMNIPP01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SRVDCOMNIPP02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "SRVDEPIIS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVDEPIIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVDEPSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVDEPSQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "SRVDMZ01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVDOCDIN01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVEAE01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVEAE03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVEFLOWTSQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "SRVEFLOWTWEB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVEFLOWTWEB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVEMANAGDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVENGAGEWA01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVENGWABER01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVENGWABSC01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVENGWABSF01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVENGWABSF01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVENGWABSJ01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVEXGPSA01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVEXGPSA03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVEXGPSA04P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVEXSR01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVFDAPIDIC01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVFDAPIDIC01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "SRVFS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVFSBKPSQL": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVFSCORP01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVFSCORP02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVFSSAS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVFSUSR01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVGDS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVGENVCARD01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVGOADMZHA01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVGOADMZHA02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVGOAHA01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVGOAHA02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVHELIX01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVHELIX01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVIIS02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVINTEG01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVINTEG01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVINTEG02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVINTEG02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVINVAM02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVINVAM02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "SRVINVSD02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVINVSD02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVJIRA02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVJIRA02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "SRVJMETERT01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVKIWICT01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVMEPSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVMERCAPDB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVMERCAPDB01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVMIGEKM01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVMONAPP01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVMOODLSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVMOODLSQL02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVMSTIO01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVNAP1601P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVNOCSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVNSCACHE01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVNUCLEUS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVNUCLEUS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVOCRBAL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVOCRBAL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVOMNIBOPI01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVOMNIBOPI01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVOMNIPRTG01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVOMNIPRTG02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVOMNITOSCA01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVPACOREIIS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "SRVPACORESQL01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVPACTAS01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVPDBACTAS01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVPROBATCH01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVPROBCORP01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVPROCAN01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVPROCAN02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVPROCAN03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVPROCAN04P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVPROCAN05P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVPROCAN06P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVPRTG01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVPSWSAFE01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVPSWSAFE02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVPVTDBA01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVPWCDASCET": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "SRVPWCDASCIT": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVPWCESQLC1P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVPWCESQLCI2T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVPWCESQLCIT": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVPWCSDSCI2T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVPWCSQLC1P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVPWCSQLC2P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVPWCSQLC3P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVPWCSQLCI2T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVPWCSQLCID": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVPWCSQLCIT": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "SRVPWCSYSCET": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVPWCSYSCIT": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVPWRCRVDA01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "SRVPWRCRVDA02D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "SRVPWRCRVDA03D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "SRVPWRCRVDAS01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "SRVPWRCRVDAS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVPWRCRVDAS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVPWRCRVSDS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVRECGP01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVSELENI01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "SRVSELENI02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVSMARTRISK01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVSNIPE01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVSNMPC01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVSNMPC02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVSQL01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "SRVSQL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVSQL02D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "SRVSQL02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVSQL03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVSQL2019T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "SRVSQLCITAS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVSQLCITAS01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVSQLCITAS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVSQLMON02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVSQLTIPAI01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVSQLTYS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVSQLTYS02P_restored": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVSQLTYS02T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVSQLTYS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVSQLTYS03T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "SRVSQLTYS04P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVSQLTYS04T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "SRVSTGSQLVB01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVSTGSQLVB1P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVTABBRIDGE01D": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "SRVTABLEAU01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVTACTAS01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVTDATAETL01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVTDBACTAS01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVTMERCAPDB01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVTMERCAPP01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVTMMOBILE01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVTOUCHONE": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVTRENDAPEX01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVTRENDDSM01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVTRENDDSM02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVTRENDMAC01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVTS02P (TS usos varios)_restored_20072025": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVTS03P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVTS04P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVTS05P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVTS06P (Nuevo Servidor Licencias TS)": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVTSACADGDD01T": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "SRVTSAWS01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVTSCCM01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVTSCOM01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVTSGDD01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVTSGDD02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVTSPAI01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVTSVISA01P (Recupero)": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVTSVM01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SRVTSWET01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "SRVUASM01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "SRVUNISYSFS": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SRVWSUS02P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SRVXCOM01P": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SV-ABSDEV9-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "SV-ABSRUN9-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "SV-ABSTFS9": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-ADINTARWS-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-ADINTARWS-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "SV-ARE-TEST": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "SV-ATE-AP-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "SV-ATE-DB-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "SV-BER-PIVOT": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-BERAVISODB-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-BESMART-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-BKP-VEEAM-SUC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-BeSmart-Test": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "SV-CCTV-STORAGE": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-CEDIPCOELSA-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-CEDIPCOELSA-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "SV-CONTROLWF-22": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-DCCENTRAL01": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "SV-DepRMT2-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-Dimensional-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "SV-EKM-PR": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-EXC02": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-EXC03": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-Echeck-SA": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-Evo-Tran-C": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-Evo-Tran-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-Evo-Translator-QA": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "SV-F2KU-TEST-1": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "SV-F2KU-TEST-2": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "SV-FIRMA-GRA-PR": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-FIRMADB-PR": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-FTPS-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-GOA-GW01": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-GOA-GW02": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-GOA-MFT01": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-GOA-MFT02": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-GRAFANA-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-HELIX-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-HELIX-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "SV-LD-AP-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-LDDB-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-MEP-BD-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "SV-MONITOREO": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-MONITOREO-POOL": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-NBERSAMAIL-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-NBERSAMAIL-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "SV-NTP": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-OTRS-HIST": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-PAI-SERVER22": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-PAYAPI-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "SV-PGC-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-PGC-Test": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "SV-PWS-01": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-PWS-02": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-PassSafe1": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-PassSafe2": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-RELAYWL": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-RI-RO-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "SV-RIOP": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-ROOTBER01": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "SV-ROOTBER01-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-ROOTBER02": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "SV-ROOTBER02-2022": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-SD-JEE-TEST": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "SV-SFBSoaV3-V4-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "SV-SFBSoaV3V4B": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-SOAV34A-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-SOAV34B-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-SOJCOELSA-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-SONDAS-PRTG": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-SQL-Algeiba": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-SQL13-01-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-SQL13-02-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-SQL8-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-SQL9-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-STANDINDB-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-TESINWEB-PR": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-TESINWEB-TE": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "SV-VEEAM-SUC": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SV-VPROXY3-PR": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-WEB22-TEST": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "SV-WEB9-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SV-WF-DB-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SV-WSUS-CEN": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SV-XCOM-P": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SVATEAPPR": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SVATEDBPR": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SVDEBMEDIAAPP": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SVDEBMEDIABDP": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SVENGAP-D": {
    "type": "NBERSA",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "SVENGAP-T": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "SVENGAPP": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SVENGDB-DESA": {
    "type": "NBERSA",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "SVENGDB-TEST": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "SVFEDEOL22-PR": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SVPROXY-VEEAM1": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "SVPROXY-VEEAM2": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SVSIBANK(para  Interbanking TCP)": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SVSWIFTCONT": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SVSWIFTCONT_restore": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "SVSWIFTPROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "SVSWIFTQA": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "SW137SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "SW191DRS": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "SW49SRV-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "SYS9SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "SYSADOC22SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "SeginfoServer": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "TECNO9VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "TERMEP211": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "TERMEP213": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "TES-001": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "TES-002": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "TES-003": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "TES-004": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "TES-005": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "TESINWEBP": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "TESTWF00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "TFS-UNISYS": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "TFSABS141": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "TRK196VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "TRK95VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "TSN26VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "TSN66SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "TST84VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "UAS20SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "UAT20SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "UNI46VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "UNI46VRTOLD": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "UNISYS-BUILD01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "UNISYS-BUILD02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "UNISYS-CLIENT-TOOLS": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "UNISYS-RT-QA01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "UNISYS-RT-QA02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "UNISYS-RT-QA03": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "UNISYS-RT-REL01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "UNISYS-RT-REL02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "UNISYS-RT01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "UNISYS-RT02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "UNISYS-RT03": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "UNISYS-RT04": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "UNISYS-RT05": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "UNISYS-SUPP01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "UNISYS-SUPP02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "UNISYS-TFS2": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "UNISYS51ABSPREP": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "UNISYSTAS51VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "UNYSISTAS51VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "VAM28SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "VAPP35VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "VAPPDR-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "VAPPS22SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "VEEAMPRXAWSG01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VEEAMPRXCL11": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VEEAMPRXCL17": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VEEAMPRXCL19": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VEEAMPRXCL21": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VEEAMPRXCL23": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VEEAMPRXGCVE01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VEEAMPRXGCVE02": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VEEAMPRXGCVE03": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VEEAMPRXGCVE04": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VEEAMPRXGCVE05": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VM-SRVDC01": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "VM-SRVDC02": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "VM000ALGEIBA000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM000APL00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000APL06": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000APL09": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000APL10": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000APL11": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000APL12": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000APL13": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000AUD01": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000CLK01": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000DC02": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000DC03": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000DC11": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000DC12": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000DC13": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000DC14": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "VM000DC15": {
    "type": "BSC",
    "ambiente": "Producci�n (DMZ)",
    "grupo": "DCGrupo4"
  },
  "VM000DC16": {
    "type": "BSC",
    "ambiente": "Producci�n (DMZ)",
    "grupo": "DCGrupo3"
  },
  "VM000DC17": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM000DC20": {
    "type": "BSC",
    "ambiente": "Producci�n (DMZ)",
    "grupo": "DCGrupo4"
  },
  "VM000DC25": {
    "type": "BSC",
    "ambiente": "Producci�n (DMZ)",
    "grupo": "DCGrupo5"
  },
  "VM000DHCP00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000DHCP01": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000GSIS02": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000HELIX00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000IIS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000IIS01": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000IIS02": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000IIS03": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000IIS04": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000IIS05": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000IIS06": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000IIS07": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000IIS08": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000IIS09": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000IIS10": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000IIS11": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000IIS12": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000IMPLE000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM000INVG00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000KIWI000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM000KMS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000MON01": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000NPS000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM000PCEN000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM000PP02": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000PRINT00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000PRINT01": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000PUNIDT000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM000QRADAR00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000RPAI000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM000SERV00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000SINCRO00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000SWIFT00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000SWIFT02": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000TEC00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM000TEC02": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000TEMP000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM000TOM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000TOM01": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000VEEAMEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000VEEAMEM01": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000VEEM01": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000VEEM02": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000VEEM03": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000VEEM04": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000VEEM05": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000VEEM06": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000VEEM07": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000VEEM08": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM000WEBL00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM000WEBL01": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000WF04": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM000WINSER00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM001F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM001IIS06": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM002IIS05": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM005DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Buenos Aires",
    "grupo": "DCGrupo4"
  },
  "VM005F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM005VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM005WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM010DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Caleta Olivia",
    "grupo": "DCGrupo3"
  },
  "VM010F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM010VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM010WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM015DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Rio Turbio",
    "grupo": "DCGrupo5"
  },
  "VM015F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM015VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM015WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM020DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Piedra Buena",
    "grupo": "DCGrupo5"
  },
  "VM020F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM020VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM020WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM025DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Calafate",
    "grupo": "DCGrupo5"
  },
  "VM025F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM025VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM025WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM030DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Gobernador Gregores",
    "grupo": "DCGrupo4"
  },
  "VM030F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM030VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM030WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM040DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Perito Moreno",
    "grupo": "DCGrupo3"
  },
  "VM040F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM040VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM040WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM041DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Los Antiguos",
    "grupo": "DCGrupo5"
  },
  "VM041F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM041VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM041WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM045DC00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM045F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM045VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM045WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM050DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Pico Truncado",
    "grupo": "DCGrupo4"
  },
  "VM050F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM050VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM050WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM055DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Puerto Deseado",
    "grupo": "DCGrupo3"
  },
  "VM055F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM055VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM055WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM060DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal San Julian",
    "grupo": "DCGrupo3"
  },
  "VM060F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM060VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM060WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM070DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Puerto Santa Cruz",
    "grupo": "DCGrupo4"
  },
  "VM070F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM070VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM070WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM085DC00": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal 28 de Noviembre",
    "grupo": "DCGrupo3"
  },
  "VM085F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM085VEEM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM085WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM095F2K00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM110BMAIL00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM110CRM00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM110CTEL00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM110DBA55": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM110F2K9500": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM110F2K9501": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM110F2K9502": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM110FATC00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM110FTER00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM110TEC63": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM110WS100": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM110WS101": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM110WS102": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM110WS103": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM110WS62": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM110WS65": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM110WS67": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM110WS68": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM110WS70": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM110WS73": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM110WS74": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM110WS75": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM110WS76": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM110WS77": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM110WS79": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM110WS80": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM110WS81": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM110WS82": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM110WS83": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM110WS84": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM110WS85": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM110WS90": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM110WS91": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "VM110WS92": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "VM110WS99": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "VM170WF": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "VM171WF": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "VM172ABTFS01": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172APL00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172APL02": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172APL06": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172APL07": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172APL09": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172APL11": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172APL12": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172APL13": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172BOE00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172CRM00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB02": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB05": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB06": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DB07": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB08": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DB10": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DB13": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB14": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DB15": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB16": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DB17": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB18": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DB19": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB20": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DB21": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB22": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DB23": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB24": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DB25": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DB26": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DB27": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DBARE00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DBINV00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DBWF00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172DC00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "DCGrupo1"
  },
  "VM172DC01": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "DCGrupo1"
  },
  "VM172DC02": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DC03": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172DC04": {
    "type": "BSC",
    "ambiente": "Test (DMZ4)",
    "grupo": "DCGrupo1"
  },
  "VM172DC05": {
    "type": "BSC",
    "ambiente": "Test (DM24)",
    "grupo": "DCGrupo1"
  },
  "VM172DMZ000": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172EAE01": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172EAE02": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172EAE03": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172EKM00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172ESB01": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172EX01": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172EXCH00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172F2K00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172F2K95": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172IIS00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172IIS01": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172IIS02": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172IIS03": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172IIS04": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172IIS05": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172IIS06": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172IIS07": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172IIS08": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172IIS09": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172IIS10": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172IIS11": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172IIS12": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172INVG00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172KMS001": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172OLAP00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172PBATCH03": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172PP00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172PP02": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172SERV00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172SIB00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172SOB01": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172TOM00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172WF": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "VM172WF01": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172WS03": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172WS21": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM172WS22": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "VM172WS23": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "VM173WF": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "VM250APL00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250APL01": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250APL02": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250APL06": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250APL07": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250APL08": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250APL09": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250APL11": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250APL12": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250APL16": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB02": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB08": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB10": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB11": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB13": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB14": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250DB15": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB16": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250DB17": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB18": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250DB19": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB20": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250DB21": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB22": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250DB22TEMP": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB23": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250DB24": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DB25": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250DB26": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250DB27": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250DBWF00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250DC02": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "DCGrupo2"
  },
  "VM250DC03": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "DCGrupo2"
  },
  "VM250DC04": {
    "type": "BSC",
    "ambiente": "Desarrollo (DMZ)",
    "grupo": "DCGrupo2"
  },
  "VM250DC05": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "DCGrupo2"
  },
  "VM250DCF2K00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "DCGrupo2"
  },
  "VM250EXCH00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250F2K00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250HELIX00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250IIS00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250IIS01": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250IIS02": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250IIS03": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250IIS04": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250IIS05": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250IIS06": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250IIS07": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250IIS08": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250IIS09": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250IIS10": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250IIS11": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250IIS12": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250KMS00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250PP00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250PP02": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250SERV00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250SOS00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250SOS01": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250TOM00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250WF01A": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250WF02A": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250WF03": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250WF21": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250WF22": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250WF23": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250WLOGS00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250WS01": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250WS03": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250WS06": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250WS07": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM250WS08": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "VM250WS09": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM252IIS05": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "VM500VEEM02": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM500WS00": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM500WS02": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "VM600DC00": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "VMBD06": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "VMCORP029": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "VMCORP038 (AM)": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "VMDB03": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "VMGATE01": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "VMGATE02": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "VMONE02VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "VMPROXY10SQL": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "VMware Backup Proxy": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-BM-01C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-BM-02C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-BM-03C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-CLD-01C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-CLD-06C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-CLD-07C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-CLD-08C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-CLD05-01C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-CLD05-02C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-CLD05-03C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-CLD05-04C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-CLD05-05C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-CLD3-01C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-CLD3-02C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-CLD3-03C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-CLD3-04C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-CLD3-05C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-CLD3-06C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-CLD3-07C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-CLD3-08C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-CLD3-09C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-CTRL-01C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-CTRL-02C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-CTRL-03C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-HBE-01C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-HBE-02C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-HBE-03C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-HBE-04C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-HBI-01C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-HBI-01T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-HBI-02C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-HBI-02T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-HBI-03C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-HBI-03T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-HBI-04C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-HBI-04T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-HBI-05C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-HBI-05T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-HBI-06C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-HBI-06T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-HBI-07C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-HBI-07T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-HBI-08T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-HBI-09T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-HBI-10T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-HBI-11T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-HBI-12T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-HBI-13T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-HBI-14T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-HBI-15T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-HBI-16T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-HBI-17T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-HBI-18T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-HBI-19T": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-PROD-01C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-PROD-02C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-PROD-03C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-PROD-04C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-PROD-05C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-PROD02-01C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-PROD02-02C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-PROD02-03C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-PROD02-04C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-PROD02-05C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-PROD02-06C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-PROD02-07C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-PROD02-08C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-PROD02-09C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-PROD02-10C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-TESTP1-02C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-TESTP1-03C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-TESTP1-04C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VPRX-TESTP1-05C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "VPRX-TESTP1-06C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "VPRX-TESTP1-07C": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "VSQLDR-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "VWSDR-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "W10SEG": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "W10SFB": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "W2S116APP": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "W2S117BD": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "W2S118": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "W2S16APP-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "W2S17BD-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "W2SEBKD15-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "WCOMX": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "WF06SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "WF06VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "WF161SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "WF162SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "WF30-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "WF69SRV": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "WIN-2B1BPAA2Q16": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "WIN10PIVOT65": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "WIN10RITEST": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "WKSTN131VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "WKSTN132": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "WKSTN133VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "WL150-TST": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "WL150VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "WS000BSF000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000CHALTEN000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000CORPO000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000CORPO001": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000CORPO002": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000CORPO003": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000CORPO004": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000ITSERV000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000ITSERV001": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000KIT000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000KIT001": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000MESA000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000MS365000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000MS365001": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000OCTVIO000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000PAI000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000SBCORP000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000SFB000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000SFB001": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000SFB002": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000SFB003": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000SFB004": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000SFB005": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000SFB006": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000SISOP000": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000SISOP001": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS000SISOP002": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WS60VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "WS70VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "WSCOMX": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "WSL119VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "WSL19VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "WSMAG75VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "WSMAG76SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "WSMIS76VRT": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "WSUS63VRT": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "WSUSWS": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "WhatsUpV21-DB": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "WhatsUpV21-Poller": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "Wkstn134vrt": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "Wkstn135vrt": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "XWS21SRV": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "absclontest": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "accesos175vrt": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "accesovrt": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "aplicatest01": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "aplicatest03": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "aplicatest04": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "bersaservdc01": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "bersaservdc02": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "bsj-caja-01": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "bsj-caja-02": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "bsj-caja-03": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "bsj-caja-04": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "bsj-caja-05": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "bsj-caja-07": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "bsj-caja-08": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "bsj-caja-09": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "bsj-caja-10": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "caja-001": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "caja-002": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "caja-003": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "caja-004": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "caja-005": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "dcp100vrt": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "desaaplica01": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "desaaplica03": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "desabases6": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "edh-POC-BI-SRV01": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "hub01": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "mercap-bd-t22": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "nbsf000pai01": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "prtaudit": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "srv-203-dc": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "sv-ApexOne-SERVER": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "sv-Echeck-PROD": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-ExtCom7-Test": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "sv-Extcom7-Prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-HikVision-p": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "sv-adintarWS-D": {
    "type": "NBERSA",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "sv-anywhere-gw": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "sv-apexOne-agent": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-bejerman8-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-bpm-one": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "sv-bpm19-t": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "sv-collector-p": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-echeqDB-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-eflow-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "sv-engdb-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-enginedb-test": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "sv-esco-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "sv-esco-test": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "sv-f2ku-desa-2": {
    "type": "NBERSA",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "sv-iis-externo": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-inv-web (intelektron)": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "sv-invdb-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "sv-inventario-cb": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-invgate-proxy": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "sv-invgate-proxy2": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-lexdr-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-mae-pr16": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "sv-mepbd-p": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-mim-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "sv-modoApi-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-modoDMZ-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-mododb-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "sv-npspai1": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-npspai2": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "sv-pivot-bersa": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-printserver": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "sv-probatch-p": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-probatch16-t": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "sv-servicios-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "sv-simgo-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-siopel-test": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "sv-sisdpt-test": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "sv-sisdpt2-test": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "sv-smartlocks-test": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "sv-soj-test": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "sv-sql10-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "sv-sql11-test": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "sv-sql2019-t": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "sv-sql6-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-sql7-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "sv-sqlsoc-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "sv-stdinWEBP": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "sv-test-w2016": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "sv-tfs-test2": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-uasapp-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-uasdb-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "sv-veeamone-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-vinculados": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-wamp-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-web6-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "sv-web8-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "sv-webServices-prod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "sv-whatsup21-p": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "sv-wsus-suc": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "svwebxprod": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "vm000pp01": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "vm110tecno231": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "vm110ws52": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "vm172apl01": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "vm172webl00": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "vm250webl00": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "vmfichadas": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "w2s102": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "w2s3": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "wbs87vrt": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "ws-proccoe-p": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  }
};

export const serverIPMap: Record<string, ServerInfo> = {
  "-": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "1,92168E+11": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "1,92186E+11": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "10.0.0.100": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "10.0.0.108": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "10.0.0.11": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "10.0.0.116": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "10.0.0.117": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "10.0.0.118": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.0.0.12": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "10.0.0.13": {
    "type": "BSC",
    "ambiente": "Producci�n (DMZ)",
    "grupo": "DCGrupo3"
  },
  "10.0.0.15": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "10.0.0.21": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "10.0.0.23": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "10.0.0.40": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "10.0.0.47": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "10.0.0.48": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "10.0.0.60": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "10.0.0.70": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.0.0.71": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "10.0.0.75": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "10.0.0.76": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "10.0.123.10": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "10.0.123.116": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "10.0.123.117": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "10.0.123.15": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "10.0.123.21": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "10.0.123.49": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "10.0.123.71": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "10.0.123.75": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "10.0.123.76": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "10.0.140.103": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "10.0.140.11": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "10.0.140.113": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "10.0.140.21": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "10.0.140.23": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "10.0.140.35": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "10.0.140.70": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "10.0.140.74": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "10.0.26.129": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "10.0.26.130": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "10.10.10.2": {
    "type": "BSC",
    "ambiente": "Producci�n (DMZ)",
    "grupo": "DCGrupo5"
  },
  "10.10.10.3": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "10.14.1.11": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "10.14.1.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "10.16.17.21": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam1"
  },
  "10.16.17.22": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam1"
  },
  "10.20.100.93": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "10.20.100.95": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "10.26.210.161, 10.26.4.10": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "10.26.4.45, 203.1.200.45": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "10.50.12.43": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.13.139": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.13.14": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.13.140": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.13.15": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.13.16": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.13.164": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.13.19": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.13.212": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.13.214": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.13.215": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.13.217": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.13.218": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.13.219": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.13.220": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.13.221": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.13.226": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.13.50": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.13.53": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.13.57": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.13.64": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.13.75": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.13.85": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.200.50": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.211.140": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "10.50.211.145": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "10.50.211.42": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "10.50.211.50": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "10.50.211.81": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "10.50.211.90": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "10.50.211.91": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "10.50.212.101": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "10.50.212.102": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.212.112": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.212.116": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.50.212.117": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "10.50.212.118": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "10.50.212.119": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "10.50.212.120": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.212.121": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.50.212.140": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.212.40": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "10.50.212.41": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.212.42": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.212.45": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "10.50.212.46": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "10.50.212.50": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "10.50.212.55": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.50.212.80": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "10.50.212.81": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "10.50.212.82": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "10.50.22.54": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "10.50.41.110": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.41.112": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.41.12": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.41.122": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.41.128": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.41.13": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.41.14": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.41.153": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.41.157": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.41.161": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.41.2": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.41.220": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.41.222": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.41.29": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.41.3": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.41.32": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.41.36": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.41.37": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.41.45": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.41.46": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.41.47": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.41.58": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.41.66": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.41.69": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy1"
  },
  "10.50.41.83": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy3"
  },
  "10.50.42.17": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.42.65": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Proxy2"
  },
  "10.50.6.210": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.50.8.120": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.50.8.21": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "10.50.8.27": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "10.50.8.30": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "10.50.8.55": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "10.50.8.63": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "10.50.82.140": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "10.50.82.161": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "10.50.82.73": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "10.50.82.95": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "10.50.82.97": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "10.50.82.98": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "10.50.84.150": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "10.50.84.73": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.50.84.95": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.84.96": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.50.84.98": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.50.84.99": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "10.50.87.140": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "10.50.87.161": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "10.50.87.73": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "10.50.87.95": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "10.50.87.97": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "10.50.87.98": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "10.50.89.150": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "10.50.89.73": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.50.89.95": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "10.50.89.96": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.89.98": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.92.140": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "10.50.92.141": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.92.161": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "10.50.92.73": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "10.50.92.95": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "10.50.92.98": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "10.50.94.150": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "10.50.94.73": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.94.95": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "10.50.94.96": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.94.98": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "10.50.97.140": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "10.50.97.161": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "10.50.97.73": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "10.50.97.95": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "10.50.97.98": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "10.50.99.194": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "10.50.99.73": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "10.50.99.95": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "10.50.99.96": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "10100100100": {
    "type": "BSC",
    "ambiente": "Producci�n (DMZ)",
    "grupo": "DCGrupo4"
  },
  "10100100102": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "10100100103": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "10100100106": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "10100100107": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "129.100.92.87": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "139.1.1.101": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "139.1.1.102": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "139.1.1.104": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "139.1.1.11": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "139.1.1.141": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "139.1.1.15": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "139.1.1.206": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "139.1.1.21": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "139.1.1.33": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "139.1.1.81": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "150.5.200.11": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "150.5.200.12": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "169.254.104.72": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "169.254.106.24": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "169.254.181.7": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "169.254.2.235": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "169.254.55.214": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "169.254.94.43": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.10.0.101": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.16.1.162": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.16.1.165": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.16.1.213": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.16.1.236": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam2"
  },
  "172.16.1.252": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.16.1.44": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.16.1.51": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.16.10.57": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.16.11.129": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.16.11.141": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.16.11.142": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.16.11.29": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.16.11.32": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.16.11.33": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.16.11.34": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.16.11.36": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.16.11.37": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.16.11.38": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.16.11.42": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.16.12.180": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam2"
  },
  "172.16.13.146": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.16.13.148": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.16.13.168": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.16.13.210": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.16.13.35": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam2"
  },
  "172.16.13.89": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.16.13.90": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.16.16.10": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.16.16.11": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.16.2.110": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.16.2.135": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.16.2.138": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.16.2.144": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.16.2.146": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam1"
  },
  "172.16.2.148": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.16.2.95": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam1"
  },
  "172.16.254.21": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.16.55.6": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.16.8.16": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.16.8.17": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.16.8.18": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.16.8.217": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.16.8.218": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.16.8.245": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.16.8.44": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.1.125": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.1.20": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.1.21": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.1.24": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.1.3": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.1.4": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.1.60": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.1.61": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.1.62": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.18.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.18.105": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.106": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.151": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.155": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.156": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.157": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.158": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.18.172": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.173": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.174": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.175": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.177": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.18": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.18.180": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.18.183": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.184": {
    "type": "NBSF",
    "ambiente": "Desarrollo",
    "grupo": "Testing1"
  },
  "172.18.18.190": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.20": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.22": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.28": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.29": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.18.36": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.38": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.40": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.42": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.43": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.45": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.18.46": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.47": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.48": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.18.52": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.18.54": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.55": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.56": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.57": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.60": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.61": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.62": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.64": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.18.66": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.69": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.70": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.18.71": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.78": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.18.79": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.18.80": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.101": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.2.107": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.112": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.2.114": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.2.116": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.2.117": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.118": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.2.119": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.124": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.2.129": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.2.130": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.136": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam2"
  },
  "172.18.2.137": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.138": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.139": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.2.150": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.2.152": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.2.153": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.2.155": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.2.163": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.2.164": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.165": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.2.167": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.2.18": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.2.186": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.188": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.193": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.2.195": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.2.196": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.2.198": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.2.202": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.18.2.204": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.2.205": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.213": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.2.23": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.2.25": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.2.27": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.2.31": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.2.33": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.2.36": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.37": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.2.38": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.44": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.2.46": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.2.47": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.2.50": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.2.56": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.2.59": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.2.60": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.2.62": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.2.68": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.18.2.69": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.2.72": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.2.73": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.2.75": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.2.76": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.2.77": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.79": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.2.83": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.18.2.85": {
    "type": "NBSF",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.18.2.87": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Veeam1"
  },
  "172.18.2.89": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.2.90": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion5"
  },
  "172.18.2.92": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion6"
  },
  "172.18.2.94": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.18.2.98": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.251.242": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.18.40.124": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "172.19.241.10": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.19.252.10": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.20.1.1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.10": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.100": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.20.1.106": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.108": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.11": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.111": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.114": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.118": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.119": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.12": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.121": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.122": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.124": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.125": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.126": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.127": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.129": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.13": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.130": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.131": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.132": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.133": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.134": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.136": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.137": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.139": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.140": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.141": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.147": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.149": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.152": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.153": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.156": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.158": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.159": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.16": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.160": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.161": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.162": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.165": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.166": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.168": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.169": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.17": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.170": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.173": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.174": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.175": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.18": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.182": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.183": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.184": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.185": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.186": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.187": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.188": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.19": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.194": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.197": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.198": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.20": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.201": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.210": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.214": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.215": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.216": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.217": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.218": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.22": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.23": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.235": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.238": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.239": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.240": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.242": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.243": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.244": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.250": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.26": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.27": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.28": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.29": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.3": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.32": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.33": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.36": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.4": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.40": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.45": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.47": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.5": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.51": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.52": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.53": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.54": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.55": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.58": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.6": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.60": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.61": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.62": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.63": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.65": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.69": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.70": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.74": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.75": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.76": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.77": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.81": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.82": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.83": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.84": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.85": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.87": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.88": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.89": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.1.9": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.1.91": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.1.94": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.1.96": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.1.98": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.139.1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.139.38": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.14.1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.14.116": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.14.117": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.14.121": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.14.122": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.14.2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.14.21": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.14.22": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.14.221": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.14.60": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.14.61": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.14.62": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.14.63": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.14.64": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.14.66": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.14.67": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.14.68": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.14.69": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.30.114": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.30.141": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.30.143": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.30.144": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.30.51": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.30.59": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.10": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.101": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.103": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.106": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.108": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.11": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.110": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.112": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.116": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.118": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.119": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.12": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.120": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.121": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.123": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.125": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.128": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.130": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.131": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.135": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.136": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.138": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.142": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.148": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.149": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.150": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.151": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.152": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.153": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.154": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.155": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.156": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.157": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.158": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.159": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.16": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.160": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.162": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.163": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.168": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.17": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.170": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.176": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.177": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.18": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.181": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.19": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.192": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.20": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.202": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.203": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.204": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.206": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.21": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.213": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.214": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.215": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.216": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.217": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.218": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.219": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.22": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.222": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.23": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.240": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.25": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.250": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.26": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.28": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.3": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.31": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.32": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.33": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.35": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.36": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.38": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.39": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.40": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.42": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.43": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.44": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.46": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.47": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.48": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.49": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.50": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.53": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.54": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.55": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.56": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.57": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.58": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.6": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.60": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.61": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.62": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.64": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.67": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.69": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.7": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.71": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.72": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.74": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.75": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.77": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.78": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.79": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.80": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.4.81": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.82": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.83": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.86": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.87": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.88": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.91": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.4.92": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.4.93": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.4.94": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.95": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.97": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.4.99": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.58.150": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.72.137": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.72.14": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.72.191": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.72.27": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.72.66": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.73.123": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.13": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.14": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.142": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.143": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.15": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.23": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.24": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.51": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.6": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.62": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.78": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.73.80": {
    "type": "BSJ",
    "ambiente": "PreProducci�n",
    "grupo": "Producci�n1"
  },
  "172.20.8.1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.8.10": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.8.2": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.8.3": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.8.30": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.8.31": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.8.32": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.8.33": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.20.8.34": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.20.8.35": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.20.8.36": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.20.8.37": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.20.8.6": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.21.15.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.21.15.102": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.21.15.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.21.15.200": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.21.15.201": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.21.15.234": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.21.20.83": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.21.204.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.21.204.102": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.21.204.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.21.204.200": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.21.204.201": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.21.204.239": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.21.21.17": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.21.21.51": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.21.21.9": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.21.220.19": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.220.21": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.220.43": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.220.50": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.10": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.101": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.102": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.106": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.107": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.109": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.110": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.111": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.112": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.114": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.115": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.116": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.117": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.118": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.119": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.12": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.120": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.121": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.122": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.123": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.124": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.125": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.13": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.131": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.132": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.133": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.134": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.135": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.139": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.14": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.140": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.141": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.146": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.149": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.150": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.151": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.16": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.160": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.161": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.162": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.169": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.170": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.171": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.172": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.173": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.175": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.179": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.181": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.187": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.19": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.196": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.20": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.202": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.21": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.211": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.212": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.213": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.218": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.219": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.221": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.228": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.23": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.230": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.231": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.26": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.27": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.28": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.29": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.30": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.31": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.32": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.35": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.36": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.38": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.39": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.40": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.44": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.45": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.47": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.48": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.50": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.51": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.53": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.54": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.59": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.6": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.60": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.61": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.62": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.64": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.65": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.66": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.68": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.69": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.7": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.71": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.72": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.74": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.75": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.76": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.78": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.8": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.81": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.84": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.87": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.88": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.89": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.91": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.92": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.222.93": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing2"
  },
  "172.21.222.96": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing4"
  },
  "172.21.222.97": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing3"
  },
  "172.21.222.99": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "172.21.69.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.21.69.102": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.21.69.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "172.21.69.200": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.21.69.201": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.21.69.239": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.26.0.110": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.10.115": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.10.116": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.10.16": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.10.231": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.100.11": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.100.110": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.100.12": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.100.122": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.100.125": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.100.126": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.100.13": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.100.132": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.100.15": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.100.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.100.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.100.153": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.100.155": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.100.158": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.100.170. 10.26.100.170. 10.26.101.170": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.100.171": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.100.19": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.26.100.2": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.100.20": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.100.24": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.100.27": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.100.28": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.100.29": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.100.3": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.100.30": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.100.32": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.100.35": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.100.36": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.100.37": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.100.4": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.100.58": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.100.68": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.100.69": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.102.100": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.102.101": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.108": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.109": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.102.114": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.126": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.102.134": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.102.135": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.136": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.102.142": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.102.150": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.157": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.158": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.102.161": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.102.162": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.163": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.102.164": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.102.165": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.102.166": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.167": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.177": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.102.179": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.183. 10.26.100.183": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.102.184. 10.26.100.184": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.102.185. 10.26.100.185": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.186. 10.26.100.186": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.102.188. 10.26.100.188": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.102.192": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.102.193": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.102.198": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.102.201": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.102.205": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.102.206": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.102.207": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.102.208": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.209": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.102.216": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.102.223": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.102.54": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.102.65": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.110.100": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.110.101": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.110.102": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.110.103": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.110.104": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.105": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.106": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.107": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.108": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.110": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.111": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.112": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.113": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.114": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.115": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.116": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.117": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.118": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.119": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.120": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.121": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.130": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.131": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.132": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.156": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.3": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.31": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.110.40": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.50": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.52": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.53": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.55": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.110.6": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.61": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.62": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.110.63": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.110.64": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.110.65": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.110.67": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.68": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.110.7": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.110.70": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.110.73": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.74": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.110.81": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.82": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.110.83": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.110.84": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.110.85": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.110.86": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.110.87": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.110.88": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.89": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.110.90": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.110.91": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.110.92": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.110.93": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.110.94": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.110.97": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.26.110.98": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.26.110.99": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.26.40.21": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.26.51.72": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.10.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Caleta Olivia",
    "grupo": "DCGrupo3"
  },
  "172.27.10.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.10.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.10.251": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.15.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Rio Turbio",
    "grupo": "DCGrupo5"
  },
  "172.27.15.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.15.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.15.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.20.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Piedra Buena",
    "grupo": "DCGrupo5"
  },
  "172.27.20.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.20.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.20.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.25.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Calafate",
    "grupo": "DCGrupo5"
  },
  "172.27.25.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.25.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.25.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.30.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Gobernador Gregores",
    "grupo": "DCGrupo4"
  },
  "172.27.30.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.30.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.30.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.40.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Perito Moreno",
    "grupo": "DCGrupo3"
  },
  "172.27.40.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.40.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.40.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.41.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Los Antiguos",
    "grupo": "DCGrupo5"
  },
  "172.27.41.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.41.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.41.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.45.100": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.45.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.45.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.45.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.5.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Buenos Aires",
    "grupo": "DCGrupo4"
  },
  "172.27.5.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.5.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.5.153": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.50.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Pico Truncado",
    "grupo": "DCGrupo4"
  },
  "172.27.50.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.50.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.50.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.55.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Puerto Deseado",
    "grupo": "DCGrupo3"
  },
  "172.27.55.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.55.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.55.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.60.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal San Julian",
    "grupo": "DCGrupo3"
  },
  "172.27.60.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.60.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.60.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.70.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal Puerto Santa Cruz",
    "grupo": "DCGrupo4"
  },
  "172.27.70.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.70.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.70.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.27.85.100": {
    "type": "BSC",
    "ambiente": "Producci�n - Sucursal 28 de Noviembre",
    "grupo": "DCGrupo3"
  },
  "172.27.85.151": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.27.85.152": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.27.85.250": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.0.100": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.0.102": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.0.103": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.0.104": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.0.136": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.0.137": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.0.143": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.0.144": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.0.147": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.0.163": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.0.185": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.0.186": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.0.187": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.0.190": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.0.191": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.0.200": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.0.214": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.0.218": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.0.219": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.0.226": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.0.34": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.0.35": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.0.39": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.0.40": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.0.41": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.0.42": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.0.47": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.0.63": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.0.64": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.0.66": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.0.69": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.0.70": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.0.73": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.0.77": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.0.89": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "172.28.1.106": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.1.110": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.117": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.1.12": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.13": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.147": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.1.150": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.153": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.154": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.156": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.157": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.159": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.160": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.161": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.164": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.165": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.1.168": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.1.172": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.173": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.18": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.1.184": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.185": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.186": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.187": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.190": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.195": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.196": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.197": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.1.198": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.199": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.201": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.202": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.206": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.1.209": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.210": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.212": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.55": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.1.56": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.58": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.59": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.62": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.66": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.74": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.77": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.85": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.1.86": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.90": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.1.94": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.1.95": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.1.96": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.104.13": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.104.33": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.28.16.11": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.28.16.12": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.28.16.13": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "172.28.16.160": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.28.16.220": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.16.41": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.16.49": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.17.1": {
    "type": "NBERSA",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.28.17.2": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "172.28.2.23": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.251.100": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.251.101": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.251.105": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "172.28.251.106": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.251.107": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.251.99": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.48.108": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "172.28.48.110": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.48.117": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "172.28.48.123": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.48.135": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "172.28.48.140": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "172.28.48.146": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.48.149": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "172.28.48.151": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "172.28.48.152": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "172.28.48.155": {
    "type": "NBERSA",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.28.48.156": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "172.28.48.158": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "172.28.48.169": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.48.171": {
    "type": "NBERSA",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.28.48.173": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "172.28.48.176": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.48.181": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "172.28.48.186": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "172.28.48.187": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "172.28.48.188": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "172.28.48.192": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.48.193": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "172.28.48.202": {
    "type": "NBERSA",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.28.48.206": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.48.207": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "172.28.48.210": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.48.211": {
    "type": "NBERSA",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.28.48.212": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.48.48": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.48.63": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.48.76": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.48.81": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "172.28.48.89": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.48.90": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing1"
  },
  "172.28.6.15": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.6.35": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.6.36": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion1"
  },
  "172.28.6.46": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.6.47": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion2"
  },
  "172.28.6.49": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.6.56": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.7.130": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.28.7.137": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.28.7.14": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.28.7.142": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "172.28.7.15": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  },
  "172.28.7.16": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing3"
  },
  "172.28.7.3": {
    "type": "NBERSA",
    "ambiente": "Testing",
    "grupo": "Testing2"
  },
  "172.28.7.5": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.29.1.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.29.10.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "172.29.11.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "172.29.12.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "172.29.13.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.29.14.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.29.15.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.29.16.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.29.17.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.29.18.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "172.29.19.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "172.29.197.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.29.2.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "172.29.20.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "172.29.21.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.29.22.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.29.23.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.29.24.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.29.25.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.29.26.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "172.29.27.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "172.29.28.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "172.29.29.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.29.3.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "172.29.30.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.29.31.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.29.32.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.29.33.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.29.34.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "172.29.35.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "172.29.36.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "172.29.38.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.29.4.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "172.29.40.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.29.41.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.29.42.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.29.44.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.29.46.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "172.29.47.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "172.29.48.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "172.29.49.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.29.5.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.29.50.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.29.51.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.29.52.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.29.53.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.29.55.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "172.29.57.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "172.29.6.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.29.60.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "172.29.62.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.29.63.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.29.64.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.29.65.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.29.66.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.29.68.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "172.29.69.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "172.29.7.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.29.70.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "172.29.71.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.29.72.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.29.73.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.29.78.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.29.79.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.29.8.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.29.80.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "172.29.81.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "172.29.83.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "172.29.84.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.29.85.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.29.86.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.29.87.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.29.9.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.29.91.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.29.92.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "172.29.93.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo7"
  },
  "172.29.94.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo8"
  },
  "172.29.95.17": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.30.10.104": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.10.105": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.10.109": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.10.114": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.10.115": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.116": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.10.13": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.10.130": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.135": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.10.146": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.17": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.10.170": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.10.171": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.10.181": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.10.183": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.30.10.184": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.30.10.185": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.30.10.187": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.30.10.19": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.193": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.10.194": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.10.197": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.30.10.199": {
    "type": "NBERSA",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo6"
  },
  "172.30.10.2": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.10.208": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.30.10.209": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.30.10.21": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.10.22": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.231": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.24": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.10.251": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.10.26": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.28": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.10.29": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.3": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.10.31": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.10.35": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.47": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.10.5": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.10.50": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.10.57": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.59": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.10.61": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.62": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.10.66": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.10.73": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.10.79": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.10.8": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.10.81": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.10.83": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.10.86": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.10.90": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.10.98": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.11.106": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.11.34": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.118.20": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.30.118.21": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.30.118.70": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.118.71": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.128.11": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.30.14.11": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo4"
  },
  "172.30.14.12": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.30.14.15": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.30.158.11": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.30.16.160": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.16.17": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.16.180": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.16.181": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.16.19": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.16.193": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.16.218": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.30.16.219": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo3"
  },
  "172.30.16.50": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.16.51": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.16.70": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.16.84": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.17.111": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.17.119": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.17.120": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.17.121": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.17.122": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.17.123": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.17.126": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.17.127": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.17.128": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.17.152": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.17.163": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.17.196": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.17.197": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.17.198": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.17.210": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.17.211": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.17.212": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.17.36": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.17.37": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.17.38": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.17.39": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.17.40": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.17.43": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.17.44": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.17.81": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.17.91": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.19.65": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.210.125": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.210.126": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.210.50": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.210.51": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.210.52": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.210.53": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.210.60": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.210.85": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.210.86": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.210.88": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.211.100": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.211.101": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.211.102": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.211.105": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.211.122": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.211.13": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.211.130": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.211.135": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.211.14": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.211.140": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.145": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.211.160": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.211.161": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.211.170": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.171": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.211.172": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.173": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.211.174": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.211.175": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.211.193": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.211": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.211.212": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.211.213": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.211.215": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.211.216": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.217": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.211.218": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.211.219": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.220": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.211.221": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.211.222": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.223": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.211.28": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.211.36": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.40": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.45": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.211.50": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.211.55": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.211.56": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.211.57": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.66": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.211.68": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.211.77": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.211.78": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.211.79": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.8": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.211.90": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.212.10": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.100": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.101": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.104": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.105": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.106": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.11": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.111": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.112": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.114": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.115": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.118": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.13": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.131": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.132": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.14": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.141": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.142": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.148": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.212.149": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.212.15": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.171": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.172": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.173": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.174": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.175": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.176": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.177": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.178": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.179": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.180": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.181": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.182": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.183": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.184": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.185": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.186": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.189": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.212.194": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.196": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.198": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.199": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.200": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.201": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.202": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.203": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.204": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.205": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.206": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.207": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.208": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.22": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.220": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.23": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.230": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.236": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.246": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.27": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.28": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.31": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.32": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.33": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.34": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.35": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.36": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.37": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.212.40": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.43": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.5": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.50": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.54": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.55": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.56": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.57": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.58": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.7": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.71": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.212.76": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.79": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.8": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.89": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.212.91": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.212.92": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.212.93": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.213.10": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.213.34": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.215.105": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.215.106": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.215.182": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.215.183": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.215.184": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.215.186": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.215.68": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.215.69": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.215.70": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.215.71": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.215.73": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.215.77": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.215.78": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.215.79": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.215.80": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.215.81": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.215.82": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.215.83": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.215.84": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.215.85": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.215.86": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.215.87": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.218.50": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.218.51": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.233.30": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.250.50": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.39.11": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo2"
  },
  "172.30.39.12": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.30.39.14": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.30.61.10": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo1"
  },
  "172.30.61.11": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "DCGrupo5"
  },
  "172.30.82.122": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.82.181": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.82.183": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.82.184": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.82.185": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.82.186": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.82.187": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.82.203": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.82.67": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.82.68": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.82.69": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.82.70": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.82.71": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.82.72": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.82.73": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.82.74": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.82.81": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.82.82": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.82.85": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.82.90": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.82.95": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.82.97": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.83.70": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.83.71": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.83.72": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.84.184": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.84.185": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.84.186": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.84.187": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.84.194": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.84.203": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.84.246": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.84.56": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.84.57": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.84.58": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.84.59": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.84.60": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.84.61": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.84.62": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.84.63": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.84.64": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.84.65": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.84.67": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.84.68": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.84.69": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.84.71": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.84.73": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.84.74": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.84.79": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.84.81": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.84.82": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.84.83": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.84.95": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.84.96": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.85.81": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.87.122": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.87.181": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.87.183": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.87.184": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.87.185": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.87.186": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.87.187": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.87.191": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.87.192": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.87.68": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.87.69": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.87.70": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.87.71": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.87.72": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.87.73": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.87.74": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.87.81": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.87.85": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.87.95": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.87.97": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.88.40": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.88.41": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.88.42": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.88.70": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.88.71": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.88.72": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.89.184": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.89.185": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.89.186": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.89.187": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.89.194": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.89.246": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.89.57": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.89.58": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.89.59": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.89.60": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.89.61": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.89.62": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.89.63": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.89.64": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.89.65": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.89.67": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.89.69": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.89.73": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.89.74": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.89.81": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.89.82": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.89.83": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.89.95": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.89.96": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.92.122": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.92.181": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.92.183": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.92.184": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.92.185": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.92.187": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.92.188": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.92.68": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.92.69": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.92.70": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.92.71": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.92.73": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.92.74": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.92.76": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.92.81": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.92.85": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.92.88": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.92.90": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.92.91": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.92.95": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.93.40": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.93.41": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.93.42": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.93.70": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.93.71": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.93.72": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.94.184": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.94.185": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.94.186": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.94.187": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.94.194": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.94.246": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.94.57": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.94.58": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.94.59": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.94.60": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.94.61": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.94.62": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.94.63": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.94.64": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.94.65": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.94.67": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.94.69": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.94.73": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.94.74": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.94.81": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.94.82": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.94.83": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.94.95": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.94.96": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.97.122": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.97.181": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.97.183": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.97.184": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.97.185": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.97.186": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.97.187": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.97.68": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.97.69": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.97.70": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.97.71": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.97.72": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "172.30.97.73": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.97.74": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.97.81": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "172.30.97.85": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing3"
  },
  "172.30.97.88": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.97.91": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.97.95": {
    "type": "CORP",
    "ambiente": "Test",
    "grupo": "Testing4"
  },
  "172.30.98.40": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.98.41": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.98.42": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.98.70": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.98.71": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.98.72": {
    "type": "CORP",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "172.30.99.184": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.99.185": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.99.186": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.99.187": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.99.194": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.99.246": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.99.58": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.99.59": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.99.60": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.99.61": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.99.62": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.99.63": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.99.64": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.99.65": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.99.67": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "172.30.99.68": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.99.69": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.99.73": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.99.74": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.99.81": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "172.30.99.82": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "172.30.99.83": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "172.30.99.95": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n1"
  },
  "172.30.99.96": {
    "type": "CORP",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "192.168.1.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "192.168.1.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.172.1": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "DCGrupo1"
  },
  "192.168.172.17": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.19": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.2": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.20": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.21": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.22": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.23": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.28": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.3": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.30": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.31": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.36": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.4": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "DCGrupo1"
  },
  "192.168.172.42": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.43": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.45": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.49": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.50": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.52": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.53": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.54": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.55": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.57": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.64": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.66": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.67": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.7": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.8": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.80": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.89": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.91": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.92": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.93": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing1"
  },
  "192.168.172.95": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.172.96": {
    "type": "BSC",
    "ambiente": "Test",
    "grupo": "Testing2"
  },
  "192.168.2.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "192.168.2.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.200.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "192.168.200.101": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "192.168.200.20": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "192.168.200.21": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "192.168.200.22": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "192.168.200.35": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "192.168.200.70": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "192.168.200.74": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "192.168.200.95": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "192.168.21.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.219.99": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "192.168.22.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "192.168.22.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.23.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.24.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.25.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.250.15": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "192.168.250.21": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "192.168.250.23": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "192.168.250.28": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "192.168.250.36": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "192.168.250.54": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "192.168.250.55": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "192.168.250.56": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "192.168.250.6": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "192.168.250.60": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "192.168.250.61": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "192.168.250.65": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "192.168.250.66": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "192.168.250.8": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo1"
  },
  "192.168.250.9": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "Desarrollo2"
  },
  "192.168.250.97": {
    "type": "BSC",
    "ambiente": "Desarrollo",
    "grupo": "DCGrupo2"
  },
  "192.168.26.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.27.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.28.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.29.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.3.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "192.168.3.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.31.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.32.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.33.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.34.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.35.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.36.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.37.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.39.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.4.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "192.168.4.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.40.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.41.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.42.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.43.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.44.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.45.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.46.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.47.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.48.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.5.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "192.168.5.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.50.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.51.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.53.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.54.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.55.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.56.1": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "192.168.56.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Produccion3"
  },
  "192.168.57.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.58.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.59.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.6.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "192.168.6.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.60.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.61.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.62.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.63.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal3"
  },
  "192.168.63.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.64.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.65.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.66.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "192.168.66.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.67.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.68.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal4"
  },
  "192.168.68.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.69.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.70.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.71.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.73.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.74.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.76.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.78.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "192.168.8.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal1"
  },
  "192.168.8.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.80.102": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Sucursal2"
  },
  "192.168.80.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix3"
  },
  "192.168.81.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix1"
  },
  "192.168.9.199": {
    "type": "NBSF",
    "ambiente": "Producci�n",
    "grupo": "Fix2"
  },
  "2002:ca01:1467::ca01:1467": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "2002:ca01:266::ca01:266": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "2002:ca01:366::ca01:366": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "2002:ca01:566::ca01:566": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "2002:ca01:6466::ca01:6466": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "2002:ca01:666::ca01:666": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "202.1.1.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "202.1.1.90": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.1.91": {
    "type": "BSJ",
    "ambiente": "Test/QA",
    "grupo": "Testing1"
  },
  "202.1.100.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.100.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.100.200": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "202.1.100.201": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "202.1.100.234": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "202.1.13.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.13.102": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "202.1.13.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "202.1.13.211": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "202.1.13.239": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "202.1.15.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "202.1.15.101": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.15.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "202.1.15.211": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "202.1.15.239": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "202.1.16.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "202.1.16.239": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "202.1.19.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.19.102": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "202.1.19.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.19.200": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "202.1.19.201": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "202.1.19.239": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "202.1.2.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "202.1.2.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.2.201": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "202.1.2.239": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "202.1.20.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "202.1.20.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "202.1.20.200": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "202.1.20.201": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.20.234": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "202.1.3.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "202.1.3.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.3.202": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "202.1.3.239": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "202.1.5.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "202.1.5.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.5.201": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "202.1.5.239": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "202.1.6.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "202.1.6.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "202.1.6.200": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "202.1.6.201": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "202.1.6.234": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.7.100": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n5"
  },
  "202.1.7.101": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n4"
  },
  "202.1.7.113": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n6"
  },
  "202.1.7.200": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n3"
  },
  "202.1.7.239": {
    "type": "BSJ",
    "ambiente": "Producci�n",
    "grupo": "Producci�n2"
  },
  "203.1.200.250, 10.26.4.46": {
    "type": "BSC",
    "ambiente": "Producci�n",
    "grupo": "Produccion4"
  }
};

export function getServerInfo(serverName: string, ip?: string | null): ServerInfo | null {
  if (!serverName) return null;
  const nameTrimmed = serverName.trim();
  const byName = serverTypeMap[nameTrimmed] ?? serverTypeMap[nameTrimmed.toUpperCase()] ?? null;
  if (byName) return byName;

  const shortName = nameTrimmed.split('.')[0];
  if (shortName && shortName !== nameTrimmed) {
    const byShort = serverTypeMap[shortName] ?? serverTypeMap[shortName.toUpperCase()] ?? null;
    if (byShort) return byShort;
  }

  if (ip && ip !== 'N/A') {
    const byIP = serverIPMap[ip.trim()] ?? null;
    if (byIP) return byIP;
  }

  const upper = nameTrimmed.toUpperCase();
  if (upper.includes('BSJ')) return { type: 'BSJ', ambiente: '' };
  if (upper.includes('NBSF') || upper.includes('BSF')) return { type: 'NBSF', ambiente: '' };
  if (upper.includes('NBERSA') || upper.includes('BER')) return { type: 'NBERSA', ambiente: '' };
  if (upper.includes('BSC')) return { type: 'BSC', ambiente: '' };
  if (upper.includes('ASJ')) return { type: 'ASJ', ambiente: '' };
  if (upper.includes('QUALIA')) return { type: 'QUALIA', ambiente: '' };
  if (upper.includes('CORP')) return { type: 'Corp', ambiente: '' };

  return null;
}
