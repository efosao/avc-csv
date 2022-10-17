import { json, LoaderFunction } from "@remix-run/node";
import { getImportsByDeviceId } from "~/models/import";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  if (!id) return json({ error: "no id" }, { status: 400 });

  const imports = await getImportsByDeviceId(id);
  return json({ imports });
};
