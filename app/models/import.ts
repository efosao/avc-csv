import { Import, ImportData } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getImportsByDeviceId(
  deviceId: string
): Promise<Import[]> {
  return prisma.import.findMany({
    where: {
      device_id: deviceId,
    },
    orderBy: {
      created: "desc",
    },
  });
}

export async function getImportDataById(
  importId: string
): Promise<ImportData[]> {
  return prisma.importData.findMany({
    where: {
      import_id: importId,
    },
    orderBy: {
      created: "desc",
    },
  });
}

export async function createImportRecord(
  deviceId: string,
  filename: string,
  sessionId: string
): Promise<string> {
  const importRecord = await prisma.import.create({
    data: {
      device_id: deviceId,
      filename,
      session_id: sessionId,
    },
  });
  return importRecord.id;
}

type ImportRecordData = {
  id: number;
  first_name: string;
  last_name: string;
}[];

export async function appendDataToImportRecord(
  importRecordId: string,
  data: ImportRecordData
) {
  await prisma.importData.createMany({
    data: data.map((d) => ({
      first_name: d.first_name,
      import_id: importRecordId,
      last_name: d.last_name,
      record_id: d.id,
    })),
  });
}
