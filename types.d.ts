type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: number;
  totalMemGb: number;
};

interface Window {
  electron: {
    subscribeStatistics: (callback: (statistics: Statistics) => void) => void;
    getStaticData: ()=> Promise<StaticData>;
  };
}
