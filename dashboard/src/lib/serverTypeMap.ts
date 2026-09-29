
export interface ServerInfo {
  type: string;
  grupo?: string | null;
  ip?: string | null;
  ambiente?: string | null;
}

export type ServerType = "Banco Entre Rios" | "Banco San Juan" | "Banco Santa Cruz" | "Banco Santa Fe" | "Corpo" | "Sin clasificar";

export const SERVER_TYPES: ServerType[] = [
  "Banco Entre Rios",
  "Banco San Juan",
  "Banco Santa Cruz",
  "Banco Santa Fe",
  "Corpo",
  "Sin clasificar"
];

export const GROUPS: string[] = [
  "DCGrupo1",
  "DCGrupo2",
  "DCGrupo3",
  "DCGrupo4",
  "DCGrupo5",
  "DCGrupo6",
  "DCGrupo7",
  "DCGrupo8",
  "Desarrollo1",
  "Desarrollo2",
  "Fix1",
  "Fix2",
  "Fix3",
  "Produccion1",
  "Produccion2",
  "Produccion3",
  "Produccion4",
  "Produccion5",
  "Produccion6",
  "Producci�n1",
  "Producci�n2",
  "Producci�n3",
  "Producci�n4",
  "Producci�n5",
  "Producci�n6",
  "Proxy1",
  "Proxy2",
  "Proxy3",
  "Sucursal1",
  "Sucursal2",
  "Sucursal3",
  "Sucursal4",
  "Testing1",
  "Testing2",
  "Testing3",
  "Testing4",
  "Veeam1",
  "Veeam2"
];

export const serverTypeMap: Record<string, ServerInfo> = {
  "VM172DC05 (dmz24.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo1",
    "ip": "1,92168E+11",
    "ambiente": "Test (DM24)"
  },
  "VM172DC04 (dmz4.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo1",
    "ip": "1,92168E+11",
    "ambiente": "Test (DMZ4)"
  },
  "VM172DC00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo1",
    "ip": "192.168.172.1",
    "ambiente": "Test"
  },
  "VM172DC01 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo1",
    "ip": "192.168.172.4",
    "ambiente": "Test"
  },
  "VM250DCF2K00 (f2k.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo2",
    "ip": "192.168.250.97",
    "ambiente": "Desarrollo"
  },
  "VM250DC02 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DC03 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DC05 (dmz24.desa)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DC04 (dmz4.desa)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo (DMZ)"
  },
  "VM000DC16 (dmz.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo3",
    "ip": "10.0.0.13",
    "ambiente": "Producci�n (DMZ)"
  },
  "VM010DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo3",
    "ip": "172.27.10.100",
    "ambiente": "Producci�n - Sucursal Caleta Olivia"
  },
  "VM040DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo3",
    "ip": "172.27.40.100",
    "ambiente": "Producci�n - Sucursal Perito Moreno"
  },
  "VM055DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo3",
    "ip": "172.27.55.100",
    "ambiente": "Producci�n - Sucursal Puerto Deseado"
  },
  "VM060DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo3",
    "ip": "172.27.60.100",
    "ambiente": "Producci�n - Sucursal San Julian"
  },
  "VM085DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo3",
    "ip": "172.27.85.100",
    "ambiente": "Producci�n - Sucursal 28 de Noviembre"
  },
  "VM000DC20 (dmz4.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo4",
    "ip": "10100100100",
    "ambiente": "Producci�n (DMZ)"
  },
  "VM005DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo4",
    "ip": "172.27.5.100",
    "ambiente": "Producci�n - Sucursal Buenos Aires"
  },
  "VM030DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo4",
    "ip": "172.27.30.100",
    "ambiente": "Producci�n - Sucursal Gobernador Gregores"
  },
  "VM050DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo4",
    "ip": "172.27.50.100",
    "ambiente": "Producci�n - Sucursal Pico Truncado"
  },
  "VM070DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo4",
    "ip": "172.27.70.100",
    "ambiente": "Producci�n - Sucursal Puerto Santa Cruz"
  },
  "VM000DC15 (dmz.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo4",
    "ip": "10.0.0.11",
    "ambiente": "Producci�n (DMZ)"
  },
  "VM000DC25 (dmz24.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo5",
    "ip": "10.10.10.2",
    "ambiente": "Producci�n (DMZ)"
  },
  "VM000DC14 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo5",
    "ip": "172.26.100.19",
    "ambiente": "Producci�n"
  },
  "VM015DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo5",
    "ip": "172.27.15.100",
    "ambiente": "Producci�n - Sucursal Rio Turbio"
  },
  "VM020DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo5",
    "ip": "172.27.20.100",
    "ambiente": "Producci�n - Sucursal Piedra Buena"
  },
  "VM025DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo5",
    "ip": "172.27.25.100",
    "ambiente": "Producci�n - Sucursal Calafate"
  },
  "VM041DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "DCGrupo5",
    "ip": "172.27.41.100",
    "ambiente": "Producci�n - Sucursal Los Antiguos"
  },
  "BSCDESANICO (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "192.168.250.56",
    "ambiente": "Desarrollo"
  },
  "NTS32desa (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250APL02 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250APL06 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250APL08 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250APL11 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250APL16 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB02 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB08 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB10 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB13 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB15 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB17 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB19 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB21 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB22TEMP (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB24 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DBWF00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250F2K00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS01 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS03 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS05 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS07 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS09 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS11 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250PP00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250SERV00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250SOS01 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "vm250webl00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250WLOGS00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250WS06 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "192.168.250.6",
    "ambiente": "Desarrollo"
  },
  "VM250WS08 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "192.168.250.8",
    "ambiente": "Desarrollo"
  },
  "BSCDESA08 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "192.168.250.15",
    "ambiente": "Desarrollo"
  },
  "NTS36desa (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250APL00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250APL07 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250APL09 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "192.168.250.36",
    "ambiente": "Desarrollo"
  },
  "VM250APL12 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB11 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo1",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB14 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "App25001 (dmz24.desa)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM252IIS05 (dmz4.desa)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB16 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB18 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "192.168.250.60",
    "ambiente": "Desarrollo"
  },
  "VM250DB20 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB22 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB23 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "192.168.250.61",
    "ambiente": "Desarrollo"
  },
  "VM250DB25 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "192.168.250.28",
    "ambiente": "Desarrollo"
  },
  "VM250EXCH00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS02 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS04 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS06 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS08 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250IIS10 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250KMS00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250PP02 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250SOS00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250TOM00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250WS01 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "192.168.250.21",
    "ambiente": "Desarrollo"
  },
  "VM250WS03 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "192.168.250.23",
    "ambiente": "Desarrollo"
  },
  "VM250WS07 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250WS09 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "192.168.250.9",
    "ambiente": "Desarrollo"
  },
  "App25002 (dmz4.desa)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "BSCEAE01 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "desaaplica01 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "desaaplica03 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "desabases6 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250APL01 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250WF01A (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250WF02A (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250WF03 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250WF21 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250WF22 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250WF23 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "1,92168E+11",
    "ambiente": "Desarrollo"
  },
  "VM250DB26 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "192.168.250.66",
    "ambiente": "Desarrollo"
  },
  "VM250DB27 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "192.168.250.55",
    "ambiente": "Desarrollo"
  },
  "VM250HELIX00 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "192.168.250.65",
    "ambiente": "Desarrollo"
  },
  "VM250IIS12 (desapdc01.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Desarrollo2",
    "ip": "192.168.250.54",
    "ambiente": "Desarrollo"
  },
  "VM000DC02 (corp.bsc)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.100.2",
    "ambiente": "Producci�n"
  },
  "VM001IIS06 (dmz.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "10.0.0.108",
    "ambiente": "Producci�n"
  },
  "PortalAPP02 (dmz4.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "10100100106",
    "ambiente": "Producci�n"
  },
  "ACCESOSUC (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.110.7",
    "ambiente": "Producci�n"
  },
  "NTS36 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.100.36",
    "ambiente": "Producci�n"
  },
  "VM000APL09 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.102.136",
    "ambiente": "Producci�n"
  },
  "VM000APL13 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.102.164",
    "ambiente": "Producci�n"
  },
  "VM000CLK01 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.100.24",
    "ambiente": "Producci�n"
  },
  "VM000DC13 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.100.13",
    "ambiente": "Producci�n"
  },
  "VM000DHCP00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.102.192",
    "ambiente": "Producci�n"
  },
  "VM000IIS01 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.100.153",
    "ambiente": "Producci�n"
  },
  "VM000IIS05 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.102.100",
    "ambiente": "Producci�n"
  },
  "VM000IIS09 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.102.126",
    "ambiente": "Producci�n"
  },
  "VM000INVG00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.100.126",
    "ambiente": "Producci�n"
  },
  "vm000pp01 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.100.28",
    "ambiente": "Producci�n"
  },
  "VM000VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.100.170. 10.26.100.170. 10.26.101.170",
    "ambiente": "Producci�n"
  },
  "VM000VEEM04 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.102.184. 10.26.100.184",
    "ambiente": "Producci�n"
  },
  "VM000VEEM08 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.102.188. 10.26.100.188",
    "ambiente": "Producci�n"
  },
  "VM005VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.5.152",
    "ambiente": "Producci�n"
  },
  "VM010VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.10.152",
    "ambiente": "Producci�n"
  },
  "VM015VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.15.152",
    "ambiente": "Producci�n"
  },
  "VM020VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.20.152",
    "ambiente": "Producci�n"
  },
  "VM025VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.25.152",
    "ambiente": "Producci�n"
  },
  "VM030VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.30.152",
    "ambiente": "Producci�n"
  },
  "VM040VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.40.152",
    "ambiente": "Producci�n"
  },
  "VM041VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.41.152",
    "ambiente": "Producci�n"
  },
  "VM045VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.45.152",
    "ambiente": "Producci�n"
  },
  "VM050VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.50.152",
    "ambiente": "Producci�n"
  },
  "VM055VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.55.152",
    "ambiente": "Producci�n"
  },
  "VM060VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.60.152",
    "ambiente": "Producci�n"
  },
  "VM070VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.70.152",
    "ambiente": "Producci�n"
  },
  "VM085VEEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.27.85.152",
    "ambiente": "Producci�n"
  },
  "VM110CTEL00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.110.64",
    "ambiente": "Producci�n"
  },
  "VM110F2K9502 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.110.91",
    "ambiente": "Producci�n"
  },
  "VM110WS103 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.110.103",
    "ambiente": "Producci�n"
  },
  "VM110WS68 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.110.68",
    "ambiente": "Producci�n"
  },
  "VM110WS74 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.110.74",
    "ambiente": "Producci�n"
  },
  "VM110WS79 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.110.84",
    "ambiente": "Producci�n"
  },
  "VM110WS83 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.110.98",
    "ambiente": "Producci�n"
  },
  "VM110WS91 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.110.93",
    "ambiente": "Producci�n"
  },
  "VM000DC03 (corp.bsc)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.100.3",
    "ambiente": "Producci�n"
  },
  "VM002IIS05 (dmz4.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "10100100107",
    "ambiente": "Producci�n"
  },
  "VM000TEC02 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.102.158",
    "ambiente": "Producci�n"
  },
  "BSC0131 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.110.31",
    "ambiente": "Producci�n"
  },
  "NTS37 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.100.37",
    "ambiente": "Producci�n"
  },
  "VM000APL10 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.102.142",
    "ambiente": "Producci�n"
  },
  "VM000AUD01 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.102.134",
    "ambiente": "Producci�n"
  },
  "VM000DHCP01 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.102.193",
    "ambiente": "Producci�n"
  },
  "VM000IIS02 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion1",
    "ip": "172.26.100.155",
    "ambiente": "Producci�n"
  },
  "VM000IIS06 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.101",
    "ambiente": "Producci�n"
  },
  "VM000IIS10 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.179",
    "ambiente": "Producci�n"
  },
  "VM000MON01 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.166",
    "ambiente": "Producci�n"
  },
  "VM000PP02 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.114",
    "ambiente": "Producci�n"
  },
  "VM000SERV00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.100.158",
    "ambiente": "Producci�n"
  },
  "VM000SWIFT00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "10.0.26.129",
    "ambiente": "Producci�n"
  },
  "VM000VEEM01 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.100.171",
    "ambiente": "Producci�n"
  },
  "VM000VEEM05 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.185. 10.26.100.185",
    "ambiente": "Producci�n"
  },
  "VM000WEBL00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.100.4",
    "ambiente": "Producci�n"
  },
  "VM000WINSER00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.167",
    "ambiente": "Producci�n"
  },
  "VM005WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.5.153",
    "ambiente": "Producci�n"
  },
  "VM010WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.10.251",
    "ambiente": "Producci�n"
  },
  "VM015WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.15.250",
    "ambiente": "Producci�n"
  },
  "VM020WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.20.250",
    "ambiente": "Producci�n"
  },
  "VM025WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.25.250",
    "ambiente": "Producci�n"
  },
  "VM030WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.30.250",
    "ambiente": "Producci�n"
  },
  "VM040WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.40.250",
    "ambiente": "Producci�n"
  },
  "VM041WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.41.250",
    "ambiente": "Producci�n"
  },
  "VM045WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.45.250",
    "ambiente": "Producci�n"
  },
  "VM050WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.50.250",
    "ambiente": "Producci�n"
  },
  "VM055WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.55.250",
    "ambiente": "Producci�n"
  },
  "VM060WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.60.250",
    "ambiente": "Producci�n"
  },
  "VM070WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.70.250",
    "ambiente": "Producci�n"
  },
  "VM085WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.27.85.250",
    "ambiente": "Producci�n"
  },
  "VM110DBA55 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.110.55",
    "ambiente": "Producci�n"
  },
  "VM110FTER00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.110.97",
    "ambiente": "Producci�n"
  },
  "VM110WS100 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.110.100",
    "ambiente": "Producci�n"
  },
  "VM110WS62 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.110.62",
    "ambiente": "Producci�n"
  },
  "VM110WS75 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.110.82",
    "ambiente": "Producci�n"
  },
  "VM110WS80 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.110.86",
    "ambiente": "Producci�n"
  },
  "VM110WS84 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.110.102",
    "ambiente": "Producci�n"
  },
  "VM110WS92 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.110.94",
    "ambiente": "Producci�n"
  },
  "App0401 (dmz4.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "10100100103",
    "ambiente": "Producci�n"
  },
  "w2s102 (dmz4.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "10100100102",
    "ambiente": "Producci�n"
  },
  "MESCON115 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.10.115",
    "ambiente": "Producci�n"
  },
  "VM000APL06 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.100.30",
    "ambiente": "Producci�n"
  },
  "VM000APL11 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.208",
    "ambiente": "Producci�n"
  },
  "VM000DC11 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.100.11",
    "ambiente": "Producci�n"
  },
  "VM000HELIX00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.65",
    "ambiente": "Producci�n"
  },
  "VM000IIS03 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.100.15",
    "ambiente": "Producci�n"
  },
  "VM000IIS07 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.108",
    "ambiente": "Producci�n"
  },
  "VM000IIS11 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.223",
    "ambiente": "Producci�n"
  },
  "VM000KMS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.100.20",
    "ambiente": "Producci�n"
  },
  "VM000PRINT00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.100.132",
    "ambiente": "Producci�n"
  },
  "VM000SINCRO00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.135",
    "ambiente": "Producci�n"
  },
  "VM000TOM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.157",
    "ambiente": "Producci�n"
  },
  "VM000VEEAMEM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.162",
    "ambiente": "Producci�n"
  },
  "VM000VEEM02 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.100.29",
    "ambiente": "Producci�n"
  },
  "VM000VEEM06 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion2",
    "ip": "172.26.102.150",
    "ambiente": "Producci�n"
  },
  "VM000WEBL01 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.100.68",
    "ambiente": "Producci�n"
  },
  "VM045DC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.45.100",
    "ambiente": "Producci�n"
  },
  "VM095F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.100.152",
    "ambiente": "Producci�n"
  },
  "VM110F2K9500 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.110.90",
    "ambiente": "Producci�n"
  },
  "VM110TEC63 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.110.63",
    "ambiente": "Producci�n"
  },
  "VM110WS101 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.110.101",
    "ambiente": "Producci�n"
  },
  "VM110WS65 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.110.65",
    "ambiente": "Producci�n"
  },
  "VM110WS70 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.110.70",
    "ambiente": "Producci�n"
  },
  "VM110WS76 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.110.83",
    "ambiente": "Producci�n"
  },
  "VM110WS81 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.110.87",
    "ambiente": "Producci�n"
  },
  "VM110WS85 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.110.85",
    "ambiente": "Producci�n"
  },
  "VM110WS99 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.110.99",
    "ambiente": "Producci�n"
  },
  "PortalAPP (dmz.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "10.0.0.100",
    "ambiente": "Producci�n"
  },
  "w2s3 (dmz24.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "10.10.10.3",
    "ambiente": "Producci�n"
  },
  "BSC0103 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.0.110",
    "ambiente": "Producci�n"
  },
  "NTS32 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.100.32",
    "ambiente": "Producci�n"
  },
  "VM000APL00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.100.69",
    "ambiente": "Producci�n"
  },
  "VM000APL12 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.102.161",
    "ambiente": "Producci�n"
  },
  "VM000DC12 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.100.12",
    "ambiente": "Producci�n"
  },
  "VM000GSIS02 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.100.125",
    "ambiente": "Producci�n"
  },
  "VM000IIS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.100.58",
    "ambiente": "Producci�n"
  },
  "VM000IIS04 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.100.27",
    "ambiente": "Producci�n"
  },
  "VM000IIS08 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.102.109",
    "ambiente": "Producci�n"
  },
  "VM000IIS12 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.102.54",
    "ambiente": "Producci�n"
  },
  "VM000PRINT01 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.100.35",
    "ambiente": "Producci�n"
  },
  "VM000QRADAR00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.102.177",
    "ambiente": "Producci�n"
  },
  "VM000SWIFT02 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "10.0.26.130",
    "ambiente": "Producci�n"
  },
  "VM000TOM01 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.102.198",
    "ambiente": "Producci�n"
  },
  "VM000VEEAMEM01 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.102.163",
    "ambiente": "Producci�n"
  },
  "VM000VEEM03 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.102.183. 10.26.100.183",
    "ambiente": "Producci�n"
  },
  "VM000VEEM07 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.102.186. 10.26.100.186",
    "ambiente": "Producci�n"
  },
  "VM000WF04 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.100.110",
    "ambiente": "Producci�n"
  },
  "VM001F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.100.151",
    "ambiente": "Producci�n"
  },
  "VM005F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.5.151",
    "ambiente": "Producci�n"
  },
  "VM010F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.10.151",
    "ambiente": "Producci�n"
  },
  "VM015F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.15.151",
    "ambiente": "Producci�n"
  },
  "VM020F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.20.151",
    "ambiente": "Producci�n"
  },
  "VM025F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.25.151",
    "ambiente": "Producci�n"
  },
  "VM030F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.30.151",
    "ambiente": "Producci�n"
  },
  "VM040F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.40.151",
    "ambiente": "Producci�n"
  },
  "VM041F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.41.151",
    "ambiente": "Producci�n"
  },
  "VM045F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.45.151",
    "ambiente": "Producci�n"
  },
  "VM050F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.50.151",
    "ambiente": "Producci�n"
  },
  "VM055F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.55.151",
    "ambiente": "Producci�n"
  },
  "VM060F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.60.151",
    "ambiente": "Producci�n"
  },
  "VM070F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.70.151",
    "ambiente": "Producci�n"
  },
  "VM085F2K00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.27.85.151",
    "ambiente": "Producci�n"
  },
  "VM110CRM00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.51.72",
    "ambiente": "Producci�n"
  },
  "VM110F2K9501 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion3",
    "ip": "172.26.110.89",
    "ambiente": "Producci�n"
  },
  "vm110tecno231 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.10.231",
    "ambiente": "Producci�n"
  },
  "VM110WS102 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.156",
    "ambiente": "Producci�n"
  },
  "VM110WS67 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.67",
    "ambiente": "Producci�n"
  },
  "VM110WS73 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.73",
    "ambiente": "Producci�n"
  },
  "VM110WS77 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.81",
    "ambiente": "Producci�n"
  },
  "VM110WS82 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.92",
    "ambiente": "Producci�n"
  },
  "VM110WS90 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.40",
    "ambiente": "Producci�n"
  },
  "VM000DC17 (dmz.com)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "10.0.0.15",
    "ambiente": "Producci�n"
  },
  "VM500WS02 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "203.1.200.250, 10.26.4.46",
    "ambiente": "Producci�n"
  },
  "VM500WS00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "10.26.4.45, 203.1.200.45",
    "ambiente": "Producci�n"
  },
  "VM500VEEM02 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "10.26.210.161, 10.26.4.10",
    "ambiente": "Producci�n"
  },
  "VM110BMAIL00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.6",
    "ambiente": "Producci�n"
  },
  "WS000CHALTEN000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.121",
    "ambiente": "Producci�n"
  },
  "WS000MESA000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.10.116",
    "ambiente": "Producci�n"
  },
  "WS000MS365000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.118",
    "ambiente": "Producci�n"
  },
  "WS000MS365001 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.119",
    "ambiente": "Producci�n"
  },
  "WS000SBCORP000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.120",
    "ambiente": "Producci�n"
  },
  "WS000SFB002 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.104",
    "ambiente": "Producci�n"
  },
  "WS000SFB004 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.106",
    "ambiente": "Producci�n"
  },
  "WS000SFB005 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.107",
    "ambiente": "Producci�n"
  },
  "WS000SFB006 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.108",
    "ambiente": "Producci�n"
  },
  "VM110FATC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.3",
    "ambiente": "Producci�n"
  },
  "VM000ALGEIBA000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.102.209",
    "ambiente": "Producci�n"
  },
  "VM000TEMP000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.40.21",
    "ambiente": "Producci�n"
  },
  "VM000KIWI000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.102.165",
    "ambiente": "Producci�n"
  },
  "WS000BSF000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.117",
    "ambiente": "Producci�n"
  },
  "WS000SFB000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.115",
    "ambiente": "Producci�n"
  },
  "WS000SFB001 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.116",
    "ambiente": "Producci�n"
  },
  "WS000CORPO000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.110",
    "ambiente": "Producci�n"
  },
  "WS000CORPO001 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.111",
    "ambiente": "Producci�n"
  },
  "WS000CORPO002 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.112",
    "ambiente": "Producci�n"
  },
  "WS000CORPO003 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.113",
    "ambiente": "Producci�n"
  },
  "WS000CORPO004 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.114",
    "ambiente": "Producci�n"
  },
  "WS000ITSERV000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.10.16",
    "ambiente": "Producci�n"
  },
  "WS000ITSERV001 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.88",
    "ambiente": "Producci�n"
  },
  "WS000KIT000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.50",
    "ambiente": "Producci�n"
  },
  "WS000KIT001 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.53",
    "ambiente": "Producci�n"
  },
  "WS000OCTVIO000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.61",
    "ambiente": "Producci�n"
  },
  "WS000PAI000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "169.254.94.43",
    "ambiente": "Producci�n"
  },
  "WS000SFB003 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.105",
    "ambiente": "Producci�n"
  },
  "WS000SISOP000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.130",
    "ambiente": "Producci�n"
  },
  "WS000SISOP001 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.131",
    "ambiente": "Producci�n"
  },
  "WS000SISOP002 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.132",
    "ambiente": "Producci�n"
  },
  "vm110ws52 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.110.52",
    "ambiente": "Producci�n"
  },
  "VM000TEC00 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.100.122",
    "ambiente": "Producci�n"
  },
  "VM000IMPLE000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.102.205",
    "ambiente": "Producci�n"
  },
  "VM000NPS000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.102.216",
    "ambiente": "Producci�n"
  },
  "VM000PCEN000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.102.206",
    "ambiente": "Producci�n"
  },
  "VM000PUNIDT000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.102.207",
    "ambiente": "Producci�n"
  },
  "VM000RPAI000 (santacruz.net)": {
    "type": "Banco Santa Cruz",
    "grupo": "Produccion4",
    "ip": "172.26.102.201",
    "ambiente": "Producci�n"
  },
  "App17201 (dmz24.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DC02 (root.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.2",
    "ambiente": "Test"
  },
  "NTS36test (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172APL00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172APL07 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172APL11 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172APL13 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172CRM00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.80",
    "ambiente": "Test"
  },
  "VM172DB05 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.50",
    "ambiente": "Test"
  },
  "VM172DB07 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.42",
    "ambiente": "Test"
  },
  "VM172DB13 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.53",
    "ambiente": "Test"
  },
  "VM172DB15 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DB17 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DB19 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.19",
    "ambiente": "Test"
  },
  "VM172DB21 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DB23 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.64",
    "ambiente": "Test"
  },
  "VM172DB25 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DBINV00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172EAE03 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.93",
    "ambiente": "Test"
  },
  "VM172EXCH00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172F2K00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS02 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS04 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS06 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS08 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS10 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172INVG00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.31",
    "ambiente": "Test"
  },
  "VM172OLAP00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172PP00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.30",
    "ambiente": "Test"
  },
  "VM172SERV00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92186E+11",
    "ambiente": "Test"
  },
  "VM172TOM00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172WS03 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.20",
    "ambiente": "Test"
  },
  "VM172WS22 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.22",
    "ambiente": "Test"
  },
  "VM172DC03 (root.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.3",
    "ambiente": "Test"
  },
  "NTS32test (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172ABTFS01 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172APL02 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172APL06 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172APL09 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.36",
    "ambiente": "Test"
  },
  "VM172APL12 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172BOE00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "192.168.172.8",
    "ambiente": "Test"
  },
  "VM172DB00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DB02 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing1",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DB06 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.49",
    "ambiente": "Test"
  },
  "VM172DB08 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.43",
    "ambiente": "Test"
  },
  "VM172DB10 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.45",
    "ambiente": "Test"
  },
  "VM172DB14 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.52",
    "ambiente": "Test"
  },
  "VM172DB16 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.57",
    "ambiente": "Test"
  },
  "VM172DB18 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DB20 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DB22 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DB24 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DBARE00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DBWF00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172F2K95 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS01 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS03 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS05 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS07 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS09 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172IIS11 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172PBATCH03 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172PP02 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.28",
    "ambiente": "Test"
  },
  "VM172SIB00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.95",
    "ambiente": "Test"
  },
  "vm172webl00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172WS21 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.21",
    "ambiente": "Test"
  },
  "VM172WS23 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.23",
    "ambiente": "Test"
  },
  "App17201 (dmz4.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DMZ000 (dmz4.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "aplicatest03 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.7",
    "ambiente": "Test"
  },
  "aplicatest04 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.17",
    "ambiente": "Test"
  },
  "aplicatest01 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.89",
    "ambiente": "Test"
  },
  "TESTWF00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "vm172apl01 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.67",
    "ambiente": "Test"
  },
  "VM172EAE01 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.91",
    "ambiente": "Test"
  },
  "VM172EAE02 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.92",
    "ambiente": "Test"
  },
  "VM172EKM00 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172ESB01 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172EX01 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172SOB01 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.96",
    "ambiente": "Test"
  },
  "VM172WF01 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172KMS001 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "1,92168E+11",
    "ambiente": "Test"
  },
  "VM172DB26 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.66",
    "ambiente": "Test"
  },
  "VM172DB27 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.55",
    "ambiente": "Test"
  },
  "VM172IIS12 (stacruz.test)": {
    "type": "Banco Santa Cruz",
    "grupo": "Testing2",
    "ip": "192.168.172.54",
    "ambiente": "Test"
  },
  "ABSPREPROD15DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.15",
    "ambiente": "PreProducci�n"
  },
  "DB6VRT-PRE (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.6",
    "ambiente": "PreProducci�n"
  },
  "DEVABS143PREP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.143",
    "ambiente": "PreProducci�n"
  },
  "DKPREPROD13VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.13",
    "ambiente": "PreProducci�n"
  },
  "NTS78ABSPREP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.78",
    "ambiente": "PreProducci�n"
  },
  "NTS80VRT_TMP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.80",
    "ambiente": "PreProducci�n"
  },
  "PROB14ABSPREP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.14",
    "ambiente": "PreProducci�n"
  },
  "PROBDB23ABSPREP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.23",
    "ambiente": "PreProducci�n"
  },
  "PROBDB23SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.123",
    "ambiente": "PreProducci�n"
  },
  "PROBWEB24ABSPREP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.24",
    "ambiente": "PreProducci�n"
  },
  "RTABS142PREP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.142",
    "ambiente": "PreProducci�n"
  },
  "SIDB62ABSPREP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.62",
    "ambiente": "PreProducci�n"
  },
  "UNISYS51ABSPREP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n1",
    "ip": "172.20.73.51",
    "ambiente": "PreProducci�n"
  },
  "BDLINK118VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.118",
    "ambiente": "Producci�n"
  },
  "COMX33SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.33",
    "ambiente": "Producci�n"
  },
  "DB04VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.4",
    "ambiente": "Producci�n"
  },
  "DB15VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.86",
    "ambiente": "Producci�n"
  },
  "DB6VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.108",
    "ambiente": "Producci�n"
  },
  "DB97SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.97",
    "ambiente": "Producci�n"
  },
  "DBRDM31VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.31",
    "ambiente": "Producci�n"
  },
  "GRAFO33VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.33",
    "ambiente": "Producci�n"
  },
  "NTS101DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.1.113",
    "ambiente": "Producci�n"
  },
  "NTS126BVRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.27",
    "ambiente": "Producci�n"
  },
  "NTS19 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.119",
    "ambiente": "Producci�n"
  },
  "NTS28VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.28",
    "ambiente": "Producci�n"
  },
  "NTS33VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.149",
    "ambiente": "Producci�n"
  },
  "NTS60BVRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.61",
    "ambiente": "Producci�n"
  },
  "NTS9VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.9",
    "ambiente": "Producci�n"
  },
  "NTSMDC06 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "139.1.1.33",
    "ambiente": "Producci�n"
  },
  "SEGINFOSHP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.21.21.51",
    "ambiente": "Producci�n"
  },
  "TRK95VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.95",
    "ambiente": "Producci�n"
  },
  "UNISYSTAS51VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.30.51",
    "ambiente": "Producci�n"
  },
  "W2S118 (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "10.0.0.118",
    "ambiente": "Producci�n"
  },
  "4DBAS240SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.240",
    "ambiente": "Producci�n"
  },
  "BSJDRPPXY01 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.203",
    "ambiente": "Producci�n"
  },
  "caja-003 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.14.61",
    "ambiente": "Producci�n"
  },
  "FATCA (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.184",
    "ambiente": "Producci�n"
  },
  "NTS020PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.21.15.234",
    "ambiente": "Producci�n"
  },
  "NTS100PRX1 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.100.200",
    "ambiente": "Producci�n"
  },
  "NTS102PRX2 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.2.201",
    "ambiente": "Producci�n"
  },
  "NTS103PRX2 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.3.202",
    "ambiente": "Producci�n"
  },
  "NTS105PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.5.239",
    "ambiente": "Producci�n"
  },
  "NTS106PRX2 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.6.201",
    "ambiente": "Producci�n"
  },
  "NTS107PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.7.239",
    "ambiente": "Producci�n"
  },
  "NTS113PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.13.239",
    "ambiente": "Producci�n"
  },
  "NTS119PRX1 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.19.200",
    "ambiente": "Producci�n"
  },
  "NTS203PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.21.69.239",
    "ambiente": "Producci�n"
  },
  "NTS46VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.169",
    "ambiente": "Producci�n"
  },
  "NTS57VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.177",
    "ambiente": "Producci�n"
  },
  "PRA219SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.219",
    "ambiente": "Producci�n"
  },
  "TES-002 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.14.66",
    "ambiente": "Producci�n"
  },
  "WIN10PIVOT65 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.65",
    "ambiente": "Producci�n"
  },
  "WSUS63VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.63",
    "ambiente": "Producci�n"
  },
  "DCSEMP02 (SitioEmpresas.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "192.168.200.101",
    "ambiente": "Producci�n"
  },
  "MERCAPDB136VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.136",
    "ambiente": "Producci�n"
  },
  "MSEXC02VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.2",
    "ambiente": "Producci�n"
  },
  "SNMPC250SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.250",
    "ambiente": "Producci�n"
  },
  "SRV120VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.120",
    "ambiente": "Producci�n"
  },
  "APEXONE56SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.56",
    "ambiente": "Producci�n"
  },
  "APPS19VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.19",
    "ambiente": "Producci�n"
  },
  "APPV04SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.94",
    "ambiente": "Producci�n"
  },
  "BRS111SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.111",
    "ambiente": "Producci�n"
  },
  "BSJSOCORP216DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.216",
    "ambiente": "Producci�n"
  },
  "CC111SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.112",
    "ambiente": "Producci�n"
  },
  "DHCP77SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.77",
    "ambiente": "Producci�n"
  },
  "FS-COM155 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.155",
    "ambiente": "Producci�n"
  },
  "FS-OPERAC153 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.153",
    "ambiente": "Producci�n"
  },
  "GOA48SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.48",
    "ambiente": "Producci�n"
  },
  "INTRANETUSERS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.198",
    "ambiente": "Producci�n"
  },
  "MCK12VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.12",
    "ambiente": "Producci�n"
  },
  "NTS115DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.15.113",
    "ambiente": "Producci�n"
  },
  "NTS116DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.16.113",
    "ambiente": "Producci�n"
  },
  "NTS120DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "202.1.20.113",
    "ambiente": "Producci�n"
  },
  "NTS174VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.174",
    "ambiente": "Producci�n"
  },
  "NTS204DC (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.21.204.113",
    "ambiente": "Producci�n"
  },
  "NTS77VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.152",
    "ambiente": "Producci�n"
  },
  "NTS82VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.118",
    "ambiente": "Producci�n"
  },
  "NTS88VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.88",
    "ambiente": "Producci�n"
  },
  "PAI74SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.74",
    "ambiente": "Producci�n"
  },
  "PIVOT242SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.242",
    "ambiente": "Producci�n"
  },
  "prtaudit (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.21.21.17",
    "ambiente": "Producci�n"
  },
  "PRXVBK32SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.8.32",
    "ambiente": "Producci�n"
  },
  "PRXVBK37SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.8.37",
    "ambiente": "Producci�n"
  },
  "REPOPAI38SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.38",
    "ambiente": "Producci�n"
  },
  "VMDB03 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.8.3",
    "ambiente": "Producci�n"
  },
  "VMPROXY10SQL (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.8.10",
    "ambiente": "Producci�n"
  },
  "BSJCORP130DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.130",
    "ambiente": "Producci�n"
  },
  "ENGAGEMD (petersen.corp)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.69",
    "ambiente": "Producci�n"
  },
  "JUD61SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.61",
    "ambiente": "Producci�n"
  },
  "NTS021SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.14.121",
    "ambiente": "Producci�n"
  },
  "NTS20VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.20",
    "ambiente": "Producci�n"
  },
  "NTS502V (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.1.129",
    "ambiente": "Producci�n"
  },
  "SCO53VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.53",
    "ambiente": "Producci�n"
  },
  "SI58SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.4.58",
    "ambiente": "Producci�n"
  },
  "SW191DRS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "172.20.72.191",
    "ambiente": "Producci�n"
  },
  "WS70VRT (SitioEmpresas.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n2",
    "ip": "10.0.0.70",
    "ambiente": "Producci�n"
  },
  "ACCESO238VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.238",
    "ambiente": "Producci�n"
  },
  "APIDMEDIA74SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.74",
    "ambiente": "Producci�n"
  },
  "APPTI250VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.250",
    "ambiente": "Producci�n"
  },
  "ATE49SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.49",
    "ambiente": "Producci�n"
  },
  "BMC45SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.45",
    "ambiente": "Producci�n"
  },
  "BRS11SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.11",
    "ambiente": "Producci�n"
  },
  "BSJCORP131DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.131",
    "ambiente": "Producci�n"
  },
  "BSJDRPPXY02 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.204",
    "ambiente": "Producci�n"
  },
  "BSJSOCORP217DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.217",
    "ambiente": "Producci�n"
  },
  "caja-004 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.14.63",
    "ambiente": "Producci�n"
  },
  "CC148SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.148",
    "ambiente": "Producci�n"
  },
  "CSMH01SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.14.1",
    "ambiente": "Producci�n"
  },
  "DB10VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.80",
    "ambiente": "Producci�n"
  },
  "DB16VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.16",
    "ambiente": "Producci�n"
  },
  "DB7VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.77",
    "ambiente": "Producci�n"
  },
  "DB9VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.79",
    "ambiente": "Producci�n"
  },
  "DC01DMZ (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "10.0.0.11",
    "ambiente": "Producci�n"
  },
  "DEEP55VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.55",
    "ambiente": "Producci�n"
  },
  "DLOGS218SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.218",
    "ambiente": "Producci�n"
  },
  "ETSDB38VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.138",
    "ambiente": "Producci�n"
  },
  "FRDBSJ01DC (root.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.139.1",
    "ambiente": "Producci�n"
  },
  "FS-FINAN157 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.157",
    "ambiente": "Producci�n"
  },
  "FS-RHMRO159 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.159",
    "ambiente": "Producci�n"
  },
  "GOAD47SRV (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "10.0.0.47",
    "ambiente": "Producci�n"
  },
  "HK110SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.110",
    "ambiente": "Producci�n"
  },
  "Invgate_Assets_BSJ (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.42",
    "ambiente": "Producci�n"
  },
  "LEGD62VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.62",
    "ambiente": "Producci�n"
  },
  "MDE26SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.26",
    "ambiente": "Producci�n"
  },
  "MIM16SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.16",
    "ambiente": "Producci�n"
  },
  "NIW85VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "169.254.55.214",
    "ambiente": "Producci�n"
  },
  "NTS020PRX1 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.21.15.200",
    "ambiente": "Producci�n"
  },
  "NTS022 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.14.22",
    "ambiente": "Producci�n"
  },
  "NTS100PRX2 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "202.1.100.201",
    "ambiente": "Producci�n"
  },
  "NTS101SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.101",
    "ambiente": "Producci�n"
  },
  "NTS102SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "2002:ca01:266::ca01:266",
    "ambiente": "Producci�n"
  },
  "NTS103SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "2002:ca01:366::ca01:366",
    "ambiente": "Producci�n"
  },
  "NTS105SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "2002:ca01:566::ca01:566",
    "ambiente": "Producci�n"
  },
  "NTS106SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "2002:ca01:666::ca01:666",
    "ambiente": "Producci�n"
  },
  "NTS107PRX (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "202.1.7.200",
    "ambiente": "Producci�n"
  },
  "NTS113PRX (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "202.1.13.211",
    "ambiente": "Producci�n"
  },
  "NTS115PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "202.1.15.239",
    "ambiente": "Producci�n"
  },
  "NTS116PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "202.1.16.239",
    "ambiente": "Producci�n"
  },
  "NTS119PRX2 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "202.1.19.201",
    "ambiente": "Producci�n"
  },
  "NTS120PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "202.1.20.234",
    "ambiente": "Producci�n"
  },
  "NTS126VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.126",
    "ambiente": "Producci�n"
  },
  "NTS17VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.217",
    "ambiente": "Producci�n"
  },
  "NTS190VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.168",
    "ambiente": "Producci�n"
  },
  "NTS203PRX1 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.21.69.200",
    "ambiente": "Producci�n"
  },
  "NTS204PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.21.204.239",
    "ambiente": "Producci�n"
  },
  "NTS21 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "139.1.1.21",
    "ambiente": "Producci�n"
  },
  "NTS29VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.29",
    "ambiente": "Producci�n"
  },
  "NTS34VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.136",
    "ambiente": "Producci�n"
  },
  "NTS47VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.47",
    "ambiente": "Producci�n"
  },
  "NTS51VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.51",
    "ambiente": "Producci�n"
  },
  "NTS58VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.58",
    "ambiente": "Producci�n"
  },
  "NTS60VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.60",
    "ambiente": "Producci�n"
  },
  "NTS78VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.161",
    "ambiente": "Producci�n"
  },
  "NTS83PKIVRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.83",
    "ambiente": "Producci�n"
  },
  "NTS94VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.94",
    "ambiente": "Producci�n"
  },
  "NTSMDC02 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "139.1.1.104",
    "ambiente": "Producci�n"
  },
  "OCPFE123SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.123",
    "ambiente": "Producci�n"
  },
  "PAISVR07VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.7",
    "ambiente": "Producci�n"
  },
  "PIVOTCORP12SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.12",
    "ambiente": "Producci�n"
  },
  "PROB14VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.30.114",
    "ambiente": "Producci�n"
  },
  "PRTG186VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.186",
    "ambiente": "Producci�n"
  },
  "PRXVBK33SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.8.33",
    "ambiente": "Producci�n"
  },
  "PWS215SRV (-)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.215",
    "ambiente": "Producci�n"
  },
  "RMA44 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.44",
    "ambiente": "Producci�n"
  },
  "SDR70VRT (SitioEmpresas.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "192.168.200.70",
    "ambiente": "Producci�n"
  },
  "SERV23SRV (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "10.0.0.23",
    "ambiente": "Producci�n"
  },
  "SI59SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.30.59",
    "ambiente": "Producci�n"
  },
  "SONDA23SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.23",
    "ambiente": "Producci�n"
  },
  "SRV181VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.181",
    "ambiente": "Producci�n"
  },
  "SYS9SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "192.168.56.1",
    "ambiente": "Producci�n"
  },
  "TES-003 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.14.67",
    "ambiente": "Producci�n"
  },
  "TSN26VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.72.27",
    "ambiente": "Producci�n"
  },
  "VAM28SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.28",
    "ambiente": "Producci�n"
  },
  "vmfichadas (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.188",
    "ambiente": "Producci�n"
  },
  "W10SEG (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.21.20.83",
    "ambiente": "Producci�n"
  },
  "wbs87vrt (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.1.87",
    "ambiente": "Producci�n"
  },
  "WIN10RITEST (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.116",
    "ambiente": "Producci�n"
  },
  "WSCOMX (SitioEmpresas.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "192.168.200.21",
    "ambiente": "Producci�n"
  },
  "XWS21SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n3",
    "ip": "172.20.4.21",
    "ambiente": "Producci�n"
  },
  "accesos175vrt (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.175",
    "ambiente": "Producci�n"
  },
  "APPCOR6VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.6",
    "ambiente": "Producci�n"
  },
  "APPV01VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.91",
    "ambiente": "Producci�n"
  },
  "AUPDT11SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.11",
    "ambiente": "Producci�n"
  },
  "BOMGAR163VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.163",
    "ambiente": "Producci�n"
  },
  "BSJCORP112DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.153",
    "ambiente": "Producci�n"
  },
  "BSJCORP132DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.132",
    "ambiente": "Producci�n"
  },
  "BSJSOCORP213DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.213",
    "ambiente": "Producci�n"
  },
  "CAC67VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.67",
    "ambiente": "Producci�n"
  },
  "caja-005 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.14.60",
    "ambiente": "Producci�n"
  },
  "CDP168SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.168",
    "ambiente": "Producci�n"
  },
  "CSRH02SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.14.2",
    "ambiente": "Producci�n"
  },
  "DB11VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.81",
    "ambiente": "Producci�n"
  },
  "DB17VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.17",
    "ambiente": "Producci�n"
  },
  "DB87SQL2008 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.87",
    "ambiente": "Producci�n"
  },
  "DBCOR60VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.60",
    "ambiente": "Producci�n"
  },
  "DC02DMZ (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "10.0.0.12",
    "ambiente": "Producci�n"
  },
  "DEVABS143 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.30.143",
    "ambiente": "Producci�n"
  },
  "ECHECK50SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.50",
    "ambiente": "Producci�n"
  },
  "F2K021DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.14.221",
    "ambiente": "Producci�n"
  },
  "FRDBSJ03DC (root.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.139.38",
    "ambiente": "Producci�n"
  },
  "FS-GGDIR158 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.158",
    "ambiente": "Producci�n"
  },
  "FS-RROP160 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.160",
    "ambiente": "Producci�n"
  },
  "GOAD48SRV (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "10.0.0.48",
    "ambiente": "Producci�n"
  },
  "hub01 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "139.1.1.206",
    "ambiente": "Producci�n"
  },
  "Invgatebsj2 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.36",
    "ambiente": "Producci�n"
  },
  "LEGDB40VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.40",
    "ambiente": "Producci�n"
  },
  "MDE26VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.26",
    "ambiente": "Producci�n"
  },
  "MOBSEC243VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.243",
    "ambiente": "Producci�n"
  },
  "NTS0001DC (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "139.1.1.101",
    "ambiente": "Producci�n"
  },
  "NTS020PRX2 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.21.15.201",
    "ambiente": "Producci�n"
  },
  "NTS022SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.14.122",
    "ambiente": "Producci�n"
  },
  "NTS100SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "2002:ca01:6466::ca01:6466",
    "ambiente": "Producci�n"
  },
  "NTS102 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "202.1.2.100",
    "ambiente": "Producci�n"
  },
  "NTS103 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "202.1.3.100",
    "ambiente": "Producci�n"
  },
  "NTS105 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "202.1.5.100",
    "ambiente": "Producci�n"
  },
  "NTS106DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "202.1.6.113",
    "ambiente": "Producci�n"
  },
  "NTS106V (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "202.1.6.100",
    "ambiente": "Producci�n"
  },
  "NTS107SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "202.1.7.101",
    "ambiente": "Producci�n"
  },
  "NTS113SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "202.1.13.102",
    "ambiente": "Producci�n"
  },
  "NTS115PRX (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "202.1.15.211",
    "ambiente": "Producci�n"
  },
  "NTS116SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.14.117",
    "ambiente": "Producci�n"
  },
  "NTS119SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "202.1.19.102",
    "ambiente": "Producci�n"
  },
  "NTS120PRX1 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "202.1.20.200",
    "ambiente": "Producci�n"
  },
  "NTS128 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.182",
    "ambiente": "Producci�n"
  },
  "NTS183VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.183",
    "ambiente": "Producci�n"
  },
  "NTS202VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.194",
    "ambiente": "Producci�n"
  },
  "NTS203PRX2 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.21.69.201",
    "ambiente": "Producci�n"
  },
  "NTS204PRX1 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.21.204.200",
    "ambiente": "Producci�n"
  },
  "NTS21VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.141",
    "ambiente": "Producci�n"
  },
  "NTS30B (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.160",
    "ambiente": "Producci�n"
  },
  "NTS36VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.36",
    "ambiente": "Producci�n"
  },
  "NTS49SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.149",
    "ambiente": "Producci�n"
  },
  "NTS52VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.52",
    "ambiente": "Producci�n"
  },
  "NTS60 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.70",
    "ambiente": "Producci�n"
  },
  "NTS66VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.159",
    "ambiente": "Producci�n"
  },
  "NTS80VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.125",
    "ambiente": "Producci�n"
  },
  "NTS84VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.84",
    "ambiente": "Producci�n"
  },
  "NTS96 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.96",
    "ambiente": "Producci�n"
  },
  "NTSMDC03 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.103",
    "ambiente": "Producci�n"
  },
  "OCPMS99SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.99",
    "ambiente": "Producci�n"
  },
  "PC80DSK (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "139.1.1.81",
    "ambiente": "Producci�n"
  },
  "PIVOTL150VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.58.150",
    "ambiente": "Producci�n"
  },
  "PROBDB23VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.23",
    "ambiente": "Producci�n"
  },
  "PRXCPD201SJ (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.201",
    "ambiente": "Producci�n"
  },
  "PRXVBK34SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.8.34",
    "ambiente": "Producci�n"
  },
  "PWS216SRV (-)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.216",
    "ambiente": "Producci�n"
  },
  "RSGO210DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.210",
    "ambiente": "Producci�n"
  },
  "SDR71VRT (SitioEmpresas.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "10.0.0.71",
    "ambiente": "Producci�n"
  },
  "SFBPRINT39VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.39",
    "ambiente": "Producci�n"
  },
  "SIDB62VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.62",
    "ambiente": "Producci�n"
  },
  "SOS18VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.18",
    "ambiente": "Producci�n"
  },
  "SRVAUDITORIAVRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.239",
    "ambiente": "Producci�n"
  },
  "SYSADOC22SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.22",
    "ambiente": "Producci�n"
  },
  "TES-004 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.14.68",
    "ambiente": "Producci�n"
  },
  "TSN66SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.72.66",
    "ambiente": "Producci�n"
  },
  "VAPP35VRT (SitioEmpresas.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "192.168.200.35",
    "ambiente": "Producci�n"
  },
  "VMGATE01 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.8.1",
    "ambiente": "Producci�n"
  },
  "W10SFB (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.55",
    "ambiente": "Producci�n"
  },
  "WCOMX (SitioEmpresas.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "192.168.200.20",
    "ambiente": "Producci�n"
  },
  "WIN-2B1BPAA2Q16 (-)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.1.127",
    "ambiente": "Producci�n"
  },
  "WSL119VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n4",
    "ip": "172.20.4.119",
    "ambiente": "Producci�n"
  },
  "accesovrt (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.173",
    "ambiente": "Producci�n"
  },
  "APPDRS222SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.222",
    "ambiente": "Producci�n"
  },
  "APPV02VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.202",
    "ambiente": "Producci�n"
  },
  "BATCH240VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.240",
    "ambiente": "Producci�n"
  },
  "BomgarV162vrt (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.162",
    "ambiente": "Producci�n"
  },
  "BSJCORP113DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.113",
    "ambiente": "Producci�n"
  },
  "BSJCORP133DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.133",
    "ambiente": "Producci�n"
  },
  "BSJSOCORP214DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.214",
    "ambiente": "Producci�n"
  },
  "caja-001 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.14.62",
    "ambiente": "Producci�n"
  },
  "CAPS147VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.147",
    "ambiente": "Producci�n"
  },
  "CM244VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.244",
    "ambiente": "Producci�n"
  },
  "CST135SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.135",
    "ambiente": "Producci�n"
  },
  "DB12VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.82",
    "ambiente": "Producci�n"
  },
  "DB3VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.3",
    "ambiente": "Producci�n"
  },
  "DB88SQL2012 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.88",
    "ambiente": "Producci�n"
  },
  "DBHZN19VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.19",
    "ambiente": "Producci�n"
  },
  "dcp100vrt (petersen.corp)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.100",
    "ambiente": "Producci�n"
  },
  "DEVOC14DRS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.72.14",
    "ambiente": "Producci�n"
  },
  "EFLOWDB62SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.162",
    "ambiente": "Producci�n"
  },
  "F2K600DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.1.90",
    "ambiente": "Producci�n"
  },
  "FS156VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.156",
    "ambiente": "Producci�n"
  },
  "FS-LEXAUDIT151 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.151",
    "ambiente": "Producci�n"
  },
  "FS-SYS152 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.152",
    "ambiente": "Producci�n"
  },
  "GPC85SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.85",
    "ambiente": "Producci�n"
  },
  "HUB02SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.206",
    "ambiente": "Producci�n"
  },
  "IS4SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.43",
    "ambiente": "Producci�n"
  },
  "LXD74VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "192.168.200.74",
    "ambiente": "Producci�n"
  },
  "MEAPMFA10SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.10",
    "ambiente": "Producci�n"
  },
  "MONITORWF (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.35",
    "ambiente": "Producci�n"
  },
  "NTS020 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.21.15.100",
    "ambiente": "Producci�n"
  },
  "NTS020SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.21.15.102",
    "ambiente": "Producci�n"
  },
  "NTS100DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.100.113",
    "ambiente": "Producci�n"
  },
  "NTS100V (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.100.100",
    "ambiente": "Producci�n"
  },
  "NTS102DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.2.113",
    "ambiente": "Producci�n"
  },
  "NTS103DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.3.113",
    "ambiente": "Producci�n"
  },
  "NTS105DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.5.113",
    "ambiente": "Producci�n"
  },
  "NTS106PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.6.234",
    "ambiente": "Producci�n"
  },
  "NTS107 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.7.100",
    "ambiente": "Producci�n"
  },
  "NTS11 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "139.1.1.11",
    "ambiente": "Producci�n"
  },
  "NTS113V (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.13.100",
    "ambiente": "Producci�n"
  },
  "NTS115SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.15.101",
    "ambiente": "Producci�n"
  },
  "NTS119DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.19.113",
    "ambiente": "Producci�n"
  },
  "NTS119V (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.19.100",
    "ambiente": "Producci�n"
  },
  "NTS120PRX2 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "202.1.20.201",
    "ambiente": "Producci�n"
  },
  "NTS128SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.128",
    "ambiente": "Producci�n"
  },
  "NTS187 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.187",
    "ambiente": "Producci�n"
  },
  "NTS203 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.21.69.100",
    "ambiente": "Producci�n"
  },
  "NTS203SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.21.69.102",
    "ambiente": "Producci�n"
  },
  "NTS204PRX2 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.21.204.201",
    "ambiente": "Producci�n"
  },
  "NTS23VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.124",
    "ambiente": "Producci�n"
  },
  "NTS30VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.156",
    "ambiente": "Producci�n"
  },
  "NTS41 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "139.1.1.141",
    "ambiente": "Producci�n"
  },
  "NTS49VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.139",
    "ambiente": "Producci�n"
  },
  "NTS53VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.53",
    "ambiente": "Producci�n"
  },
  "NTS601 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.91",
    "ambiente": "Producci�n"
  },
  "NTS67VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.122",
    "ambiente": "Producci�n"
  },
  "NTS81VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.158",
    "ambiente": "Producci�n"
  },
  "NTS87SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.137",
    "ambiente": "Producci�n"
  },
  "NTS96AFIP_NV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.166",
    "ambiente": "Producci�n"
  },
  "NTSMDC04 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.106",
    "ambiente": "Producci�n"
  },
  "OSXG130VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.130",
    "ambiente": "Producci�n"
  },
  "PHPWIN93SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.93",
    "ambiente": "Producci�n"
  },
  "PP40VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.40",
    "ambiente": "Producci�n"
  },
  "PROBW214 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.214",
    "ambiente": "Producci�n"
  },
  "PRXVBK30SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.8.30",
    "ambiente": "Producci�n"
  },
  "PRXVBK35SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.8.35",
    "ambiente": "Producci�n"
  },
  "PY40SRV (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "10.0.0.40",
    "ambiente": "Producci�n"
  },
  "RTABS142 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.142",
    "ambiente": "Producci�n"
  },
  "SDR95VRT (SitioEmpresas.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "192.168.200.95",
    "ambiente": "Producci�n"
  },
  "SFR71SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.71",
    "ambiente": "Producci�n"
  },
  "SINCRO54SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.54",
    "ambiente": "Producci�n"
  },
  "SPOT247VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.30.19.65",
    "ambiente": "Producci�n"
  },
  "SRVDBVRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.81",
    "ambiente": "Producci�n"
  },
  "TECNO9VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.21.21.9",
    "ambiente": "Producci�n"
  },
  "TES-005 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.14.69",
    "ambiente": "Producci�n"
  },
  "UAS20SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.20",
    "ambiente": "Producci�n"
  },
  "VAPPS22SRV (SitioEmpresas.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "192.168.200.22",
    "ambiente": "Producci�n"
  },
  "VMGATE02 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.8.2",
    "ambiente": "Producci�n"
  },
  "W2S116APP (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "10.0.0.116",
    "ambiente": "Producci�n"
  },
  "WF06SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.1.106",
    "ambiente": "Producci�n"
  },
  "WL150VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "172.20.4.150",
    "ambiente": "Producci�n"
  },
  "WSMAG75VRT (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n5",
    "ip": "10.0.0.75",
    "ambiente": "Producci�n"
  },
  "ADMPAI108SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.108",
    "ambiente": "Producci�n"
  },
  "APPPAI22VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.22",
    "ambiente": "Producci�n"
  },
  "APPV03SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.3",
    "ambiente": "Producci�n"
  },
  "BDBSM84VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.185",
    "ambiente": "Producci�n"
  },
  "BOMGARV165VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.165",
    "ambiente": "Producci�n"
  },
  "BSJCORP114DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.114",
    "ambiente": "Producci�n"
  },
  "BSJCORP134DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.134",
    "ambiente": "Producci�n"
  },
  "BSJSOCORP215DKP (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.215",
    "ambiente": "Producci�n"
  },
  "caja-002 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.14.64",
    "ambiente": "Producci�n"
  },
  "CAXCOM32VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.32",
    "ambiente": "Producci�n"
  },
  "CODEX64VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.64",
    "ambiente": "Producci�n"
  },
  "CUSD57VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.57",
    "ambiente": "Producci�n"
  },
  "DB13VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.113",
    "ambiente": "Producci�n"
  },
  "DB5VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.5",
    "ambiente": "Producci�n"
  },
  "DB8VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.78",
    "ambiente": "Producci�n"
  },
  "DBPRMQ25 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.25",
    "ambiente": "Producci�n"
  },
  "DCSEMP01 (SitioEmpresas.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "192.168.200.100",
    "ambiente": "Producci�n"
  },
  "DHCP76SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.76",
    "ambiente": "Producci�n"
  },
  "EMADB75VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.75",
    "ambiente": "Producci�n"
  },
  "FAC83DSK (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.83",
    "ambiente": "Producci�n"
  },
  "FS-CDG154 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.154",
    "ambiente": "Producci�n"
  },
  "FS-OHVDI89 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.89",
    "ambiente": "Producci�n"
  },
  "GOA47SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.47",
    "ambiente": "Producci�n"
  },
  "GRAF121SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.121",
    "ambiente": "Producci�n"
  },
  "INFOC92VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.92",
    "ambiente": "Producci�n"
  },
  "IWBCA13SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.13",
    "ambiente": "Producci�n"
  },
  "MBT192VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.192",
    "ambiente": "Producci�n"
  },
  "MERCAP131VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.131",
    "ambiente": "Producci�n"
  },
  "MSEXC01VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.1",
    "ambiente": "Producci�n"
  },
  "NTS020DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.21.15.113",
    "ambiente": "Producci�n"
  },
  "NTS021 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.14.21",
    "ambiente": "Producci�n"
  },
  "NTS100PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "202.1.100.234",
    "ambiente": "Producci�n"
  },
  "NTS101 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.1",
    "ambiente": "Producci�n"
  },
  "NTS102PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "202.1.2.239",
    "ambiente": "Producci�n"
  },
  "NTS103PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "202.1.3.239",
    "ambiente": "Producci�n"
  },
  "NTS105PROX2 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "202.1.5.201",
    "ambiente": "Producci�n"
  },
  "NTS106PRX1 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "202.1.6.200",
    "ambiente": "Producci�n"
  },
  "NTS107DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "202.1.7.113",
    "ambiente": "Producci�n"
  },
  "NTS113DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "202.1.13.113",
    "ambiente": "Producci�n"
  },
  "NTS115 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "202.1.15.100",
    "ambiente": "Producci�n"
  },
  "NTS116 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.14.116",
    "ambiente": "Producci�n"
  },
  "NTS119PRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "202.1.19.239",
    "ambiente": "Producci�n"
  },
  "NTS120 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "202.1.20.100",
    "ambiente": "Producci�n"
  },
  "NTS120SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "2002:ca01:1467::ca01:1467",
    "ambiente": "Producci�n"
  },
  "NTS15 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "139.1.1.15",
    "ambiente": "Producci�n"
  },
  "NTS18VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.18",
    "ambiente": "Producci�n"
  },
  "NTS203DCS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.21.69.113",
    "ambiente": "Producci�n"
  },
  "NTS204 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.21.204.100",
    "ambiente": "Producci�n"
  },
  "NTS204SAM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.21.204.102",
    "ambiente": "Producci�n"
  },
  "NTS24VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.170",
    "ambiente": "Producci�n"
  },
  "NTS32VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.32",
    "ambiente": "Producci�n"
  },
  "NTS43VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.30.144",
    "ambiente": "Producci�n"
  },
  "NTS501V (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.121",
    "ambiente": "Producci�n"
  },
  "NTS54VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.54",
    "ambiente": "Producci�n"
  },
  "NTS60A (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.197",
    "ambiente": "Producci�n"
  },
  "NTS76VRTFS (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.176",
    "ambiente": "Producci�n"
  },
  "NTS82PKIVRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.82",
    "ambiente": "Producci�n"
  },
  "NTS87VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.140",
    "ambiente": "Producci�n"
  },
  "NTS98VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.98",
    "ambiente": "Producci�n"
  },
  "NTSMDC05 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "139.1.1.102",
    "ambiente": "Producci�n"
  },
  "PAI10VM (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.10",
    "ambiente": "Producci�n"
  },
  "PIVOT21DMZ (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "10.0.0.21",
    "ambiente": "Producci�n"
  },
  "PRA218SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.218",
    "ambiente": "Producci�n"
  },
  "PRT75VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.75",
    "ambiente": "Producci�n"
  },
  "PRXVBK31SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.8.31",
    "ambiente": "Producci�n"
  },
  "PRXVBK36SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.8.36",
    "ambiente": "Producci�n"
  },
  "RDSPIVOT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.170",
    "ambiente": "Producci�n"
  },
  "RUNDECK125SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.125",
    "ambiente": "Producci�n"
  },
  "SeginfoServer (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.235",
    "ambiente": "Producci�n"
  },
  "SFRBD72SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.72",
    "ambiente": "Producci�n"
  },
  "SLPNTIQS69SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.69",
    "ambiente": "Producci�n"
  },
  "SPPC17SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.17",
    "ambiente": "Producci�n"
  },
  "SW137SRV (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.72.137",
    "ambiente": "Producci�n"
  },
  "TES-001 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.147",
    "ambiente": "Producci�n"
  },
  "TFSABS141 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.30.141",
    "ambiente": "Producci�n"
  },
  "UNI46VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.4.46",
    "ambiente": "Producci�n"
  },
  "VMBD06 (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.8.6",
    "ambiente": "Producci�n"
  },
  "VMONE02VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.2",
    "ambiente": "Producci�n"
  },
  "W2S117BD (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "10.0.0.117",
    "ambiente": "Producci�n"
  },
  "WF06VRT (bancosanjuan.net)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "172.20.1.6",
    "ambiente": "Producci�n"
  },
  "WS60VRT (SitioEmpresas.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "10.0.0.60",
    "ambiente": "Producci�n"
  },
  "WSMAG76SRV (dmz.com)": {
    "type": "Banco San Juan",
    "grupo": "Producci�n6",
    "ip": "10.0.0.76",
    "ambiente": "Producci�n"
  },
  "ADMPAI108TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.102",
    "ambiente": "Test/QA"
  },
  "ATE49SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.149",
    "ambiente": "Test/QA"
  },
  "bsj-caja-02 (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.122",
    "ambiente": "Test/QA"
  },
  "bsj-caja-08 (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.123",
    "ambiente": "Test/QA"
  },
  "CODEX64VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.64",
    "ambiente": "Test/QA"
  },
  "DB14VRT-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.139",
    "ambiente": "Test/QA"
  },
  "DBLINKVRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.220.21",
    "ambiente": "Test/QA"
  },
  "DC02EMPTST (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "10.0.140.103",
    "ambiente": "Test/QA"
  },
  "ECHECK50SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.220.50",
    "ambiente": "Test/QA"
  },
  "ENGAGE07VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.7",
    "ambiente": "Test/QA"
  },
  "F2K500DKP (sin dominio)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "202.1.1.91",
    "ambiente": "Test/QA"
  },
  "JUD61SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.61",
    "ambiente": "Test/QA"
  },
  "MDE26CLON (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.28",
    "ambiente": "Test/QA"
  },
  "NTS101TST (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.101",
    "ambiente": "Test/QA"
  },
  "NTS202VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.202",
    "ambiente": "Test/QA"
  },
  "NTS49SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.93",
    "ambiente": "Test/QA"
  },
  "NTS78ABS (sin dominio)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.78",
    "ambiente": "Test/QA"
  },
  "OCPMS99SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.99",
    "ambiente": "Test/QA"
  },
  "PROB14-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.14",
    "ambiente": "Test/QA"
  },
  "SDR70TST (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "10.0.140.70",
    "ambiente": "Test/QA"
  },
  "SINCRO54VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.54",
    "ambiente": "Test/QA"
  },
  "TERMEP211 (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.211",
    "ambiente": "Test/QA"
  },
  "UAT20SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.29",
    "ambiente": "Test/QA"
  },
  "VM170WF (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.170",
    "ambiente": "Test/QA"
  },
  "VWSDR-TST (sin dominio)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "10.0.123.10",
    "ambiente": "Test/QA"
  },
  "WF161SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.161",
    "ambiente": "Test/QA"
  },
  "WKSTN132 (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.132",
    "ambiente": "Test/QA"
  },
  "WSCOMX (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "10.0.123.21",
    "ambiente": "Test/QA"
  },
  "APPV02TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.92",
    "ambiente": "Test/QA"
  },
  "DB12VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.112",
    "ambiente": "Test/QA"
  },
  "ENG19DBSRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.19",
    "ambiente": "Test/QA"
  },
  "MERCAP36DB (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "172.21.222.36",
    "ambiente": "Test/QA"
  },
  "OCPFE23SRV (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "10.0.140.23",
    "ambiente": "Test/QA"
  },
  "SW49SRV-TST (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "10.0.123.49",
    "ambiente": "Test/QA"
  },
  "WCOMX (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing1",
    "ip": "10.0.140.21",
    "ambiente": "Test/QA"
  },
  "APIDMEDIA47SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.47",
    "ambiente": "Test/QA"
  },
  "BD2016 (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.16",
    "ambiente": "Test/QA"
  },
  "bsj-caja-03 (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.117",
    "ambiente": "Test/QA"
  },
  "bsj-caja-09 (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.124",
    "ambiente": "Test/QA"
  },
  "CONNECT88F2K (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.88",
    "ambiente": "Test/QA"
  },
  "DB65VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.65",
    "ambiente": "Test/QA"
  },
  "DBMDE27VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.27",
    "ambiente": "Test/QA"
  },
  "DC02SRV (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.221",
    "ambiente": "Test/QA"
  },
  "EFLOWDB62SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.62",
    "ambiente": "Test/QA"
  },
  "ENGAGEMD (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.169",
    "ambiente": "Test/QA"
  },
  "FS-DVI231 (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.231",
    "ambiente": "Test/QA"
  },
  "LD187SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.187",
    "ambiente": "Test/QA"
  },
  "MDE26VRT-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.26",
    "ambiente": "Test/QA"
  },
  "NTS119 (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.219",
    "ambiente": "Test/QA"
  },
  "NTS24VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.179",
    "ambiente": "Test/QA"
  },
  "NTS49VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.93",
    "ambiente": "Test/QA"
  },
  "NTS78VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "169.254.104.72",
    "ambiente": "Test/QA"
  },
  "PIVOT-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.8",
    "ambiente": "Test/QA"
  },
  "PROBDB23-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.23",
    "ambiente": "Test/QA"
  },
  "SDR71TST (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "10.0.123.71",
    "ambiente": "Test/QA"
  },
  "SOS18VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.218",
    "ambiente": "Test/QA"
  },
  "TERMEP213 (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.213",
    "ambiente": "Test/QA"
  },
  "UNI46VRTOLD (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.146",
    "ambiente": "Test/QA"
  },
  "VM171WF (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.171",
    "ambiente": "Test/QA"
  },
  "W2S16APP-TST (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "10.0.123.116",
    "ambiente": "Test/QA"
  },
  "WF162SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.162",
    "ambiente": "Test/QA"
  },
  "WKSTN133VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.133",
    "ambiente": "Test/QA"
  },
  "WSL19VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.220.19",
    "ambiente": "Test/QA"
  },
  "bsj-caja-01 (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.121",
    "ambiente": "Test/QA"
  },
  "DBEngageDesa (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.87",
    "ambiente": "Test/QA"
  },
  "EWF60 (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "169.254.106.24",
    "ambiente": "Test/QA"
  },
  "NTS15 (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.115",
    "ambiente": "Test/QA"
  },
  "PP40VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.40",
    "ambiente": "Test/QA"
  },
  "TST84VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.84",
    "ambiente": "Test/QA"
  },
  "WKSTN131VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing2",
    "ip": "172.21.222.131",
    "ambiente": "Test/QA"
  },
  "APPCOR6-TST (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.6",
    "ambiente": "Test/QA"
  },
  "BIETL-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.212",
    "ambiente": "Test/QA"
  },
  "bsj-caja-04 (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.114",
    "ambiente": "Test/QA"
  },
  "bsj-caja-10 (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.125",
    "ambiente": "Test/QA"
  },
  "CST35SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.35",
    "ambiente": "Test/QA"
  },
  "DB97SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.97",
    "ambiente": "Test/QA"
  },
  "DC01EMPTST (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "10.0.140.113",
    "ambiente": "Test/QA"
  },
  "DC02TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.20",
    "ambiente": "Test/QA"
  },
  "EMA75SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.175",
    "ambiente": "Test/QA"
  },
  "ENGDB59SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.59",
    "ambiente": "Test/QA"
  },
  "GRAFODESA (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.107",
    "ambiente": "Test/QA"
  },
  "LXD74VRT (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "10.0.140.74",
    "ambiente": "Test/QA"
  },
  "MERCAP31SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.31",
    "ambiente": "Test/QA"
  },
  "NTS119V (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.119",
    "ambiente": "Test/QA"
  },
  "NTS36VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "169.254.181.7",
    "ambiente": "Test/QA"
  },
  "NTS60 (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.140",
    "ambiente": "Test/QA"
  },
  "NTS81VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.181",
    "ambiente": "Test/QA"
  },
  "POCDVI89F2K (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.89",
    "ambiente": "Test/QA"
  },
  "PROBDB48SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.48",
    "ambiente": "Test/QA"
  },
  "SFBPRINT39VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.39",
    "ambiente": "Test/QA"
  },
  "SQLW2012-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.21",
    "ambiente": "Test/QA"
  },
  "TRK196VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.196",
    "ambiente": "Test/QA"
  },
  "UNYSISTAS51VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.51",
    "ambiente": "Test/QA"
  },
  "VM172WF (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.172",
    "ambiente": "Test/QA"
  },
  "W2S17BD-TST (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "10.0.123.117",
    "ambiente": "Test/QA"
  },
  "WF30-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.30",
    "ambiente": "Test/QA"
  },
  "Wkstn134vrt (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.134",
    "ambiente": "Test/QA"
  },
  "WSMAG75VRT (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "10.0.123.75",
    "ambiente": "Test/QA"
  },
  "bsj-caja-07 (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.120",
    "ambiente": "Test/QA"
  },
  "DC01TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.10",
    "ambiente": "Test/QA"
  },
  "IS4DB (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.44",
    "ambiente": "Test/QA"
  },
  "NTS43NVO (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.220.43",
    "ambiente": "Test/QA"
  },
  "SCO53-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.53",
    "ambiente": "Test/QA"
  },
  "VAPPDR-TST (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "10.0.140.11",
    "ambiente": "Test/QA"
  },
  "WL150-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing3",
    "ip": "172.21.222.150",
    "ambiente": "Test/QA"
  },
  "APPV01VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.91",
    "ambiente": "Test/QA"
  },
  "BMC45SRV-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.45",
    "ambiente": "Test/QA"
  },
  "bsj-caja-05 (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.106",
    "ambiente": "Test/QA"
  },
  "CAJAVDIF2K (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.109",
    "ambiente": "Test/QA"
  },
  "CUSD75VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.75",
    "ambiente": "Test/QA"
  },
  "DBCOR60-TST (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.60",
    "ambiente": "Test/QA"
  },
  "DC01SRV (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.110",
    "ambiente": "Test/QA"
  },
  "DLOGS228SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.228",
    "ambiente": "Test/QA"
  },
  "EMADB76VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.76",
    "ambiente": "Test/QA"
  },
  "ETSDB38VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.38",
    "ambiente": "Test/QA"
  },
  "HCS230SRV (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.230",
    "ambiente": "Test/QA"
  },
  "LXD74VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.74",
    "ambiente": "Test/QA"
  },
  "MERCAP32VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.32",
    "ambiente": "Test/QA"
  },
  "NTS128T (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.111",
    "ambiente": "Test/QA"
  },
  "NTS41TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.141",
    "ambiente": "Test/QA"
  },
  "NTS60VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.160",
    "ambiente": "Test/QA"
  },
  "NTS96 (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.96",
    "ambiente": "Test/QA"
  },
  "PortalWeb-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.50",
    "ambiente": "Test/QA"
  },
  "SCF116SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.116",
    "ambiente": "Test/QA"
  },
  "SFR71SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.71",
    "ambiente": "Test/QA"
  },
  "SRVDBVRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.81",
    "ambiente": "Test/QA"
  },
  "TSN66SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.66",
    "ambiente": "Test/QA"
  },
  "VAPP35VRT (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "10.0.140.35",
    "ambiente": "Test/QA"
  },
  "VM173WF (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.173",
    "ambiente": "Test/QA"
  },
  "W2SEBKD15-TST (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "10.0.123.15",
    "ambiente": "Test/QA"
  },
  "WF69SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.69",
    "ambiente": "Test/QA"
  },
  "Wkstn135vrt (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.135",
    "ambiente": "Test/QA"
  },
  "WSMIS76VRT (empresa.bsj)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "10.0.123.76",
    "ambiente": "Test/QA"
  },
  "CDP68SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.68",
    "ambiente": "Test/QA"
  },
  "DVI121DKP-F2K (F2K.test)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.118",
    "ambiente": "Test/QA"
  },
  "MCK12VRT (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.12",
    "ambiente": "Test/QA"
  },
  "NTS77VRT (sin dominio)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.151",
    "ambiente": "Test/QA"
  },
  "SFRBD72SRV (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.72",
    "ambiente": "Test/QA"
  },
  "VSQLDR-TST (vtest.net)": {
    "type": "Banco San Juan",
    "grupo": "Testing4",
    "ip": "172.21.222.13",
    "ambiente": "Test/QA"
  },
  "ASJDC01 (asj.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo1",
    "ip": "172.30.39.12",
    "ambiente": "Producci�n"
  },
  "BERDC01P (ber01.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo1",
    "ip": "172.30.158.11",
    "ambiente": "Producci�n"
  },
  "PTCDC03P (ptc.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo1",
    "ip": "172.30.61.10",
    "ambiente": "Producci�n"
  },
  "QUALIADC03 (qualia.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo1",
    "ip": "172.30.14.15",
    "ambiente": "Producci�n"
  },
  "SRVAZDCONN03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo1",
    "ip": "10.50.212.46",
    "ambiente": "Producci�n"
  },
  "SRVDCOMNIPP01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo1",
    "ip": "172.30.118.20",
    "ambiente": "Producci�n"
  },
  "ASJDC04 (asj.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo2",
    "ip": "172.30.39.11",
    "ambiente": "Producci�n"
  },
  "BSJDC01P (bsj01.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo2",
    "ip": "172.30.128.11",
    "ambiente": "Producci�n"
  },
  "PTCEDC01 (petersenenergia.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo2",
    "ip": "172.30.16.218",
    "ambiente": "Producci�n"
  },
  "ROOTDC1601 (root.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo2",
    "ip": "172.30.10.183",
    "ambiente": "Producci�n"
  },
  "SRVDC01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo2",
    "ip": "172.30.10.184",
    "ambiente": "Producci�n"
  },
  "SRVDCOMNIPP02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo2",
    "ip": "172.30.118.21",
    "ambiente": "Producci�n"
  },
  "ASJDC05 (asj.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo3",
    "ip": "172.19.241.10",
    "ambiente": "Producci�n"
  },
  "DCP100VRT (petersen.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo3",
    "ip": "172.20.1.100",
    "ambiente": "Producci�n"
  },
  "PTCEDC02 (petersenenergia.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo3",
    "ip": "172.30.16.219",
    "ambiente": "Producci�n"
  },
  "ROOTDC1602 (root.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo3",
    "ip": "172.30.10.187",
    "ambiente": "Producci�n"
  },
  "SRVDC01BSF (petersen.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo3",
    "ip": "172.16.10.57",
    "ambiente": "Producci�n"
  },
  "ASJDC06 (asj.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo4",
    "ip": "172.19.252.10",
    "ambiente": "Producci�n"
  },
  "PTCDC01 (petersenthieleycruz.com.ar)": {
    "type": "Corpo",
    "grupo": "DCGrupo4",
    "ip": "172.10.0.101",
    "ambiente": "Producci�n"
  },
  "QUALIADC01 (qualia.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo4",
    "ip": "172.30.14.11",
    "ambiente": "Producci�n"
  },
  "ROOTDC1603 (root.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo4",
    "ip": "172.30.10.208",
    "ambiente": "Producci�n"
  },
  "SRVDC02 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo4",
    "ip": "172.30.10.185",
    "ambiente": "Producci�n"
  },
  "BERDC01 (asj.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo5",
    "ip": "172.30.39.14",
    "ambiente": "Producci�n"
  },
  "PTCDC02P (ptc.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo5",
    "ip": "172.30.61.11",
    "ambiente": "Producci�n"
  },
  "QUALIADC02 (qualia.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo5",
    "ip": "172.30.14.12",
    "ambiente": "Producci�n"
  },
  "SRVAZADCONN01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo5",
    "ip": "10.50.212.45",
    "ambiente": "Producci�n"
  },
  "SRVDCDRS01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "DCGrupo5",
    "ip": "172.30.10.209",
    "ambiente": "Producci�n"
  },
  "ABS9-AZUDEV (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.17.36",
    "ambiente": "Desarrollo"
  },
  "ABS9-DEVSU (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.17.38",
    "ambiente": "Desarrollo"
  },
  "BERINSTWEB01DEV (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "10.50.211.145",
    "ambiente": "Desarrollo"
  },
  "BEROCEAPI01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.88.70",
    "ambiente": "Desarrollo"
  },
  "BEROCEIS01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.88.72",
    "ambiente": "Desarrollo"
  },
  "BEROCEMS01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.88.71",
    "ambiente": "Desarrollo"
  },
  "BERSTDINSQL01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.88.40",
    "ambiente": "Desarrollo"
  },
  "BERSTDINWEB01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.88.41",
    "ambiente": "Desarrollo"
  },
  "BERSTDINWEB02D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.88.42",
    "ambiente": "Desarrollo"
  },
  "BSCOCEAPI01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.98.70",
    "ambiente": "Desarrollo"
  },
  "BSCOCEIS01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.98.72",
    "ambiente": "Desarrollo"
  },
  "BSCOCEMS01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.98.71",
    "ambiente": "Desarrollo"
  },
  "BSCSTDINSQL01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.98.40",
    "ambiente": "Desarrollo"
  },
  "BSCSTDINWEB01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.98.41",
    "ambiente": "Desarrollo"
  },
  "BSCSTDINWEB02D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.98.42",
    "ambiente": "Desarrollo"
  },
  "BSFOCEAPI01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.83.70",
    "ambiente": "Desarrollo"
  },
  "BSFOCEIS01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.83.72",
    "ambiente": "Desarrollo"
  },
  "BSFOCEMS01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.83.71",
    "ambiente": "Desarrollo"
  },
  "BSJOCEAPI01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.93.70",
    "ambiente": "Desarrollo"
  },
  "BSJOCEIS01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.93.72",
    "ambiente": "Desarrollo"
  },
  "BSJOCEMS01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.93.71",
    "ambiente": "Desarrollo"
  },
  "BSJSTDINSQL01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.93.40",
    "ambiente": "Desarrollo"
  },
  "BSJSTDINWEB01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.93.41",
    "ambiente": "Desarrollo"
  },
  "BSJSTDINWEB02D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.93.42",
    "ambiente": "Desarrollo"
  },
  "PTCDMZ01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "10.50.211.91",
    "ambiente": "Desarrollo"
  },
  "PWCCI-DAS-01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.210.86",
    "ambiente": "Desarrollo"
  },
  "SRVBPRISM01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.210.60",
    "ambiente": "Desarrollo"
  },
  "SRVPWRCRVDA01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.210.51",
    "ambiente": "Desarrollo"
  },
  "SRVPWRCRVDA02D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.210.52",
    "ambiente": "Desarrollo"
  },
  "SRVPWRCRVDA03D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.210.53",
    "ambiente": "Desarrollo"
  },
  "SRVPWRCRVDAS01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.210.50",
    "ambiente": "Desarrollo"
  },
  "SRVSQL01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.210.125",
    "ambiente": "Desarrollo"
  },
  "SRVSQL02D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.210.126",
    "ambiente": "Desarrollo"
  },
  "SRVTABBRIDGE01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Desarrollo1",
    "ip": "172.30.213.34",
    "ambiente": "Desarrollo"
  },
  "ABS9-BUILD01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.17.43",
    "ambiente": "Producci�n"
  },
  "ABS9-TOOLS (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.17.37",
    "ambiente": "Producci�n"
  },
  "BERENROLLWEB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.89.98",
    "ambiente": "Producci�n"
  },
  "BERINSTWEB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.89.96",
    "ambiente": "Producci�n"
  },
  "BERMCISIS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.179",
    "ambiente": "Producci�n"
  },
  "BEROCEDB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.89.82",
    "ambiente": "Producci�n"
  },
  "BEROCEMS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.89.64",
    "ambiente": "Producci�n"
  },
  "BERPRICINGWEBP (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.10.28",
    "ambiente": "Producci�n"
  },
  "BERSONPRTG01P (petersenthieleycruz.com.ar)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.89.73",
    "ambiente": "Producci�n"
  },
  "BSCBPRISMSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSCINSTBFF01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.99.95",
    "ambiente": "Producci�n"
  },
  "BSCMCESIS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.207",
    "ambiente": "Producci�n"
  },
  "BSCOCEAPI03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.99.62",
    "ambiente": "Producci�n"
  },
  "BSCOCEIS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.99.68",
    "ambiente": "Producci�n"
  },
  "BSCONBOARDDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.99.194",
    "ambiente": "Producci�n"
  },
  "BSCPWRCRVDA02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.99.59",
    "ambiente": "Producci�n"
  },
  "BSCVUFADB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.99.186",
    "ambiente": "Producci�n"
  },
  "BSFDEBMEDDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.196",
    "ambiente": "Producci�n"
  },
  "BSFINSTWEB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.84.95",
    "ambiente": "Producci�n"
  },
  "BSFMCISIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.173",
    "ambiente": "Producci�n"
  },
  "BSFOCEAPI02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.84.61",
    "ambiente": "Producci�n"
  },
  "BSFOCEIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.84.67",
    "ambiente": "Producci�n"
  },
  "BSFOCEMS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.84.65",
    "ambiente": "Producci�n"
  },
  "BSFPWRCRVDA02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.84.59",
    "ambiente": "Producci�n"
  },
  "BSFSONPRTG01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.84.73",
    "ambiente": "Producci�n"
  },
  "BSJAPIWSO2TDMZ (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.92.141",
    "ambiente": "Producci�n"
  },
  "BSJENROLLWEB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.94.98",
    "ambiente": "Producci�n"
  },
  "BSJINSTWEB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.94.96",
    "ambiente": "Producci�n"
  },
  "BSJOCEAPI01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.94.60",
    "ambiente": "Producci�n"
  },
  "BSJOCEDB03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.94.83",
    "ambiente": "Producci�n"
  },
  "BSJOCEMS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.94.65",
    "ambiente": "Producci�n"
  },
  "BSJPWRCRVDA01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.94.58",
    "ambiente": "Producci�n"
  },
  "BSJSONPRTG02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.94.73",
    "ambiente": "Producci�n"
  },
  "CLOUDERAAPI02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.212.112",
    "ambiente": "Producci�n"
  },
  "CLOUDERAAPI07P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.212.120",
    "ambiente": "Producci�n"
  },
  "CLOUDERAMS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.215.78",
    "ambiente": "Producci�n"
  },
  "CLOUDERAMS06P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.215.85",
    "ambiente": "Producci�n"
  },
  "EDH-SUPPORTWIN (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.213.10",
    "ambiente": "Producci�n"
  },
  "PTCEXC02 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "PWCCI-SIS-01D (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.210.88",
    "ambiente": "Producci�n"
  },
  "SRVAGCTRLR01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.200.50",
    "ambiente": "Producci�n"
  },
  "SRVBTAUX01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.10.3",
    "ambiente": "Producci�n"
  },
  "SRVCAMPADOBEP03 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.215.184",
    "ambiente": "Producci�n"
  },
  "SRVCITASWEB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.250.50",
    "ambiente": "Producci�n"
  },
  "SRVCOMFRON01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.212.140",
    "ambiente": "Producci�n"
  },
  "SRVEFLOWTWEB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.8.63",
    "ambiente": "Producci�n"
  },
  "SRVENGWABSJ01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.10.79",
    "ambiente": "Producci�n"
  },
  "SRVFDAPIDIC01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.246",
    "ambiente": "Producci�n"
  },
  "SRVFSSAS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.10.90",
    "ambiente": "Producci�n"
  },
  "SRVGOADMZHA02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.212.102",
    "ambiente": "Producci�n"
  },
  "SRVINTEG02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.84.79",
    "ambiente": "Producci�n"
  },
  "SRVKIWICT01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.56",
    "ambiente": "Producci�n"
  },
  "SRVMOODLSQL02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.115",
    "ambiente": "Producci�n"
  },
  "SRVNUCLEUS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.212.42",
    "ambiente": "Producci�n"
  },
  "SRVPACTAS01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.10.47",
    "ambiente": "Producci�n"
  },
  "SRVPROCAN02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.215.71",
    "ambiente": "Producci�n"
  },
  "SRVPRTG01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.10.2",
    "ambiente": "Producci�n"
  },
  "SRVPWCSQLC1P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.184",
    "ambiente": "Producci�n"
  },
  "SRVPWRCRVSDS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.71",
    "ambiente": "Producci�n"
  },
  "SRVSNMPC02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.218.50",
    "ambiente": "Producci�n"
  },
  "SRVSQLCITAS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.5",
    "ambiente": "Producci�n"
  },
  "SRVSQLTYS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.10.181",
    "ambiente": "Producci�n"
  },
  "SRVTACTAS01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.10.8",
    "ambiente": "Producci�n"
  },
  "SRVTMMOBILE01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.33",
    "ambiente": "Producci�n"
  },
  "SRVTRENDMAC01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.212.55",
    "ambiente": "Producci�n"
  },
  "SRVTS06P (Nuevo Servidor Licencias TS) (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVTSGDD02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.10.105",
    "ambiente": "Producci�n"
  },
  "SRVUASM01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "10.50.212.41",
    "ambiente": "Producci�n"
  },
  "UNISYS-BUILD01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.17.197",
    "ambiente": "Producci�n"
  },
  "UNISYS-RT03 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.17.121",
    "ambiente": "Producci�n"
  },
  "UNISYS-RT-QA03 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.17.212",
    "ambiente": "Producci�n"
  },
  "UNISYS-TFS2 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n1",
    "ip": "172.30.17.111",
    "ambiente": "Producci�n"
  },
  "ABS9-BUILD02 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.17.44",
    "ambiente": "Producci�n"
  },
  "BERBPRISMSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BERFDSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.89.246",
    "ambiente": "Producci�n"
  },
  "BERMCESIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.202",
    "ambiente": "Producci�n"
  },
  "BEROCEAPI01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.89.60",
    "ambiente": "Producci�n"
  },
  "BEROCEDB03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.89.83",
    "ambiente": "Producci�n"
  },
  "BEROCEMS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.89.65",
    "ambiente": "Producci�n"
  },
  "BERPWRCRVDA01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.89.58",
    "ambiente": "Producci�n"
  },
  "BERSONPRTG02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "10.50.89.73",
    "ambiente": "Producci�n"
  },
  "BSCBPRISMSRV01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSCINSTBFF02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.99.96",
    "ambiente": "Producci�n"
  },
  "BSCMCISIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.182",
    "ambiente": "Producci�n"
  },
  "BSCOCEDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.99.81",
    "ambiente": "Producci�n"
  },
  "BSCOCEIS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.99.69",
    "ambiente": "Producci�n"
  },
  "BSCONBOARDMS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "10.50.99.194",
    "ambiente": "Producci�n"
  },
  "BSCSBALSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.99.74",
    "ambiente": "Producci�n"
  },
  "BSCVUFADB03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.99.187",
    "ambiente": "Producci�n"
  },
  "BSFENROLLWEB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "10.50.84.98",
    "ambiente": "Producci�n"
  },
  "BSFINSTWEB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "10.50.84.96",
    "ambiente": "Producci�n"
  },
  "BSFMCISIS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.174",
    "ambiente": "Producci�n"
  },
  "BSFOCEAPI03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.84.62",
    "ambiente": "Producci�n"
  },
  "BSFOCEIS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.84.68",
    "ambiente": "Producci�n"
  },
  "BSFONBOARDDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.84.194",
    "ambiente": "Producci�n"
  },
  "BSFPWRCRVDA03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.84.56",
    "ambiente": "Producci�n"
  },
  "BSFSONPRTG02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "10.50.84.73",
    "ambiente": "Producci�n"
  },
  "BSJBPRISMSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSJFDSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.94.246",
    "ambiente": "Producci�n"
  },
  "BSJMCESIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.204",
    "ambiente": "Producci�n"
  },
  "BSJOCEAPI02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.94.61",
    "ambiente": "Producci�n"
  },
  "BSJOCEIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.94.67",
    "ambiente": "Producci�n"
  },
  "BSJONBOARDDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.94.194",
    "ambiente": "Producci�n"
  },
  "BSJPWRCRVDA02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.94.59",
    "ambiente": "Producci�n"
  },
  "BSJVUFADB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.94.185",
    "ambiente": "Producci�n"
  },
  "CLOUDERAAPI03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "10.50.212.116",
    "ambiente": "Producci�n"
  },
  "CLOUDERAAPI08P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "10.50.212.121",
    "ambiente": "Producci�n"
  },
  "CLOUDERAMS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.215.80",
    "ambiente": "Producci�n"
  },
  "CLOUDERAMS07P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.215.86",
    "ambiente": "Producci�n"
  },
  "GPSECMODO01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.84.203",
    "ambiente": "Producci�n"
  },
  "PWCCE-DAS-01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.199",
    "ambiente": "Producci�n"
  },
  "SRVAPIWIN03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "10.50.6.210",
    "ambiente": "Producci�n"
  },
  "SRVAZRSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.215.73",
    "ambiente": "Producci�n"
  },
  "SRVBTAUX02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.10.21",
    "ambiente": "Producci�n"
  },
  "SRVCAMPADOBEP04 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.215.186",
    "ambiente": "Producci�n"
  },
  "SRVCITASWEB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "10.50.8.120",
    "ambiente": "Producci�n"
  },
  "SRVCORPWEB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.131",
    "ambiente": "Producci�n"
  },
  "SRVDCBSF1 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVDEPIIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.27",
    "ambiente": "Producci�n"
  },
  "SRVEMANAGDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.10.73",
    "ambiente": "Producci�n"
  },
  "SRVEXGPSA01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.10.59",
    "ambiente": "Producci�n"
  },
  "SRVFS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.10.135",
    "ambiente": "Producci�n"
  },
  "SRVFSUSR01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.106",
    "ambiente": "Producci�n"
  },
  "SRVGOAHA01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.141",
    "ambiente": "Producci�n"
  },
  "SRVINVAM02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.101",
    "ambiente": "Producci�n"
  },
  "SRVMEPSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.118",
    "ambiente": "Producci�n"
  },
  "SRVMSTIO01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.35",
    "ambiente": "Producci�n"
  },
  "SRVOCRBAL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.236",
    "ambiente": "Producci�n"
  },
  "SRVPDBACTAS01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.10.5",
    "ambiente": "Producci�n"
  },
  "SRVPROCAN03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.215.69",
    "ambiente": "Producci�n"
  },
  "SRVPSWSAFE01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVPWCSQLC2P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.185",
    "ambiente": "Producci�n"
  },
  "SRVRECGP01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.11.34",
    "ambiente": "Producci�n"
  },
  "SRVSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.91",
    "ambiente": "Producci�n"
  },
  "SRVSQLMON02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.230",
    "ambiente": "Producci�n"
  },
  "SRVSQLTYS04P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.40",
    "ambiente": "Producci�n"
  },
  "SRVTDATAETL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.57",
    "ambiente": "Producci�n"
  },
  "SRVTOUCHONE (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "10.50.212.55",
    "ambiente": "Producci�n"
  },
  "SRVTS02P (TS usos varios)_restored_20072025 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVTSAWS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.218.51",
    "ambiente": "Producci�n"
  },
  "SRVTSPAI01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.212.10",
    "ambiente": "Producci�n"
  },
  "SRVUNISYSFS (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.17.81",
    "ambiente": "Producci�n"
  },
  "UNISYS-BUILD02 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.17.198",
    "ambiente": "Producci�n"
  },
  "UNISYS-RT04 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.17.122",
    "ambiente": "Producci�n"
  },
  "UNISYS-RT-REL01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": "172.30.17.127",
    "ambiente": "Producci�n"
  },
  "VM600DC00 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "ABS9-RT01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BERBPRISMSRV01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BERINSTBFF01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.89.95",
    "ambiente": "Producci�n"
  },
  "BERMCESIS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.203",
    "ambiente": "Producci�n"
  },
  "BEROCEAPI02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.89.61",
    "ambiente": "Producci�n"
  },
  "BEROCEIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.89.67",
    "ambiente": "Producci�n"
  },
  "BERONBOARDDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.89.194",
    "ambiente": "Producci�n"
  },
  "BERPWRCRVDA02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.89.59",
    "ambiente": "Producci�n"
  },
  "BERVUFADB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.89.185",
    "ambiente": "Producci�n"
  },
  "BSCDEBMEDAPP01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "10.50.212.80",
    "ambiente": "Producci�n"
  },
  "BSCINSTWEB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "10.50.99.95",
    "ambiente": "Producci�n"
  },
  "BSCMCISIS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.183",
    "ambiente": "Producci�n"
  },
  "BSCOCEDB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.99.82",
    "ambiente": "Producci�n"
  },
  "BSCOCEMS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.99.63",
    "ambiente": "Producci�n"
  },
  "BSCONBOARDMS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.99.184",
    "ambiente": "Producci�n"
  },
  "BSCSONPRTG01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.99.73",
    "ambiente": "Producci�n"
  },
  "BSFBPRISMSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFFDSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.84.246",
    "ambiente": "Producci�n"
  },
  "BSFINSTWEB03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "10.50.84.99",
    "ambiente": "Producci�n"
  },
  "BSFMCISIS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.175",
    "ambiente": "Producci�n"
  },
  "BSFOCEDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.84.81",
    "ambiente": "Producci�n"
  },
  "BSFOCEIS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.84.69",
    "ambiente": "Producci�n"
  },
  "BSFONBOARDMS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "10.50.84.150",
    "ambiente": "Producci�n"
  },
  "BSFPWRCRVDAS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.84.57",
    "ambiente": "Producci�n"
  },
  "BSFVUFADB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.84.185",
    "ambiente": "Producci�n"
  },
  "BSJBPRISMSRV01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSJINSTBFF01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.94.95",
    "ambiente": "Producci�n"
  },
  "BSJMCESIS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.205",
    "ambiente": "Producci�n"
  },
  "BSJOCEAPI03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.94.62",
    "ambiente": "Producci�n"
  },
  "BSJOCEIS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.94.69",
    "ambiente": "Producci�n"
  },
  "BSJONBOARDMS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "10.50.94.150",
    "ambiente": "Producci�n"
  },
  "BSJPWRCRVDAS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.94.57",
    "ambiente": "Producci�n"
  },
  "BSJVUFADB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.94.186",
    "ambiente": "Producci�n"
  },
  "CLOUDERAAPI04P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "10.50.212.117",
    "ambiente": "Producci�n"
  },
  "CLOUDERADB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.215.79",
    "ambiente": "Producci�n"
  },
  "CLOUDERAMS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.215.82",
    "ambiente": "Producci�n"
  },
  "CLOUDERAMS08P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.215.87",
    "ambiente": "Producci�n"
  },
  "INVGCONEC01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.34",
    "ambiente": "Producci�n"
  },
  "PTCDMZ01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "PWCCE-SDS-01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.198",
    "ambiente": "Producci�n"
  },
  "SRVAPP01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "10.50.22.54",
    "ambiente": "Producci�n"
  },
  "SRVBEYOND01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.115",
    "ambiente": "Producci�n"
  },
  "SRVCA01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.22",
    "ambiente": "Producci�n"
  },
  "SRVCAPAPP01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.79",
    "ambiente": "Producci�n"
  },
  "SRVCMSBO01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.104",
    "ambiente": "Producci�n"
  },
  "SRVCORPWEB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.132",
    "ambiente": "Producci�n"
  },
  "SRVDEPSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.28",
    "ambiente": "Producci�n"
  },
  "SRVENGWABER01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.29",
    "ambiente": "Producci�n"
  },
  "SRVEXGPSA03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.118.70",
    "ambiente": "Producci�n"
  },
  "SRVFSBKPSQL (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.146",
    "ambiente": "Producci�n"
  },
  "SRVGDS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.54",
    "ambiente": "Producci�n"
  },
  "SRVGOAHA02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.142",
    "ambiente": "Producci�n"
  },
  "SRVINVSD02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.100",
    "ambiente": "Producci�n"
  },
  "SRVMERCAPDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.130",
    "ambiente": "Producci�n"
  },
  "SRVNAP1601P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.62",
    "ambiente": "Producci�n"
  },
  "SRVOMNIBOPI01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.58",
    "ambiente": "Producci�n"
  },
  "SRVPROBATCH01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.35",
    "ambiente": "Producci�n"
  },
  "SRVPROCAN04P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.215.68",
    "ambiente": "Producci�n"
  },
  "SRVPSWSAFE02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVPWCSQLC3P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.186",
    "ambiente": "Producci�n"
  },
  "SRVSMARTRISK01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.231",
    "ambiente": "Producci�n"
  },
  "SRVSQL02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.92",
    "ambiente": "Producci�n"
  },
  "SRVSQLTIPAI01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.43",
    "ambiente": "Producci�n"
  },
  "SRVSTGSQLVB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.26",
    "ambiente": "Producci�n"
  },
  "SRVTDBACTAS01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.19",
    "ambiente": "Producci�n"
  },
  "SRVTRENDAPEX01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.212.50",
    "ambiente": "Producci�n"
  },
  "SRVTS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.61",
    "ambiente": "Producci�n"
  },
  "SRVTSCCM01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.211.68",
    "ambiente": "Producci�n"
  },
  "SRVTSVISA01P (Recupero) (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVWSUS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.10.57",
    "ambiente": "Producci�n"
  },
  "UNISYS-CLIENT-TOOLS (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "UNISYS-RT05 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.17.123",
    "ambiente": "Producci�n"
  },
  "UNISYS-RT-REL02 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.17.126",
    "ambiente": "Producci�n"
  },
  "VMCORP029 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n3",
    "ip": "172.30.11.106",
    "ambiente": "Producci�n"
  },
  "ABS9-SUP01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.17.40",
    "ambiente": "Producci�n"
  },
  "BERDEBMEDIADB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BERINSTBFF02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.89.96",
    "ambiente": "Producci�n"
  },
  "BERMCISIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.177",
    "ambiente": "Producci�n"
  },
  "BEROCEAPI03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.89.62",
    "ambiente": "Producci�n"
  },
  "BEROCEIS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.89.69",
    "ambiente": "Producci�n"
  },
  "BERONBOARDMS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "10.50.89.150",
    "ambiente": "Producci�n"
  },
  "BERPWRCRVDAS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.89.57",
    "ambiente": "Producci�n"
  },
  "BERVUFADB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.89.186",
    "ambiente": "Producci�n"
  },
  "BSCDEBMEDIADB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSCINSTWEB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "10.50.99.96",
    "ambiente": "Producci�n"
  },
  "BSCOCEAPI01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.99.60",
    "ambiente": "Producci�n"
  },
  "BSCOCEDB03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.99.83",
    "ambiente": "Producci�n"
  },
  "BSCOCEMS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.99.64",
    "ambiente": "Producci�n"
  },
  "BSCPRICINGWEBP (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.10.114",
    "ambiente": "Producci�n"
  },
  "BSCSONPRTG02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "10.50.99.73",
    "ambiente": "Producci�n"
  },
  "BSFBPRISMSRV01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFINSTBFF01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.84.95",
    "ambiente": "Producci�n"
  },
  "BSFMCESIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.200",
    "ambiente": "Producci�n"
  },
  "BSFMCISIS04P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.176",
    "ambiente": "Producci�n"
  },
  "BSFOCEDB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.84.82",
    "ambiente": "Producci�n"
  },
  "BSFOCEMS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.84.63",
    "ambiente": "Producci�n"
  },
  "BSFONBOARDMS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.84.184",
    "ambiente": "Producci�n"
  },
  "BSFREGFIRMSQL (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFVUFADB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.84.186",
    "ambiente": "Producci�n"
  },
  "BSJDEBMEDDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.194",
    "ambiente": "Producci�n"
  },
  "BSJINSTBFF02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.94.96",
    "ambiente": "Producci�n"
  },
  "BSJMCISIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.180",
    "ambiente": "Producci�n"
  },
  "BSJOCEDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.94.81",
    "ambiente": "Producci�n"
  },
  "BSJOCEMS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.94.63",
    "ambiente": "Producci�n"
  },
  "BSJONBOARDMS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.94.184",
    "ambiente": "Producci�n"
  },
  "BSJSBALSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.94.74",
    "ambiente": "Producci�n"
  },
  "BSJVUFADB03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.94.187",
    "ambiente": "Producci�n"
  },
  "CLOUDERAAPI05P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "10.50.212.118",
    "ambiente": "Producci�n"
  },
  "CLOUDERAIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.215.77",
    "ambiente": "Producci�n"
  },
  "CLOUDERAMS04P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.215.83",
    "ambiente": "Producci�n"
  },
  "CONECADINVP (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.15",
    "ambiente": "Producci�n"
  },
  "INVGCONEC02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.36",
    "ambiente": "Producci�n"
  },
  "PTCEDC03 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "PWCCI-DAS-01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.172",
    "ambiente": "Producci�n"
  },
  "SRVAPPFCI01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.13",
    "ambiente": "Producci�n"
  },
  "SRVBEYOND02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.10.116",
    "ambiente": "Producci�n"
  },
  "SRVCAMPADOBEP01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.215.182",
    "ambiente": "Producci�n"
  },
  "SRVCAPDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.89",
    "ambiente": "Producci�n"
  },
  "SRVCOMANAG01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.22",
    "ambiente": "Producci�n"
  },
  "SRVDBFCI01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.14",
    "ambiente": "Producci�n"
  },
  "SRVDCNBER01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVDMZ01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "10.50.8.55",
    "ambiente": "Producci�n"
  },
  "SRVENGWABSC01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.10.83",
    "ambiente": "Producci�n"
  },
  "SRVEXGPSA04P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.118.71",
    "ambiente": "Producci�n"
  },
  "SRVFSCORP01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.31",
    "ambiente": "Producci�n"
  },
  "SRVGENVCARD01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "10.50.212.50",
    "ambiente": "Producci�n"
  },
  "SRVHELIX01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.8",
    "ambiente": "Producci�n"
  },
  "SRVJIRA02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "10.50.8.27",
    "ambiente": "Producci�n"
  },
  "SRVMONAPP01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.10.13",
    "ambiente": "Producci�n"
  },
  "SRVNOCSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.10.81",
    "ambiente": "Producci�n"
  },
  "SRVOMNIPRTG01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.111",
    "ambiente": "Producci�n"
  },
  "SRVPROBCORP01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.10.50",
    "ambiente": "Producci�n"
  },
  "SRVPROCAN05P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.215.105",
    "ambiente": "Producci�n"
  },
  "SRVPVTDBA01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.10.171",
    "ambiente": "Producci�n"
  },
  "SRVPWCSQLCID (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVSNIPE01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.10.170",
    "ambiente": "Producci�n"
  },
  "SRVSQL03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.93",
    "ambiente": "Producci�n"
  },
  "SRVSQLTYS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.10.193",
    "ambiente": "Producci�n"
  },
  "SRVSTGSQLVB1P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.10.31",
    "ambiente": "Producci�n"
  },
  "SRVTMERCAPDB01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.16.19",
    "ambiente": "Producci�n"
  },
  "SRVTRENDDSM01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.76",
    "ambiente": "Producci�n"
  },
  "SRVTS04P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.7",
    "ambiente": "Producci�n"
  },
  "SRVTSCOM01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.10.17",
    "ambiente": "Producci�n"
  },
  "SRVTSVM01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.212.11",
    "ambiente": "Producci�n"
  },
  "SRVXCOM01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "10.50.8.21",
    "ambiente": "Producci�n"
  },
  "UNISYS-RT01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.17.119",
    "ambiente": "Producci�n"
  },
  "UNISYS-RT-QA01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.17.210",
    "ambiente": "Producci�n"
  },
  "UNISYS-SUPP01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": "172.30.17.163",
    "ambiente": "Producci�n"
  },
  "VMCORP038 (AM) (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "ABS9-SUP02 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.17.39",
    "ambiente": "Producci�n"
  },
  "BERDEBMEDIAPP01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BERINSTWEB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "10.50.89.95",
    "ambiente": "Producci�n"
  },
  "BERMCISIS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.178",
    "ambiente": "Producci�n"
  },
  "BEROCEDB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.89.81",
    "ambiente": "Producci�n"
  },
  "BEROCEMS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.89.63",
    "ambiente": "Producci�n"
  },
  "BERONBOARDMS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.89.184",
    "ambiente": "Producci�n"
  },
  "BERSBALSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.89.74",
    "ambiente": "Producci�n"
  },
  "BERVUFADB03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.89.187",
    "ambiente": "Producci�n"
  },
  "BSCFDSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.99.246",
    "ambiente": "Producci�n"
  },
  "BSCMCESIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.206",
    "ambiente": "Producci�n"
  },
  "BSCOCEAPI02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.99.61",
    "ambiente": "Producci�n"
  },
  "BSCOCEIS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.99.67",
    "ambiente": "Producci�n"
  },
  "BSCOCEMS03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.99.65",
    "ambiente": "Producci�n"
  },
  "BSCPWRCRVDA01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.99.58",
    "ambiente": "Producci�n"
  },
  "BSCVUFADB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.99.185",
    "ambiente": "Producci�n"
  },
  "BSFDEBMEDAPP01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "10.50.212.82",
    "ambiente": "Producci�n"
  },
  "BSFINSTBFF02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.84.96",
    "ambiente": "Producci�n"
  },
  "BSFMCESIS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.201",
    "ambiente": "Producci�n"
  },
  "BSFOCEAPI01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.84.60",
    "ambiente": "Producci�n"
  },
  "BSFOCEDB03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.84.83",
    "ambiente": "Producci�n"
  },
  "BSFOCEMS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.84.64",
    "ambiente": "Producci�n"
  },
  "BSFPWRCRVDA01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.84.58",
    "ambiente": "Producci�n"
  },
  "BSFSBALSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.84.74",
    "ambiente": "Producci�n"
  },
  "BSFVUFADB03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.84.187",
    "ambiente": "Producci�n"
  },
  "BSJDEBMEDIAP01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSJINSTWEB01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "10.50.94.95",
    "ambiente": "Producci�n"
  },
  "BSJMCISIS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.181",
    "ambiente": "Producci�n"
  },
  "BSJOCEDB02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.94.82",
    "ambiente": "Producci�n"
  },
  "BSJOCEMS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.94.64",
    "ambiente": "Producci�n"
  },
  "BSJPRICINGWEBP (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.10.98",
    "ambiente": "Producci�n"
  },
  "BSJSONPRTG01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.94.73",
    "ambiente": "Producci�n"
  },
  "CLOUDERAAPI01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "10.50.212.81",
    "ambiente": "Producci�n"
  },
  "CLOUDERAAPI06P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "10.50.212.119",
    "ambiente": "Producci�n"
  },
  "CLOUDERAIS02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.215.81",
    "ambiente": "Producci�n"
  },
  "CLOUDERAMS05P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.215.84",
    "ambiente": "Producci�n"
  },
  "edh-POC-BI-SRV01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "PAI-BLACKLIST (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "PTCEDC04 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "PWCCI-SDS-01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.171",
    "ambiente": "Producci�n"
  },
  "SIOPELBSC_RST (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVBSJDC01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVCAMPADOBEP02 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.215.183",
    "ambiente": "Producci�n"
  },
  "SRVCCTVGP01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVCOMBACK01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.23",
    "ambiente": "Producci�n"
  },
  "SRVEAE03P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.17.196",
    "ambiente": "Producci�n"
  },
  "SRVENGWABSF01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.10.66",
    "ambiente": "Producci�n"
  },
  "SRVEXSR01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "10.50.212.40",
    "ambiente": "Producci�n"
  },
  "SRVFSCORP02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.32",
    "ambiente": "Producci�n"
  },
  "SRVGOADMZHA01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "10.50.212.101",
    "ambiente": "Producci�n"
  },
  "SRVINTEG01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.84.71",
    "ambiente": "Producci�n"
  },
  "SRVJMETERT01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.220",
    "ambiente": "Producci�n"
  },
  "SRVMOODLSQL01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.114",
    "ambiente": "Producci�n"
  },
  "SRVNSCACHE01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "10.50.8.30",
    "ambiente": "Producci�n"
  },
  "SRVOMNIPRTG02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.112",
    "ambiente": "Producci�n"
  },
  "SRVPROCAN01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.215.70",
    "ambiente": "Producci�n"
  },
  "SRVPROCAN06P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.215.106",
    "ambiente": "Producci�n"
  },
  "SRVPWCESQLC1P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.208",
    "ambiente": "Producci�n"
  },
  "SRVPWRCRVDAS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.105",
    "ambiente": "Producci�n"
  },
  "SRVSNMPC01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.10.109",
    "ambiente": "Producci�n"
  },
  "SRVSQLCITAS01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.10.251",
    "ambiente": "Producci�n"
  },
  "SRVSQLTYS02P_restored (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "SRVTABLEAU01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.10.86",
    "ambiente": "Producci�n"
  },
  "SRVTMERCAPP01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.16.17",
    "ambiente": "Producci�n"
  },
  "SRVTRENDDSM02P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.10.24",
    "ambiente": "Producci�n"
  },
  "SRVTS05P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.212.37",
    "ambiente": "Producci�n"
  },
  "SRVTSGDD01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.10.104",
    "ambiente": "Producci�n"
  },
  "SRVTSWET01P (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.10.194",
    "ambiente": "Producci�n"
  },
  "TFS-UNISYS (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.17.152",
    "ambiente": "Producci�n"
  },
  "UNISYS-RT02 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.17.120",
    "ambiente": "Producci�n"
  },
  "UNISYS-RT-QA02 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.17.211",
    "ambiente": "Producci�n"
  },
  "UNISYS-SUPP02 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Producci�n5",
    "ip": "172.30.17.128",
    "ambiente": "Producci�n"
  },
  "CTRWET01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VEEAMPRXCL11 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.41.29",
    "ambiente": "Producci�n"
  },
  "VEEAMPRXCL21 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.13.164",
    "ambiente": "Producci�n"
  },
  "VEEAMPRXGCVE02 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VEEAMPRXGCVE05 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-BM-02C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.41.220",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD05-01C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.41.12",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD05-04C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.41.32",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD-07C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.41.161",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD3-02C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.41.3",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD3-05C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.41.69",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD3-08C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.13.85",
    "ambiente": "Producci�n"
  },
  "VPRX-CTRL-02C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.13.140",
    "ambiente": "Producci�n"
  },
  "VPRX-HBE-02C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.41.58",
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-01C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.41.47",
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-04C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.13.214",
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-05T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-07C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.13.217",
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-09T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-12T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-15T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-18T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-PROD02-01C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.13.64",
    "ambiente": "Producci�n"
  },
  "VPRX-PROD02-04C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.13.16",
    "ambiente": "Producci�n"
  },
  "VPRX-PROD02-07C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.13.219",
    "ambiente": "Producci�n"
  },
  "VPRX-PROD02-10C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": "10.50.13.19",
    "ambiente": "Producci�n"
  },
  "VPRX-PROD-04C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-TESTP1-03C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-TESTP1-06C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "CTRWET02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VEEAMPRXCL17 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.41.45",
    "ambiente": "Producci�n"
  },
  "VEEAMPRXCL23 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.41.222",
    "ambiente": "Producci�n"
  },
  "VEEAMPRXGCVE03 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VMware Backup Proxy (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-BM-03C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.41.122",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD05-02C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.41.13",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD05-05C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.12.43",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD-08C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.41.157",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD3-03C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.41.36",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD3-06C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.13.14",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD3-09C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.41.66",
    "ambiente": "Producci�n"
  },
  "VPRX-CTRL-03C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.41.110",
    "ambiente": "Producci�n"
  },
  "VPRX-HBE-03C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.13.57",
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-03C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.13.212",
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-04T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-06C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.41.37",
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-07T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-10T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-13T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-16T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-19T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-PROD02-02C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.42.65",
    "ambiente": "Producci�n"
  },
  "VPRX-PROD02-05C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.42.17",
    "ambiente": "Producci�n"
  },
  "VPRX-PROD02-08C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": "10.50.13.220",
    "ambiente": "Producci�n"
  },
  "VPRX-PROD-02C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-PROD-05C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-TESTP1-04C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-TESTP1-07C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VEEAMPRXAWSG01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VEEAMPRXCL19 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.41.46",
    "ambiente": "Producci�n"
  },
  "VEEAMPRXGCVE01 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VEEAMPRXGCVE04 (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-BM-01C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.13.226",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD-01C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.13.50",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD05-03C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.41.14",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD-06C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.41.153",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD3-01C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.41.2",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD3-04C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.41.128",
    "ambiente": "Producci�n"
  },
  "VPRX-CLD3-07C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.41.83",
    "ambiente": "Producci�n"
  },
  "VPRX-CTRL-01C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.13.139",
    "ambiente": "Producci�n"
  },
  "VPRX-HBE-01C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.13.53",
    "ambiente": "Producci�n"
  },
  "VPRX-HBE-04C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.13.15",
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-02C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.41.112",
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-03T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-05C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.13.215",
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-06T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-08T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-11T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-14T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-HBI-17T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-PROD-01C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-PROD02-03C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.13.75",
    "ambiente": "Producci�n"
  },
  "VPRX-PROD02-06C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.13.218",
    "ambiente": "Producci�n"
  },
  "VPRX-PROD02-09C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": "10.50.13.221",
    "ambiente": "Producci�n"
  },
  "VPRX-PROD-03C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-TESTP1-02C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "VPRX-TESTP1-05C (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Proxy3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "AONOCEDB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.130",
    "ambiente": "Test"
  },
  "BERCBANKIIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "10.50.87.161",
    "ambiente": "Test"
  },
  "BERDEBMEDIAPP01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": null,
    "ambiente": "Test"
  },
  "BERINSTWEB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "10.50.87.95",
    "ambiente": "Test"
  },
  "BEROCEAPI01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.87.70",
    "ambiente": "Test"
  },
  "BEROMNIPB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.85.81",
    "ambiente": "Test"
  },
  "BERPREX01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.16.160",
    "ambiente": "Test"
  },
  "BERPWRCRVDA01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.87.69",
    "ambiente": "Test"
  },
  "BERVUFADB02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.87.186",
    "ambiente": "Test"
  },
  "BSCFDSQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.97.122",
    "ambiente": "Test"
  },
  "BSCINSTWEB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "10.50.97.95",
    "ambiente": "Test"
  },
  "BSCMCESIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.221",
    "ambiente": "Test"
  },
  "BSCOCEAPI01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.97.70",
    "ambiente": "Test"
  },
  "BSCOMNIWS02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.97.81",
    "ambiente": "Test"
  },
  "BSCSBALSQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.97.74",
    "ambiente": "Test"
  },
  "BSCSONPRTG01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.97.73",
    "ambiente": "Test"
  },
  "BSCVUFADB02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.97.186",
    "ambiente": "Test"
  },
  "BSFFDSQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.82.122",
    "ambiente": "Test"
  },
  "BSFMCESIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.218",
    "ambiente": "Test"
  },
  "BSFOCEAPI01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.82.70",
    "ambiente": "Test"
  },
  "BSFOCEIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.82.72",
    "ambiente": "Test"
  },
  "BSFONBOARDMS02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.82.181",
    "ambiente": "Test"
  },
  "BSFREGFIRMSQLT (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": null,
    "ambiente": "Test"
  },
  "BSFSONPRTG02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "10.50.82.73",
    "ambiente": "Test"
  },
  "BSJDEBMEDAPP01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "10.50.211.50",
    "ambiente": "Test"
  },
  "BSJFDSQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.92.122",
    "ambiente": "Test"
  },
  "BSJGCONTAWEB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.92.187",
    "ambiente": "Test"
  },
  "BSJOCEMS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.92.71",
    "ambiente": "Test"
  },
  "BSJONBOARDMS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "10.50.92.140",
    "ambiente": "Test"
  },
  "BSJPWRCRVDA01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.92.69",
    "ambiente": "Test"
  },
  "BSJSONPRTG01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.92.73",
    "ambiente": "Test"
  },
  "BSJSONPRTG02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "10.50.92.73",
    "ambiente": "Test"
  },
  "BSJVUFADB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.92.185",
    "ambiente": "Test"
  },
  "SRVAPPFCI01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.13",
    "ambiente": "Test"
  },
  "SRVDEPSQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.145",
    "ambiente": "Test"
  },
  "SRVEFLOWTSQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.90",
    "ambiente": "Test"
  },
  "SRVFDAPIDIC01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.122",
    "ambiente": "Test"
  },
  "SRVINVAM02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.101",
    "ambiente": "Test"
  },
  "SRVJIRA02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.16.50",
    "ambiente": "Test"
  },
  "SRVPACOREIIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.160",
    "ambiente": "Test"
  },
  "SRVPWCDASCET (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.215",
    "ambiente": "Test"
  },
  "SRVPWCSQLCIT (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.212",
    "ambiente": "Test"
  },
  "SRVSELENI01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.211.50",
    "ambiente": "Test"
  },
  "SRVSQL2019T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing1",
    "ip": "172.30.16.84",
    "ambiente": "Test"
  },
  "BERABSDEV-W2019S01T- Octavio Palomino (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": null,
    "ambiente": "Test"
  },
  "BERENROLLBFF01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.87.97",
    "ambiente": "Test"
  },
  "BERENROLLWEB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "10.50.87.97",
    "ambiente": "Test"
  },
  "BERINSTWEB02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "10.50.87.98",
    "ambiente": "Test"
  },
  "BERJENKCON01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.87.191",
    "ambiente": "Test"
  },
  "BEROMNIFS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.87.85",
    "ambiente": "Test"
  },
  "BEROMNIWS02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.87.81",
    "ambiente": "Test"
  },
  "BERPRICINGWEBT (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.211.28",
    "ambiente": "Test"
  },
  "BERPWRCRVDAS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.87.68",
    "ambiente": "Test"
  },
  "BSCABSRUNUAT (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": null,
    "ambiente": "Test"
  },
  "BSCGCONTASQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.97.184",
    "ambiente": "Test"
  },
  "BSCINSTWEB02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "10.50.97.98",
    "ambiente": "Test"
  },
  "BSCMCISIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.211.173",
    "ambiente": "Test"
  },
  "BSCOCEIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.97.72",
    "ambiente": "Test"
  },
  "BSCONBOARDMS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "10.50.97.140",
    "ambiente": "Test"
  },
  "BSCSONPRTG02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "10.50.97.73",
    "ambiente": "Test"
  },
  "BSFDEBMEDIADB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": null,
    "ambiente": "Test"
  },
  "BSFDEBMEDIAPP01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": null,
    "ambiente": "Test"
  },
  "BSFINSTBFF01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.82.95",
    "ambiente": "Test"
  },
  "BSFOCEMS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.82.71",
    "ambiente": "Test"
  },
  "BSFOMNISQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.82.90",
    "ambiente": "Test"
  },
  "BSFPWRCRVDAS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.82.68",
    "ambiente": "Test"
  },
  "BSFSBALSQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.82.74",
    "ambiente": "Test"
  },
  "BSJABSRUNUAT (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": null,
    "ambiente": "Test"
  },
  "BSJINSTBFF01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.92.95",
    "ambiente": "Test"
  },
  "BSJINSTWEB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "10.50.92.95",
    "ambiente": "Test"
  },
  "BSJINSTWEB02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "10.50.92.98",
    "ambiente": "Test"
  },
  "BSJMCESIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.211.220",
    "ambiente": "Test"
  },
  "BSJOMNIFS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.92.85",
    "ambiente": "Test"
  },
  "BSJONBOARDMS02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.92.181",
    "ambiente": "Test"
  },
  "BSJPWRCRVDAS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.92.68",
    "ambiente": "Test"
  },
  "CLOUDERAAPI01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "10.50.211.81",
    "ambiente": "Test"
  },
  "CLOUDERAMS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.211.78",
    "ambiente": "Test"
  },
  "SRVCOMANAG01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.211.45",
    "ambiente": "Test"
  },
  "SRVCOMFRON01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "10.50.211.140",
    "ambiente": "Test"
  },
  "SRVDBACADGDD01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.212.149",
    "ambiente": "Test"
  },
  "SRVDOCDIN01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.212.189",
    "ambiente": "Test"
  },
  "SRVEAE01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.17.91",
    "ambiente": "Test"
  },
  "SRVINTEG02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.82.82",
    "ambiente": "Test"
  },
  "SRVINVSD02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.211.100",
    "ambiente": "Test"
  },
  "SRVMERCAPDB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.16.70",
    "ambiente": "Test"
  },
  "SRVPACORESQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.211.161",
    "ambiente": "Test"
  },
  "SRVPWCDASCIT (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.211.211",
    "ambiente": "Test"
  },
  "SRVPWCSYSCIT (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.211.213",
    "ambiente": "Test"
  },
  "SRVPWRCRVDAS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.211.105",
    "ambiente": "Test"
  },
  "SRVSELENI02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.211.55",
    "ambiente": "Test"
  },
  "SRVSQLTYS03T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing2",
    "ip": "172.30.16.181",
    "ambiente": "Test"
  },
  "BERABSRUNUAT (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": null,
    "ambiente": "Test"
  },
  "BERFDSQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.87.122",
    "ambiente": "Test"
  },
  "BERGCONTASQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.87.184",
    "ambiente": "Test"
  },
  "BERJENKCON02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.87.192",
    "ambiente": "Test"
  },
  "BERMCESIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.219",
    "ambiente": "Test"
  },
  "BEROCEIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.87.72",
    "ambiente": "Test"
  },
  "BERONBOARDDB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.87.183",
    "ambiente": "Test"
  },
  "BERONBOARDMS02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.87.181",
    "ambiente": "Test"
  },
  "BERSBALSQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.87.74",
    "ambiente": "Test"
  },
  "BERSONPRTG01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.87.73",
    "ambiente": "Test"
  },
  "BSCDEBMEDIADB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": null,
    "ambiente": "Test"
  },
  "BSCGCONTAWEB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.97.187",
    "ambiente": "Test"
  },
  "BSCOCEMS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.97.71",
    "ambiente": "Test"
  },
  "BSCOMNIFS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.97.85",
    "ambiente": "Test"
  },
  "BSCONBOARDDB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.97.183",
    "ambiente": "Test"
  },
  "BSCONBOARDMS02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.97.181",
    "ambiente": "Test"
  },
  "BSCPWRCRVDA01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.97.69",
    "ambiente": "Test"
  },
  "BSFENROLLBFF01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.82.97",
    "ambiente": "Test"
  },
  "BSFGCONTASQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.82.184",
    "ambiente": "Test"
  },
  "BSFINSTWEB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "10.50.82.95",
    "ambiente": "Test"
  },
  "BSFMCISIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.170",
    "ambiente": "Test"
  },
  "BSFONBOARDDB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.82.183",
    "ambiente": "Test"
  },
  "BSFPWRCRVDA01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.82.69",
    "ambiente": "Test"
  },
  "BSFSONPRTG01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.82.73",
    "ambiente": "Test"
  },
  "BSFVUFADB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.82.185",
    "ambiente": "Test"
  },
  "BSJAPIWSO2T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.92.188",
    "ambiente": "Test"
  },
  "BSJMCISIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.172",
    "ambiente": "Test"
  },
  "BSJOCEAPI01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.92.70",
    "ambiente": "Test"
  },
  "BSJOMNIRATL02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.92.88",
    "ambiente": "Test"
  },
  "BSJOMNIWS02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.92.81",
    "ambiente": "Test"
  },
  "BSJONBOARDMS03T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.92.76",
    "ambiente": "Test"
  },
  "BSJSIBLINKUAT (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": null,
    "ambiente": "Test"
  },
  "CLOUDERADB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.79",
    "ambiente": "Test"
  },
  "PTCDMZ01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "10.50.211.90",
    "ambiente": "Test"
  },
  "PWCCE-DAS-01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.216",
    "ambiente": "Test"
  },
  "SRVCOMBACK01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.140",
    "ambiente": "Test"
  },
  "SRVDB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.210.85",
    "ambiente": "Test"
  },
  "SRVEFLOWTWEB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "10.50.8.63",
    "ambiente": "Test"
  },
  "SRVHELIX01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.8",
    "ambiente": "Test"
  },
  "SRVIIS02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.16.180",
    "ambiente": "Test"
  },
  "SRVNUCLEUS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "10.50.211.42",
    "ambiente": "Test"
  },
  "SRVOCRBAL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.36",
    "ambiente": "Test"
  },
  "SRVOMNITOSCA01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.57",
    "ambiente": "Test"
  },
  "SRVPWCESQLCI2T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.222",
    "ambiente": "Test"
  },
  "SRVPWCSDSCI2T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": null,
    "ambiente": "Test"
  },
  "SRVSQLCITAS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.193",
    "ambiente": "Test"
  },
  "SRVSQLTYS04T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing3",
    "ip": "172.30.211.40",
    "ambiente": "Test"
  },
  "BERABSTFS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": null,
    "ambiente": "Test"
  },
  "BERAPPRAT01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.233.30",
    "ambiente": "Test"
  },
  "BERGCONTAWEB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.87.187",
    "ambiente": "Test"
  },
  "BERINSTBFF01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.87.95",
    "ambiente": "Test"
  },
  "BERMCISIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.211.171",
    "ambiente": "Test"
  },
  "BEROCEMS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.87.71",
    "ambiente": "Test"
  },
  "BERONBOARDMS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "10.50.87.140",
    "ambiente": "Test"
  },
  "BERSONPRTG02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "10.50.87.73",
    "ambiente": "Test"
  },
  "BERVUFADB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.87.185",
    "ambiente": "Test"
  },
  "BSCCBANKIIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "10.50.97.161",
    "ambiente": "Test"
  },
  "BSCDEBMEDIAPP01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": null,
    "ambiente": "Test"
  },
  "BSCINSTBFF01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.97.95",
    "ambiente": "Test"
  },
  "BSCOMNIRATL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.97.88",
    "ambiente": "Test"
  },
  "BSCOMNISQL02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.97.91",
    "ambiente": "Test"
  },
  "BSCPWRCRVDAS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.97.68",
    "ambiente": "Test"
  },
  "BSCVUFADB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.97.185",
    "ambiente": "Test"
  },
  "BSFCBANKIIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "10.50.82.161",
    "ambiente": "Test"
  },
  "BSFENROLLWEB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "10.50.82.97",
    "ambiente": "Test"
  },
  "BSFGCONTAWEB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.82.187",
    "ambiente": "Test"
  },
  "BSFINSTWEB02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "10.50.82.98",
    "ambiente": "Test"
  },
  "BSFOMNIFS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.82.85",
    "ambiente": "Test"
  },
  "BSFONBOARDMS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "10.50.82.140",
    "ambiente": "Test"
  },
  "BSFPWRCRVDA02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.82.67",
    "ambiente": "Test"
  },
  "BSFVUFADB02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.82.186",
    "ambiente": "Test"
  },
  "BSJCBANKIIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "10.50.92.161",
    "ambiente": "Test"
  },
  "BSJDEBMEDIADB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": null,
    "ambiente": "Test"
  },
  "BSJGCONTASQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.92.184",
    "ambiente": "Test"
  },
  "BSJOCEIS01T_03_12_restored (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": null,
    "ambiente": "Test"
  },
  "BSJOMNISQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.92.90",
    "ambiente": "Test"
  },
  "BSJOMNISQL02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.92.91",
    "ambiente": "Test"
  },
  "BSJONBOARDDB01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.92.183",
    "ambiente": "Test"
  },
  "BSJSBALSQL01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.92.74",
    "ambiente": "Test"
  },
  "CLOUDERAIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.211.77",
    "ambiente": "Test"
  },
  "GPSECMODO01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.82.203",
    "ambiente": "Test"
  },
  "PWCCI-DAS-01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.211.175",
    "ambiente": "Test"
  },
  "SRVDBFCI01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.211.14",
    "ambiente": "Test"
  },
  "SRVDEPIIS01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.211.135",
    "ambiente": "Test"
  },
  "SRVENGAGEWA01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.16.51",
    "ambiente": "Test"
  },
  "SRVENGWABSF01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.211.66",
    "ambiente": "Test"
  },
  "SRVINTEG01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.82.81",
    "ambiente": "Test"
  },
  "SRVMIGEKM01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.211.102",
    "ambiente": "Test"
  },
  "SRVOMNIBOPI01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.211.56",
    "ambiente": "Test"
  },
  "SRVPWCESQLCIT (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.211.223",
    "ambiente": "Test"
  },
  "SRVPWCSQLCI2T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.211.174",
    "ambiente": "Test"
  },
  "SRVPWCSYSCET (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.211.217",
    "ambiente": "Test"
  },
  "SRVSQLTYS02T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.16.193",
    "ambiente": "Test"
  },
  "SRVTSACADGDD01T (petersen.corp)": {
    "type": "Corpo",
    "grupo": "Testing4",
    "ip": "172.30.212.148",
    "ambiente": "Test"
  },
  "bersaservdc01 (bersaservicios.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.28.7.14",
    "ambiente": "Producci�n"
  },
  "SRV-005-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.29.5.17",
    "ambiente": "Producci�n"
  },
  "SRV-013-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.29.13.17",
    "ambiente": "Producci�n"
  },
  "SRV-021-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.29.21.17",
    "ambiente": "Producci�n"
  },
  "SRV-029-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.29.29.17",
    "ambiente": "Producci�n"
  },
  "SRV-038-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.29.38.17",
    "ambiente": "Producci�n"
  },
  "SRV-049-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.29.49.17",
    "ambiente": "Producci�n"
  },
  "SRV-062-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.29.62.17",
    "ambiente": "Producci�n"
  },
  "SRV-071-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.29.71.17",
    "ambiente": "Producci�n"
  },
  "SRV-084-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.29.84.17",
    "ambiente": "Producci�n"
  },
  "SRV-095-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.29.95.17",
    "ambiente": "Producci�n"
  },
  "SV-ROOTBER02 (root.nbersa)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo1",
    "ip": "172.28.16.160",
    "ambiente": "Producci�n"
  },
  "bersaservdc02 (bersaservicios.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.28.7.5",
    "ambiente": "Producci�n"
  },
  "SRV-006-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.29.6.17",
    "ambiente": "Producci�n"
  },
  "SRV-014-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.29.14.17",
    "ambiente": "Producci�n"
  },
  "SRV-022-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.29.22.17",
    "ambiente": "Producci�n"
  },
  "SRV-030-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.29.30.17",
    "ambiente": "Producci�n"
  },
  "SRV-040-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.29.40.17",
    "ambiente": "Producci�n"
  },
  "SRV-050-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.29.50.17",
    "ambiente": "Producci�n"
  },
  "SRV-063-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.29.63.17",
    "ambiente": "Producci�n"
  },
  "SRV-072-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.29.72.17",
    "ambiente": "Producci�n"
  },
  "SRV-085-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.29.85.17",
    "ambiente": "Producci�n"
  },
  "SRV-197-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.29.197.17",
    "ambiente": "Producci�n"
  },
  "VM-SRVDC01 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo2",
    "ip": "172.28.16.11",
    "ambiente": "Producci�n"
  },
  "ER-SERVICIOS (erservicios.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.28.7.130",
    "ambiente": "Producci�n"
  },
  "SRV-007-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.29.7.17",
    "ambiente": "Producci�n"
  },
  "SRV-015-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.29.15.17",
    "ambiente": "Producci�n"
  },
  "SRV-023-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.29.23.17",
    "ambiente": "Producci�n"
  },
  "SRV-031-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.29.31.17",
    "ambiente": "Producci�n"
  },
  "SRV-041-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.29.41.17",
    "ambiente": "Producci�n"
  },
  "SRV-051-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.29.51.17",
    "ambiente": "Producci�n"
  },
  "SRV-064-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.29.64.17",
    "ambiente": "Producci�n"
  },
  "SRV-073-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.29.73.17",
    "ambiente": "Producci�n"
  },
  "SRV-086-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.29.86.17",
    "ambiente": "Producci�n"
  },
  "srv-203-dc (bersatest.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.28.104.33",
    "ambiente": "Producci�n"
  },
  "VM-SRVDC02 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo3",
    "ip": "172.28.16.12",
    "ambiente": "Producci�n"
  },
  "ERSERVICIOSDC03 (erservicios.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo4",
    "ip": "172.28.7.137",
    "ambiente": "Producci�n"
  },
  "SRV-008-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo4",
    "ip": "172.29.8.17",
    "ambiente": "Producci�n"
  },
  "SRV-016-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo4",
    "ip": "172.29.16.17",
    "ambiente": "Producci�n"
  },
  "SRV-024-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo4",
    "ip": "172.29.24.17",
    "ambiente": "Producci�n"
  },
  "SRV-032-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo4",
    "ip": "172.29.32.17",
    "ambiente": "Producci�n"
  },
  "SRV-042-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo4",
    "ip": "172.29.42.17",
    "ambiente": "Producci�n"
  },
  "SRV-052-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo4",
    "ip": "172.29.52.17",
    "ambiente": "Producci�n"
  },
  "SRV-065-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo4",
    "ip": "172.29.65.17",
    "ambiente": "Producci�n"
  },
  "SRV-078-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo4",
    "ip": "172.29.78.17",
    "ambiente": "Producci�n"
  },
  "SRV-087-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo4",
    "ip": "172.29.87.17",
    "ambiente": "Producci�n"
  },
  "SRV-DC001 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo4",
    "ip": "150.5.200.11",
    "ambiente": "Producci�n"
  },
  "SRV-001-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo5",
    "ip": "172.29.1.17",
    "ambiente": "Producci�n"
  },
  "SRV-009-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo5",
    "ip": "172.29.9.17",
    "ambiente": "Producci�n"
  },
  "SRV-017-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo5",
    "ip": "172.29.17.17",
    "ambiente": "Producci�n"
  },
  "SRV-025-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo5",
    "ip": "172.29.25.17",
    "ambiente": "Producci�n"
  },
  "SRV-033-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo5",
    "ip": "172.29.33.17",
    "ambiente": "Producci�n"
  },
  "SRV-044-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo5",
    "ip": "172.29.44.17",
    "ambiente": "Producci�n"
  },
  "SRV-053-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo5",
    "ip": "172.29.53.17",
    "ambiente": "Producci�n"
  },
  "SRV-066-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo5",
    "ip": "172.29.66.17",
    "ambiente": "Producci�n"
  },
  "SRV-079-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo5",
    "ip": "172.29.79.17",
    "ambiente": "Producci�n"
  },
  "SRV-091-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo5",
    "ip": "172.29.91.17",
    "ambiente": "Producci�n"
  },
  "SRV-DC002 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo5",
    "ip": "150.5.200.12",
    "ambiente": "Producci�n"
  },
  "SRV-002-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo6",
    "ip": "172.29.2.17",
    "ambiente": "Producci�n"
  },
  "SRV-010-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo6",
    "ip": "172.29.10.17",
    "ambiente": "Producci�n"
  },
  "SRV-018-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo6",
    "ip": "172.29.18.17",
    "ambiente": "Producci�n"
  },
  "SRV-026-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo6",
    "ip": "172.29.26.17",
    "ambiente": "Producci�n"
  },
  "SRV-034-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo6",
    "ip": "172.29.34.17",
    "ambiente": "Producci�n"
  },
  "SRV-046-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo6",
    "ip": "172.29.46.17",
    "ambiente": "Producci�n"
  },
  "SRV-055-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo6",
    "ip": "172.29.55.17",
    "ambiente": "Producci�n"
  },
  "SRV-068-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo6",
    "ip": "172.29.68.17",
    "ambiente": "Producci�n"
  },
  "SRV-080-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo6",
    "ip": "172.29.80.17",
    "ambiente": "Producci�n"
  },
  "SRV-092-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo6",
    "ip": "172.29.92.17",
    "ambiente": "Producci�n"
  },
  "SRV-DCCERRITO (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo6",
    "ip": "172.30.10.199",
    "ambiente": "Producci�n"
  },
  "SRV-003-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo7",
    "ip": "172.29.3.17",
    "ambiente": "Producci�n"
  },
  "SRV-011-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo7",
    "ip": "172.29.11.17",
    "ambiente": "Producci�n"
  },
  "SRV-019-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo7",
    "ip": "172.29.19.17",
    "ambiente": "Producci�n"
  },
  "SRV-027-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo7",
    "ip": "172.29.27.17",
    "ambiente": "Producci�n"
  },
  "SRV-035-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo7",
    "ip": "172.29.35.17",
    "ambiente": "Producci�n"
  },
  "SRV-047-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo7",
    "ip": "172.29.47.17",
    "ambiente": "Producci�n"
  },
  "SRV-057-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo7",
    "ip": "172.29.57.17",
    "ambiente": "Producci�n"
  },
  "SRV-069-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo7",
    "ip": "172.29.69.17",
    "ambiente": "Producci�n"
  },
  "SRV-081-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo7",
    "ip": "172.29.81.17",
    "ambiente": "Producci�n"
  },
  "SRV-093-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo7",
    "ip": "172.29.93.17",
    "ambiente": "Producci�n"
  },
  "SV-DCCENTRAL01 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo7",
    "ip": "172.28.0.89",
    "ambiente": "Producci�n"
  },
  "SRV-004-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo8",
    "ip": "172.29.4.17",
    "ambiente": "Producci�n"
  },
  "SRV-012-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo8",
    "ip": "172.29.12.17",
    "ambiente": "Producci�n"
  },
  "SRV-020-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo8",
    "ip": "172.29.20.17",
    "ambiente": "Producci�n"
  },
  "SRV-028-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo8",
    "ip": "172.29.28.17",
    "ambiente": "Producci�n"
  },
  "SRV-036-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo8",
    "ip": "172.29.36.17",
    "ambiente": "Producci�n"
  },
  "SRV-048-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo8",
    "ip": "172.29.48.17",
    "ambiente": "Producci�n"
  },
  "SRV-060-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo8",
    "ip": "172.29.60.17",
    "ambiente": "Producci�n"
  },
  "SRV-070-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo8",
    "ip": "172.29.70.17",
    "ambiente": "Producci�n"
  },
  "SRV-083-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo8",
    "ip": "172.29.83.17",
    "ambiente": "Producci�n"
  },
  "SRV-094-DC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo8",
    "ip": "172.29.94.17",
    "ambiente": "Producci�n"
  },
  "SV-ROOTBER01 (root.nbersa)": {
    "type": "Banco Entre Rios",
    "grupo": "DCGrupo8",
    "ip": "172.28.16.13",
    "ambiente": "Producci�n"
  },
  "ADINTAP-D (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Desarrollo1",
    "ip": "172.28.48.171",
    "ambiente": "Desarrollo"
  },
  "sv-adintarWS-D (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Desarrollo1",
    "ip": "172.28.48.155",
    "ambiente": "Desarrollo"
  },
  "SVENGAP-D (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Desarrollo1",
    "ip": "172.28.48.211",
    "ambiente": "Desarrollo"
  },
  "SVENGDB-DESA (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Desarrollo1",
    "ip": "172.28.48.202",
    "ambiente": "Desarrollo"
  },
  "sv-f2ku-desa-2 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Desarrollo1",
    "ip": "172.28.17.1",
    "ambiente": "Desarrollo"
  },
  "ABSDEVPROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.195",
    "ambiente": "Producci�n"
  },
  "ADINTARWS-BEE-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.201",
    "ambiente": "Producci�n"
  },
  "SRV.009-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-023-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-030-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-042-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-051-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-064-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-197-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "sv-apexOne-agent (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "sv-bejerman8-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.157",
    "ambiente": "Producci�n"
  },
  "SV-BKP-VEEAM-SUC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "sv-collector-p (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.58",
    "ambiente": "Producci�n"
  },
  "SVDEBMEDIABDP (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.209",
    "ambiente": "Producci�n"
  },
  "sv-echeqDB-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.190",
    "ambiente": "Producci�n"
  },
  "sv-engdb-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.0.73",
    "ambiente": "Producci�n"
  },
  "SV-EXC02 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "169.254.2.235",
    "ambiente": "Producci�n"
  },
  "SV-FIRMADB-PR (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.0.69",
    "ambiente": "Producci�n"
  },
  "SV-GOA-GW02 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.6.36",
    "ambiente": "Producci�n"
  },
  "SV-HELIX-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "sv-inventario-cb (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.186",
    "ambiente": "Producci�n"
  },
  "SV-LD-AP-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.164",
    "ambiente": "Producci�n"
  },
  "sv-mepbd-p (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.0.200",
    "ambiente": "Producci�n"
  },
  "sv-modoDMZ-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.6.15",
    "ambiente": "Producci�n"
  },
  "sv-npspai1 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-PAI-SERVER22 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.2.23",
    "ambiente": "Producci�n"
  },
  "sv-pivot-bersa (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.16.41",
    "ambiente": "Producci�n"
  },
  "SVPROXY-VEEAM2 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-RIOP (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.0.41",
    "ambiente": "Producci�n"
  },
  "SV-SFBSoaV3V4B (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "10.20.100.95",
    "ambiente": "Producci�n"
  },
  "SV-SOAV34B-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.0.136",
    "ambiente": "Producci�n"
  },
  "SV-SQL13-01-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-SQL8-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.172",
    "ambiente": "Producci�n"
  },
  "SV-STANDINDB-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.161",
    "ambiente": "Producci�n"
  },
  "SVSWIFTQA (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.251.99",
    "ambiente": "Producci�n"
  },
  "sv-veeamone-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.62",
    "ambiente": "Producci�n"
  },
  "sv-wamp-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.85",
    "ambiente": "Producci�n"
  },
  "sv-webServices-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.1.153",
    "ambiente": "Producci�n"
  },
  "SV-WSUS-CEN (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.0.190",
    "ambiente": "Producci�n"
  },
  "ws-proccoe-p (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "129.100.92.87",
    "ambiente": "Producci�n"
  },
  "sv-tfs-test2 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion1",
    "ip": "172.28.48.169",
    "ambiente": "Producci�n"
  },
  "ABSRUNDRS (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-001-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-013-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-024-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-031-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-044-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-055-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-065-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-073-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-ABSTFS9 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "sv-ApexOne-SERVER (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.0.64",
    "ambiente": "Producci�n"
  },
  "SV-BERAVISODB-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "sv-bpm-one (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.0.70",
    "ambiente": "Producci�n"
  },
  "SV-CONTROLWF-22 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.1.206",
    "ambiente": "Producci�n"
  },
  "SV-DepRMT2-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.6.47",
    "ambiente": "Producci�n"
  },
  "sv-eflow-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.1.18",
    "ambiente": "Producci�n"
  },
  "sv-esco-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.1.165",
    "ambiente": "Producci�n"
  },
  "SV-EXC03 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.0.100",
    "ambiente": "Producci�n"
  },
  "SV-FIRMA-GRA-PR (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-GOA-MFT01 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.1.55",
    "ambiente": "Producci�n"
  },
  "sv-HikVision-p (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.1.117",
    "ambiente": "Producci�n"
  },
  "sv-invgate-proxy (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-LDDB-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.0.226",
    "ambiente": "Producci�n"
  },
  "sv-mim-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.1.168",
    "ambiente": "Producci�n"
  },
  "SV-MONITOREO (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.1.197",
    "ambiente": "Producci�n"
  },
  "sv-npspai2 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-PassSafe1 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.0.185",
    "ambiente": "Producci�n"
  },
  "sv-printserver (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-PWS-01 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.0.218",
    "ambiente": "Producci�n"
  },
  "SV-ROOTBER01-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SVSIBANK(para  Interbanking TCP) (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.1.147",
    "ambiente": "Producci�n"
  },
  "SV-SOJCOELSA-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.1.94",
    "ambiente": "Producci�n"
  },
  "SV-SQL13-02-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-SQL9-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.0.40",
    "ambiente": "Producci�n"
  },
  "sv-stdinWEBP (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-TESINWEB-PR (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.1.106",
    "ambiente": "Producci�n"
  },
  "SV-VEEAM-SUC (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.0.137",
    "ambiente": "Producci�n"
  },
  "sv-web6-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.0.163",
    "ambiente": "Producci�n"
  },
  "svwebxprod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "sv-wsus-suc (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.0.77",
    "ambiente": "Producci�n"
  },
  "SVSWIFTPROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion2",
    "ip": "172.28.251.100",
    "ambiente": "Producci�n"
  },
  "ABSRUNPROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.196",
    "ambiente": "Producci�n"
  },
  "mercap-bd-t22 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.48.89",
    "ambiente": "Producci�n"
  },
  "SRV-002-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-014-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-026-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-034-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-046-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-062-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-066-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-080-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-093-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-DB2 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.202",
    "ambiente": "Producci�n"
  },
  "SV-ADINTARWS-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.86",
    "ambiente": "Producci�n"
  },
  "SVATEAPPR (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-BER-PIVOT (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-CCTV-STORAGE (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.173",
    "ambiente": "Producci�n"
  },
  "sv-Echeck-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.7.142",
    "ambiente": "Producci�n"
  },
  "SV-EKM-PR (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.184",
    "ambiente": "Producci�n"
  },
  "SV-Evo-Tran-C (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.251.107",
    "ambiente": "Producci�n"
  },
  "sv-Extcom7-Prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.154",
    "ambiente": "Producci�n"
  },
  "SV-FTPS-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.0.104",
    "ambiente": "Producci�n"
  },
  "SV-GOA-MFT02 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.56",
    "ambiente": "Producci�n"
  },
  "sv-iis-externo (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.6.46",
    "ambiente": "Producci�n"
  },
  "sv-invgate-proxy2 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "sv-lexdr-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.159",
    "ambiente": "Producci�n"
  },
  "sv-modoApi-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.0.102",
    "ambiente": "Producci�n"
  },
  "SV-MONITOREO-POOL (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.150",
    "ambiente": "Producci�n"
  },
  "SV-NTP (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.16.220",
    "ambiente": "Producci�n"
  },
  "SV-PassSafe2 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.0.186",
    "ambiente": "Producci�n"
  },
  "sv-probatch-p (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.0.143",
    "ambiente": "Producci�n"
  },
  "SV-PWS-02 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.0.219",
    "ambiente": "Producci�n"
  },
  "SV-ROOTBER02-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "sv-simgo-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.74",
    "ambiente": "Producci�n"
  },
  "SV-SONDAS-PRTG (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.0.34",
    "ambiente": "Producci�n"
  },
  "sv-sql6-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.90",
    "ambiente": "Producci�n"
  },
  "SV-SQL-Algeiba (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.59",
    "ambiente": "Producci�n"
  },
  "SVSWIFTCONT_restore (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "sv-uasapp-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.96",
    "ambiente": "Producci�n"
  },
  "sv-vinculados (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.48.76",
    "ambiente": "Producci�n"
  },
  "sv-web8-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.0.144",
    "ambiente": "Producci�n"
  },
  "SV-WF-DB-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.212",
    "ambiente": "Producci�n"
  },
  "SV-XCOM-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.16.49",
    "ambiente": "Producci�n"
  },
  "WhatsUpV21-DB (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.1.156",
    "ambiente": "Producci�n"
  },
  "SVSWIFTCONT (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion3",
    "ip": "172.28.251.101",
    "ambiente": "Producci�n"
  },
  "ADINTAP-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "Dimensional-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.198",
    "ambiente": "Producci�n"
  },
  "PROBATCHWEBP (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.12",
    "ambiente": "Producci�n"
  },
  "SRV-006-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-020-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-050-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-063-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-083-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SRV-094-DC-2022 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "sv-anywhere-gw (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.6.49",
    "ambiente": "Producci�n"
  },
  "SVATEDBPR (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-BESMART-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.110",
    "ambiente": "Producci�n"
  },
  "SV-CEDIPCOELSA-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.187",
    "ambiente": "Producci�n"
  },
  "SVDEBMEDIAAPP (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.210",
    "ambiente": "Producci�n"
  },
  "SV-Echeck-SA (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.7.15",
    "ambiente": "Producci�n"
  },
  "SVENGAPP (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-Evo-Tran-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.251.106",
    "ambiente": "Producci�n"
  },
  "SVFEDEOL22-PR (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-GOA-GW01 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.6.35",
    "ambiente": "Producci�n"
  },
  "SV-GRAFANA-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.199",
    "ambiente": "Producci�n"
  },
  "sv-invdb-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.66",
    "ambiente": "Producci�n"
  },
  "sv-inv-web (intelektron) (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.77",
    "ambiente": "Producci�n"
  },
  "sv-mae-pr16 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.0.66",
    "ambiente": "Producci�n"
  },
  "sv-mododb-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.0.103",
    "ambiente": "Producci�n"
  },
  "SV-NBERSAMAIL-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-OTRS-HIST (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.13",
    "ambiente": "Producci�n"
  },
  "SV-PGC-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.0.39",
    "ambiente": "Producci�n"
  },
  "SVPROXY-VEEAM1 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "SV-RELAYWL (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.0.35",
    "ambiente": "Producci�n"
  },
  "sv-servicios-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.0.42",
    "ambiente": "Producci�n"
  },
  "SV-SOAV34A-P (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.0.63",
    "ambiente": "Producci�n"
  },
  "sv-sql10-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.0.214",
    "ambiente": "Producci�n"
  },
  "sv-sql7-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.160",
    "ambiente": "Producci�n"
  },
  "sv-sqlsoc-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.0.191",
    "ambiente": "Producci�n"
  },
  "sv-uasdb-prod (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.95",
    "ambiente": "Producci�n"
  },
  "SV-VPROXY3-PR (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.0.187",
    "ambiente": "Producci�n"
  },
  "SV-WEB9-PROD (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.1.185",
    "ambiente": "Producci�n"
  },
  "sv-whatsup21-p (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.0.47",
    "ambiente": "Producci�n"
  },
  "TESINWEBP (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.6.56",
    "ambiente": "Producci�n"
  },
  "WhatsUpV21-Poller (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Produccion4",
    "ip": "172.28.0.147",
    "ambiente": "Producci�n"
  },
  "absclontest (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.48.206",
    "ambiente": "Testing"
  },
  "ADINTDB-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.48.176",
    "ambiente": "Testing"
  },
  "RITEST-TEST (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.48.192",
    "ambiente": "Testing"
  },
  "SV-ATE-AP-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.48.110",
    "ambiente": "Testing"
  },
  "SV-ATE-DB-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.48.212",
    "ambiente": "Testing"
  },
  "SVENGAP-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.48.210",
    "ambiente": "Testing"
  },
  "sv-esco-test (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.48.63",
    "ambiente": "Testing"
  },
  "SV-F2KU-TEST-1 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.104.13",
    "ambiente": "Testing"
  },
  "SV-HELIX-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "-",
    "ambiente": "Testing"
  },
  "sv-probatch16-t (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.48.48",
    "ambiente": "Testing"
  },
  "SV-SFBSoaV3-V4-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "10.20.100.93",
    "ambiente": "Testing"
  },
  "sv-siopel-test (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "-",
    "ambiente": "Testing"
  },
  "sv-sisdpt-test (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.48.146",
    "ambiente": "Testing"
  },
  "sv-smartlocks-test (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.48.123",
    "ambiente": "Testing"
  },
  "sv-test-w2016 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing1",
    "ip": "172.28.48.90",
    "ambiente": "Testing"
  },
  "ABSRUNTEST_replica (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "-",
    "ambiente": "Testing"
  },
  "ADINTAP-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "172.28.48.181",
    "ambiente": "Testing"
  },
  "PROBATCHWEBT (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "172.28.48.193",
    "ambiente": "Testing"
  },
  "SV-ADINTARWS-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "172.28.48.149",
    "ambiente": "Testing"
  },
  "SV-ARE-TEST (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "172.28.48.81",
    "ambiente": "Testing"
  },
  "SV-CEDIPCOELSA-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "172.28.48.173",
    "ambiente": "Testing"
  },
  "SVENGDB-TEST (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "-",
    "ambiente": "Testing"
  },
  "SV-Evo-Translator-QA (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "172.28.251.105",
    "ambiente": "Testing"
  },
  "SV-F2KU-TEST-2 (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "172.28.17.2",
    "ambiente": "Testing"
  },
  "SV-MEP-BD-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "172.28.48.151",
    "ambiente": "Testing"
  },
  "SV-NBERSAMAIL-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "-",
    "ambiente": "Testing"
  },
  "sv-sisdpt2-test (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "-",
    "ambiente": "Testing"
  },
  "sv-sql11-test (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "172.28.48.207",
    "ambiente": "Testing"
  },
  "sv-sql2019-t (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "172.28.7.3",
    "ambiente": "Testing"
  },
  "SV-TESINWEB-TE (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing2",
    "ip": "172.28.48.158",
    "ambiente": "Testing"
  },
  "ABSDEVTEST_restore (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "-",
    "ambiente": "Testing"
  },
  "SV-ABSDEV9-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "-",
    "ambiente": "Testing"
  },
  "SV-ABSRUN9-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "-",
    "ambiente": "Testing"
  },
  "SV-BeSmart-Test (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "172.28.48.108",
    "ambiente": "Testing"
  },
  "sv-bpm19-t (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "172.28.48.187",
    "ambiente": "Testing"
  },
  "SV-Dimensional-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "172.28.48.152",
    "ambiente": "Testing"
  },
  "sv-enginedb-test (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "172.28.48.186",
    "ambiente": "Testing"
  },
  "sv-ExtCom7-Test (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "172.28.48.156",
    "ambiente": "Testing"
  },
  "SV-PAYAPI-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "172.28.7.16",
    "ambiente": "Testing"
  },
  "SV-PGC-Test (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "172.28.48.135",
    "ambiente": "Testing"
  },
  "SV-RI-RO-T (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "172.28.48.140",
    "ambiente": "Testing"
  },
  "SV-SD-JEE-TEST (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "172.28.48.188",
    "ambiente": "Testing"
  },
  "sv-soj-test (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "172.28.48.117",
    "ambiente": "Testing"
  },
  "SV-WEB22-TEST (nuevobersa.net)": {
    "type": "Banco Entre Rios",
    "grupo": "Testing3",
    "ip": "-",
    "ambiente": "Testing"
  },
  "CORP000DC1 (corp.net)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "NBSF000DC2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo1",
    "ip": "172.16.11.129",
    "ambiente": "Producci�n"
  },
  "NBSF000GC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo1",
    "ip": "172.16.11.33",
    "ambiente": "Producci�n"
  },
  "NBSFSFEMPDC3 (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFDRPDCPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo2",
    "ip": "172.16.11.34",
    "ambiente": "Producci�n"
  },
  "CORP000GC1 (corp.net)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "NBSF000DC3 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo2",
    "ip": "172.16.11.42",
    "ambiente": "Producci�n"
  },
  "NBSFSFEMPDC4��� (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo2",
    "ip": "172.16.8.16",
    "ambiente": "Producci�n"
  },
  "BSFDRPDCPW2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo3",
    "ip": "172.16.11.36",
    "ambiente": "Producci�n"
  },
  "CORPDRPDCPW1 (corp.net)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo3",
    "ip": "172.16.11.37",
    "ambiente": "Producci�n"
  },
  "NBSF000DC4 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo3",
    "ip": "172.16.11.29",
    "ambiente": "Producci�n"
  },
  "SFEDRPDCPW1 (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo3",
    "ip": "172.16.8.17",
    "ambiente": "Producci�n"
  },
  "CORPDRPDCPW2 (corp.net)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo4",
    "ip": "172.16.11.38",
    "ambiente": "Producci�n"
  },
  "NBSF000DC5 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo4",
    "ip": "172.16.11.32",
    "ambiente": "Producci�n"
  },
  "SFEDRPDCPW2 (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo4",
    "ip": "172.16.8.18",
    "ambiente": "Producci�n"
  },
  "SRVDCBSF01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "DCGrupo4",
    "ip": "172.30.10.197",
    "ambiente": "Producci�n"
  },
  "BSF001APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.1.199",
    "ambiente": "Producci�n"
  },
  "BSF004APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.4.199",
    "ambiente": "Producci�n"
  },
  "BSF008APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.8.199",
    "ambiente": "Producci�n"
  },
  "BSF021APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.21.199",
    "ambiente": "Producci�n"
  },
  "BSF024APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.24.199",
    "ambiente": "Producci�n"
  },
  "BSF027APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.27.199",
    "ambiente": "Producci�n"
  },
  "BSF032APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.32.199",
    "ambiente": "Producci�n"
  },
  "BSF035APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.35.199",
    "ambiente": "Producci�n"
  },
  "BSF040APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.40.199",
    "ambiente": "Producci�n"
  },
  "BSF043APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.43.199",
    "ambiente": "Producci�n"
  },
  "BSF046APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.46.199",
    "ambiente": "Producci�n"
  },
  "BSF051APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.51.199",
    "ambiente": "Producci�n"
  },
  "BSF059APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.59.199",
    "ambiente": "Producci�n"
  },
  "BSF067APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.67.199",
    "ambiente": "Producci�n"
  },
  "BSF076APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.76.199",
    "ambiente": "Producci�n"
  },
  "BSF081APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.81.199",
    "ambiente": "Producci�n"
  },
  "BSF400APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF421APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.64.199",
    "ambiente": "Producci�n"
  },
  "BSF429APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF438APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.47.199",
    "ambiente": "Producci�n"
  },
  "BSF442APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": "192.168.60.199",
    "ambiente": "Producci�n"
  },
  "BSF476APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF502APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF505APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF508APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF512APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF516APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF520APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF523APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF527APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF531APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF534APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF537APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF540APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF543APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF546APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF555APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF560APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF566APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF599APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF700APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF722APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF742APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF767APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF800APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF900APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF002APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.2.199",
    "ambiente": "Producci�n"
  },
  "BSF005APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.5.199",
    "ambiente": "Producci�n"
  },
  "BSF009APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.9.199",
    "ambiente": "Producci�n"
  },
  "BSF022APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.22.199",
    "ambiente": "Producci�n"
  },
  "BSF025APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.25.199",
    "ambiente": "Producci�n"
  },
  "BSF028APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.28.199",
    "ambiente": "Producci�n"
  },
  "BSF033APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.33.199",
    "ambiente": "Producci�n"
  },
  "BSF036APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.36.199",
    "ambiente": "Producci�n"
  },
  "BSF041APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.41.199",
    "ambiente": "Producci�n"
  },
  "BSF044APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.44.199",
    "ambiente": "Producci�n"
  },
  "BSF048APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.48.199",
    "ambiente": "Producci�n"
  },
  "BSF054APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.54.199",
    "ambiente": "Producci�n"
  },
  "BSF057APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.57.199",
    "ambiente": "Producci�n"
  },
  "BSF061APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.61.199",
    "ambiente": "Producci�n"
  },
  "BSF071APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.71.199",
    "ambiente": "Producci�n"
  },
  "BSF078APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.78.199",
    "ambiente": "Producci�n"
  },
  "BSF101APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF406APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.70.199",
    "ambiente": "Producci�n"
  },
  "BSF426APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.29.199",
    "ambiente": "Producci�n"
  },
  "BSF431APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.66.199",
    "ambiente": "Producci�n"
  },
  "BSF440APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.69.199",
    "ambiente": "Producci�n"
  },
  "BSF444APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.65.199",
    "ambiente": "Producci�n"
  },
  "BSF500APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF503APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF506APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF510APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF514APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF517APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF521APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF524APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF528APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF532APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF535APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF538APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF541APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF544APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF547APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF550APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF553APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF556APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF563APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF569APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF600APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF727APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF755APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF798APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF826APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": "192.168.63.199",
    "ambiente": "Producci�n"
  },
  "BSF933APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF003APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.3.199",
    "ambiente": "Producci�n"
  },
  "BSF006APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.6.199",
    "ambiente": "Producci�n"
  },
  "BSF014APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "10.14.1.199",
    "ambiente": "Producci�n"
  },
  "BSF023APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.23.199",
    "ambiente": "Producci�n"
  },
  "BSF026APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.26.199",
    "ambiente": "Producci�n"
  },
  "BSF031APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.31.199",
    "ambiente": "Producci�n"
  },
  "BSF034APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.34.199",
    "ambiente": "Producci�n"
  },
  "BSF037APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.37.199",
    "ambiente": "Producci�n"
  },
  "BSF042APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.42.199",
    "ambiente": "Producci�n"
  },
  "BSF045APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.45.199",
    "ambiente": "Producci�n"
  },
  "BSF050APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.50.199",
    "ambiente": "Producci�n"
  },
  "BSF055APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.55.199",
    "ambiente": "Producci�n"
  },
  "BSF058APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.58.199",
    "ambiente": "Producci�n"
  },
  "BSF062APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.62.199",
    "ambiente": "Producci�n"
  },
  "BSF074APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.74.199",
    "ambiente": "Producci�n"
  },
  "BSF080APPWP1.nbsf.com.ar (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.80.199",
    "ambiente": "Producci�n"
  },
  "BSF410APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF428APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.39.199",
    "ambiente": "Producci�n"
  },
  "BSF434APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.73.199",
    "ambiente": "Producci�n"
  },
  "BSF441APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF457APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.53.199",
    "ambiente": "Producci�n"
  },
  "BSF501APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF504APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF507APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF511APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF515APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF518APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF522APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF530APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF533APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF536APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF539APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF542APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF545APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF548APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF551APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF554APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF558APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF565APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF596APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF601APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF718APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF733APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF766APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF799APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF857APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "192.168.68.199",
    "ambiente": "Producci�n"
  },
  "BSF990APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Fix3",
    "ip": "172.18.40.124",
    "ambiente": "Producci�n"
  },
  "BSF000XPRE02 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.251.242",
    "ambiente": "Producci�n"
  },
  "BSF202APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "1,92168E+11",
    "ambiente": "Producci�n"
  },
  "BSF526APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF550DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "1,92168E+11",
    "ambiente": "Producci�n"
  },
  "BSFACTPOLICYT1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.16.1.44",
    "ambiente": "Producci�n"
  },
  "BSFACTSRVINFRA1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.16.13.210",
    "ambiente": "Producci�n"
  },
  "BSFACTWACW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.16.2.110",
    "ambiente": "Producci�n"
  },
  "BSFAPI1P (BSFCACC1P)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.1.3",
    "ambiente": "Producci�n"
  },
  "BSFCCPASSETPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.2.79",
    "ambiente": "Producci�n"
  },
  "BSFCCPESSPW02 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.2.163",
    "ambiente": "Producci�n"
  },
  "BSFCCPGOAGWPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFCCPLEXWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.16.1.165",
    "ambiente": "Producci�n"
  },
  "BSFCCPPDFWP3 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.2.139",
    "ambiente": "Producci�n"
  },
  "BSFCCPSRVPW2 (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.2.98",
    "ambiente": "Producci�n"
  },
  "BSFDRPSNMPCW2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.2.118",
    "ambiente": "Producci�n"
  },
  "BSFLOG1T (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.18.180",
    "ambiente": "Producci�n"
  },
  "BSFRAD1P (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.2.59",
    "ambiente": "Producci�n"
  },
  "NBSF000BESMART1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.2.114",
    "ambiente": "Producci�n"
  },
  "NBSF000KMS01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.16.13.146",
    "ambiente": "Producci�n"
  },
  "NBSF000PAI02 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.16.2.148",
    "ambiente": "Producci�n"
  },
  "NBSF000SOS01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.2.31",
    "ambiente": "Producci�n"
  },
  "NBSFVMWAPR103 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion1",
    "ip": "172.18.18.102",
    "ambiente": "Producci�n"
  },
  "BSF549APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "1,92168E+11",
    "ambiente": "Producci�n"
  },
  "BSFACTMAILPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.1.24",
    "ambiente": "Producci�n"
  },
  "BSFAST1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.2.204",
    "ambiente": "Producci�n"
  },
  "BSFCACC1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.2.198",
    "ambiente": "Producci�n"
  },
  "BSFCCEVOWP1 (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.2.116",
    "ambiente": "Producci�n"
  },
  "BSFCCPESSPW01 (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.2.124",
    "ambiente": "Producci�n"
  },
  "BSFCCPMAEPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.16.8.245",
    "ambiente": "Producci�n"
  },
  "BSFCCPMAILPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.1.20",
    "ambiente": "Producci�n"
  },
  "BSFCCPMOBPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.2.153",
    "ambiente": "Producci�n"
  },
  "BSFCCPMSGPW2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.16.8.44",
    "ambiente": "Producci�n"
  },
  "BSFCCPSEGMIM1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.2.129",
    "ambiente": "Producci�n"
  },
  "BSFCCPSOP0PW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.16.1.51",
    "ambiente": "Producci�n"
  },
  "BSFDMZTMC1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFLEG1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.16.1.252",
    "ambiente": "Producci�n"
  },
  "BSFRAD2P (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.2.60",
    "ambiente": "Producci�n"
  },
  "BSFWEB1D (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.18.79",
    "ambiente": "Producci�n"
  },
  "NBSF000CA02 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.16.13.148",
    "ambiente": "Producci�n"
  },
  "NBSF000DHCP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.16.16.10",
    "ambiente": "Producci�n"
  },
  "NBSF000PROBATCH (NBSF000MDM01)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.2.46",
    "ambiente": "Producci�n"
  },
  "NBSF000SQL17 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.2.68",
    "ambiente": "Producci�n"
  },
  "NBSFMGRSQL02 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.16.2.138",
    "ambiente": "Producci�n"
  },
  "NBSFPTFLOG03 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion2",
    "ip": "172.18.2.44",
    "ambiente": "Producci�n"
  },
  "BSF056APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "192.168.56.199",
    "ambiente": "Producci�n"
  },
  "BSF727DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "1,92168E+11",
    "ambiente": "Producci�n"
  },
  "BSFAST2P (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.205",
    "ambiente": "Producci�n"
  },
  "BSFBRK1P (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.188",
    "ambiente": "Producci�n"
  },
  "BSFCCPGOAPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.1.60",
    "ambiente": "Producci�n"
  },
  "BSFCCPGOASQLPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.1.62",
    "ambiente": "Producci�n"
  },
  "BSFCCPOMNIPRTG1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.77",
    "ambiente": "Producci�n"
  },
  "BSFCCPPBCWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.130",
    "ambiente": "Producci�n"
  },
  "BSFCCPPDFWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.137",
    "ambiente": "Producci�n"
  },
  "BSFCCPPDFWP2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.138",
    "ambiente": "Producci�n"
  },
  "BSFCCPPROBATCH1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.83",
    "ambiente": "Producci�n"
  },
  "BSFCCPQRADARWP1 (BSFCCPSNMPCPW5)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.107",
    "ambiente": "Producci�n"
  },
  "BSFCCPSIPW21 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.117",
    "ambiente": "Producci�n"
  },
  "BSFCCPTSNWP1 (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.164",
    "ambiente": "Producci�n"
  },
  "BSFCCPWEBWP1 (BSFDMZWSUS1P)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.119",
    "ambiente": "Producci�n"
  },
  "BSFCCPWEBWP2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.186",
    "ambiente": "Producci�n"
  },
  "BSFDRPSNMPC902 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFPWS2P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.38",
    "ambiente": "Producci�n"
  },
  "BSFTSC1D (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.18.80",
    "ambiente": "Producci�n"
  },
  "NBSF000DHCP2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.16.16.11",
    "ambiente": "Producci�n"
  },
  "nbsf000pai01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.16.254.21",
    "ambiente": "Producci�n"
  },
  "NBSFMGRSQL04 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.18.2.36",
    "ambiente": "Producci�n"
  },
  "NBSFVMWAPPCSH1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion3",
    "ip": "172.16.13.89",
    "ambiente": "Producci�n"
  },
  "BSF520DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "1,92168E+11",
    "ambiente": "Producci�n"
  },
  "BSF565DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "1,92168E+11",
    "ambiente": "Producci�n"
  },
  "BSF701APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "1,92168E+11",
    "ambiente": "Producci�n"
  },
  "BSF716DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "1,92168E+11",
    "ambiente": "Producci�n"
  },
  "BSFACTMAILPW2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.1.125",
    "ambiente": "Producci�n"
  },
  "BSFACTPTFWT1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.18.158",
    "ambiente": "Producci�n"
  },
  "BSFAPIMGRDMZT1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFCCPACLWP1 (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.2.89",
    "ambiente": "Producci�n"
  },
  "BSFCCPDBSITEPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.2.76",
    "ambiente": "Producci�n"
  },
  "BSFCCPDMZWEBPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFCCPLEXDMZWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFCCPPEMPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.2.73",
    "ambiente": "Producci�n"
  },
  "BSFCCPRNPERWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.18.64",
    "ambiente": "Producci�n"
  },
  "BSFCCPSIPW22 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.2.155",
    "ambiente": "Producci�n"
  },
  "BSFCCPSQLPW01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.2.69",
    "ambiente": "Producci�n"
  },
  "BSFCCPSQLW02 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.2.94",
    "ambiente": "Producci�n"
  },
  "BSFCCPSQLW03 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.2.101",
    "ambiente": "Producci�n"
  },
  "BSFEXCE1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.2.196",
    "ambiente": "Producci�n"
  },
  "BSFRAS1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.16.2.135",
    "ambiente": "Producci�n"
  },
  "BSFREP1P (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.2.167",
    "ambiente": "Producci�n"
  },
  "BSFSVN1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.2.195",
    "ambiente": "Producci�n"
  },
  "NBSFINFRASQL01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": "172.18.2.62",
    "ambiente": "Producci�n"
  },
  "WSUSWS (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF014DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "10.14.1.11",
    "ambiente": "Producci�n"
  },
  "BSF518DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "1,92168E+11",
    "ambiente": "Producci�n"
  },
  "BSF596DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "1,92168E+11",
    "ambiente": "Producci�n"
  },
  "BSFACTAPPWD1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.18.48",
    "ambiente": "Producci�n"
  },
  "BSFACTPDFWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.2.90",
    "ambiente": "Producci�n"
  },
  "BSFAPI2P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.1.4",
    "ambiente": "Producci�n"
  },
  "BSFAPR1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.2.213",
    "ambiente": "Producci�n"
  },
  "BSFCCPMAILPW2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.1.21",
    "ambiente": "Producci�n"
  },
  "BSFCCPMODODMZP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFCCPSAAPW2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFCCPSQLSDYW (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.2.112",
    "ambiente": "Producci�n"
  },
  "BSFCCPSQLW04 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.2.150",
    "ambiente": "Producci�n"
  },
  "BSFDEBMEDIAPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.2.193",
    "ambiente": "Producci�n"
  },
  "BSFDEEP1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.16.1.162",
    "ambiente": "Producci�n"
  },
  "BSFDESAPP01 (BSFDRPSNMPCW1)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.2.165",
    "ambiente": "Producci�n"
  },
  "BSFDRPDC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFPTF1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.2.25",
    "ambiente": "Producci�n"
  },
  "BSFPWS1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.2.37",
    "ambiente": "Producci�n"
  },
  "BSFSQL7P (CORPDRPDCPW1.corp.net)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.16.11.141",
    "ambiente": "Producci�n"
  },
  "BSFSWP1P-WEB (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "NBSF000APPCSH01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.16.13.90",
    "ambiente": "Producci�n"
  },
  "NBSF000DEXMGR01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.2.33",
    "ambiente": "Producci�n"
  },
  "NBSFADDSPAI01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion5",
    "ip": "172.18.2.56",
    "ambiente": "Producci�n"
  },
  "BSF552APPWP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "1,92168E+11",
    "ambiente": "Producci�n"
  },
  "BSFACTDMZWEBTW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFACTWEBWT1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.18.45",
    "ambiente": "Producci�n"
  },
  "BSFBS1T (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.18.18",
    "ambiente": "Producci�n"
  },
  "BSFCCPBSTW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.2.152",
    "ambiente": "Producci�n"
  },
  "BSFCCPEMSP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFCCPGOAPW2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.1.61",
    "ambiente": "Producci�n"
  },
  "BSFCCPMODOINPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.2.75",
    "ambiente": "Producci�n"
  },
  "BSFCCPSRVPW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.2.72",
    "ambiente": "Producci�n"
  },
  "BSFCCSQLM4WP1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.16.11.142",
    "ambiente": "Producci�n"
  },
  "BSFDRPDC2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFENG3P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSFLOG1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.2.92",
    "ambiente": "Producci�n"
  },
  "BSFMBAM01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.2.18",
    "ambiente": "Producci�n"
  },
  "BSFWEB1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.2.23",
    "ambiente": "Producci�n"
  },
  "NBSF000JIRA (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.2.47",
    "ambiente": "Producci�n"
  },
  "NBSF000SQLALGN01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "NBSFDESSQL06 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.18.29",
    "ambiente": "Producci�n"
  },
  "NBSFDMZWEB12 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "NBSFSIAPEX1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.2.50",
    "ambiente": "Producci�n"
  },
  "NBSFVMWDMZWEB04 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "NBSFVMWSIDESYS1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Produccion6",
    "ip": "172.18.18.52",
    "ambiente": "Producci�n"
  },
  "BSF022DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "192.168.22.102",
    "ambiente": "Producci�n"
  },
  "BSF023DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF028DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF033DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF037DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF042DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF046DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF054DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF058DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF067DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF078DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF406DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF428DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF440DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF457DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF560DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF599DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF701DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF733DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF767DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF503DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF507DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF511DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF516DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF522DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF527DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF532DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF537DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF541DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF545DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF549DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF554DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF003DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "192.168.3.102",
    "ambiente": "Producci�n"
  },
  "BSF008DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": "192.168.8.102",
    "ambiente": "Producci�n"
  },
  "BSF799DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF900DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal1",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF500DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF024DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF030DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF034DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF038DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF043DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF048DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF055DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF059DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF071DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF081DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF410DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF429DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF441DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF476DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF563DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF600DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF706DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF742DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF798DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF504DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF508DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF512DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF517DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF523DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF528DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF533DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF538DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF542DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF546DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF551DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF555DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF004DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "192.168.4.102",
    "ambiente": "Producci�n"
  },
  "BSF080DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": "192.168.80.102",
    "ambiente": "Producci�n"
  },
  "BSF800DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF933DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal2",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF536DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF025DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF031DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF035DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF040DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF044DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF050DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF056DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF061DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF074DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF202DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF421DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF434DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF442DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF556DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF566DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF601DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF718DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF755DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF501DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF505DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF509DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF514DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF519DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF524DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF530DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF534DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF539DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF543DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF547DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF552DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF001DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "192.168.1.102",
    "ambiente": "Producci�n"
  },
  "BSF005DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "192.168.5.102",
    "ambiente": "Producci�n"
  },
  "BSF101DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "192.168.219.99",
    "ambiente": "Producci�n"
  },
  "BSF826DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal3",
    "ip": "192.168.63.102",
    "ambiente": "Producci�n"
  },
  "BSF021DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF027DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF032DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF036DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF041DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF045DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF051DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF057DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF062DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF076DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF400DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF426DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF438DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF444DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF558DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF569DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF700DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF722DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF766DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "-",
    "ambiente": "Producci�n"
  },
  "BSF502DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF506DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF510DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF515DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF521DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF526DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF531DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF535DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF540DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF544DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF548DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF553DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": null,
    "ambiente": "Producci�n"
  },
  "BSF002DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "192.168.2.102",
    "ambiente": "Producci�n"
  },
  "BSF006DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "192.168.6.102",
    "ambiente": "Producci�n"
  },
  "BSF431DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "192.168.66.102",
    "ambiente": "Producci�n"
  },
  "BSF857DC1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Sucursal4",
    "ip": "192.168.68.102",
    "ambiente": "Producci�n"
  },
  "BSFACTENGSQLDW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.57",
    "ambiente": "Test"
  },
  "BSFACTESSTW01 (NBSF.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.36",
    "ambiente": "Test"
  },
  "BSFACTEVODW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.42",
    "ambiente": "Test"
  },
  "BSFACTEVOWT1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.43",
    "ambiente": "Test"
  },
  "BSFACTHIKTW1 (NBSF.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.66",
    "ambiente": "Test"
  },
  "BSFACTINFRASRV1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.16.1.213",
    "ambiente": "Test"
  },
  "BSFACTMSGWT1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.16.55.6",
    "ambiente": "Test"
  },
  "BSFACTMSGWT2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": null,
    "ambiente": "Test"
  },
  "BSFACTPWRDAWT1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.47",
    "ambiente": "Test"
  },
  "BSFACTSQL07TW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.16.8.218",
    "ambiente": "Test"
  },
  "BSFACTSQLSDYW (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.70",
    "ambiente": "Test"
  },
  "BSFACTSQLW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.60",
    "ambiente": "Test"
  },
  "BSFACTSQLW3 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.106",
    "ambiente": "Test"
  },
  "BSFACTSQLW4 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.155",
    "ambiente": "Test"
  },
  "BSFACTSQLWD1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.61",
    "ambiente": "Test"
  },
  "BSFACTSRVTW2 (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.156",
    "ambiente": "Test"
  },
  "BSFACTTSNWT1 (NBSF.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.62",
    "ambiente": "Test"
  },
  "BSFAPIMGRTEST1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.38",
    "ambiente": "Test"
  },
  "BSFBRK1T (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.16.2.144",
    "ambiente": "Test"
  },
  "BSFDMZTMC1T (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "-",
    "ambiente": "Test"
  },
  "BSFENG3D (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.184",
    "ambiente": "Desarrollo"
  },
  "BSFENG3T (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.183",
    "ambiente": "Test"
  },
  "BSFHELIX1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.2.202",
    "ambiente": "Test"
  },
  "BSFPAI1T (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing1",
    "ip": "172.18.18.190",
    "ambiente": "Test"
  },
  "BSFSQL1D (corp.net)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.78",
    "ambiente": "Test"
  },
  "BSFSQL7D (CORPDC1P.corp.net)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.105",
    "ambiente": "Test"
  },
  "NBSFDESMSG01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.22",
    "ambiente": "Test"
  },
  "NBSFVMWBESMART1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.20",
    "ambiente": "Test"
  },
  "BSFACTENGWEBDW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.56",
    "ambiente": "Test"
  },
  "BSFACTESSTW02 (siteempresas.bancosantafe.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.69",
    "ambiente": "Test"
  },
  "BSFACTGXPTW1 (NBSF.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.54",
    "ambiente": "Test"
  },
  "BSFACTGXPTW2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.55",
    "ambiente": "Test"
  },
  "BSFACTINFRASQL1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.40",
    "ambiente": "Test"
  },
  "BSFACTPWRDASWT1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.46",
    "ambiente": "Test"
  },
  "BSFACTSQLM4T (NBSF.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.16.8.217",
    "ambiente": "Test"
  },
  "BSFACTSRVTW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.151",
    "ambiente": "Test"
  },
  "BSFACTWEBWT2 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.157",
    "ambiente": "Test"
  },
  "BSFAPI1T (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.173",
    "ambiente": "Test"
  },
  "BSFDEMEDIATW1 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.172",
    "ambiente": "Test"
  },
  "BSFESCO1T (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.175",
    "ambiente": "Test"
  },
  "BSFGXSQL1P (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.2.27",
    "ambiente": "Test"
  },
  "BSFHELIX1T (BSFPSAFE01P)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.71",
    "ambiente": "Test"
  },
  "BSFSQL1T (corp.net)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.174",
    "ambiente": "Test"
  },
  "BSFWEB1T (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.177",
    "ambiente": "Test"
  },
  "NBSFTESTSOS01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.18.28",
    "ambiente": "Test"
  },
  "NBSFVMWPROBATCH (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.18.2.85",
    "ambiente": "Test"
  },
  "NBSFVMWSOS01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Testing2",
    "ip": "172.16.13.168",
    "ambiente": "Test"
  },
  "BSFDRPROSPXY01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Veeam1",
    "ip": "10.16.17.21",
    "ambiente": "Producci�n"
  },
  "BSFDRPROSPXY02 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Veeam1",
    "ip": "10.16.17.22",
    "ambiente": "Producci�n"
  },
  "NBSF000VEEAM03 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Veeam1",
    "ip": "172.16.2.146",
    "ambiente": "Producci�n"
  },
  "NBSFVEEAMMNT01 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Veeam1",
    "ip": "172.16.2.95",
    "ambiente": "Producci�n"
  },
  "NBSFVEEAMPXY03 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Veeam1",
    "ip": "172.18.2.87",
    "ambiente": "Producci�n"
  },
  "NBSF000VEEAM02 (NBSF.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Veeam2",
    "ip": "172.16.13.35",
    "ambiente": "Producci�n"
  },
  "NBSF000VEEAMONE (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Veeam2",
    "ip": "172.16.12.180",
    "ambiente": "Producci�n"
  },
  "NBSFVEEAMPXY04 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Veeam2",
    "ip": "172.18.2.136",
    "ambiente": "Producci�n"
  },
  "NBSFVEEAMPXY05 (nbsf.com.ar)": {
    "type": "Banco Santa Fe",
    "grupo": "Veeam2",
    "ip": "172.16.1.236",
    "ambiente": "Producci�n"
  }
};

export function getServerInfo(serverName: string): ServerInfo | undefined {
  return serverTypeMap[serverName];
}
