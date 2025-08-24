import osUtils from "os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";

const INTERVAL_TIMER = 500;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCPUUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    mainWindow.webContents.send("statistics", {
      cpuUsage,
      ramUsage,
      storageUsage: storageData.usage,
    });
     
  }, INTERVAL_TIMER);
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemGb = Math.floor(os.totalmem() / 1024 / 1024 / 1024);
  return {
    totalStorage,
    cpuModel,
    totalMemGb,
  };
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C:" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1024 / 1024 / 1024),
    usage: 1 - free / total,
  };
}

function getCPUUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}

function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}
