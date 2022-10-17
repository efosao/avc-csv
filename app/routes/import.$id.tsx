import { json, LoaderFunction } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { createRef, useEffect, useState } from "react";
import { getImportDataById } from "~/models/import";

type LoaderFunctionData = {
  imports: Awaited<ReturnType<typeof getImportDataById>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id as string;
  const imports = await getImportDataById(id);

  return json<LoaderFunctionData>({ imports }, { status: 200 });
};

type ImportType = {
  created: string;
  device_id: string;
  filename: string;
  id: string;
  session_id: string;
  updated: Date;
};

export default function Index() {
  const [deviceId, setDeviceId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const { imports } = useLoaderData<LoaderFunctionData>();

  useEffect(() => {
    const savedDeviceId = localStorage.getItem("deviceId");
    if (savedDeviceId) return setDeviceId(savedDeviceId);

    const newDeviceId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("deviceId", newDeviceId);
    setDeviceId(newDeviceId);
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    setFiles(files ? Array.from(files) : []);
  }

  const canUpload = files.length > 0;

  const rtf1 = new Intl.RelativeTimeFormat("en", { style: "narrow" });

  return (
    <div className="mx-auto mt-4 max-w-7xl text-center">
      <h1 className="font-bold text-xl text-red-400">
        All Voices CSV Uploader Code Test
      </h1>

      <section className="mt-8">
        <h2 className="font-bold text-xl text-red-400">Imports</h2>
        {imports.length > 0 ? (
          <table className="mt-4 mx-auto w-[500px]">
            <thead>
              <tr className="bg-slate-200">
                <th className="text-left">Id</th>
                <th className="text-left">First Name</th>
                <th className="text-left">Last Name</th>
              </tr>
            </thead>
            <tbody>
              {imports.map((importItem) => (
                <tr className="table-row" key={importItem.id}>
                  <td>{importItem.record_id}</td>
                  <td>{importItem.first_name}</td>
                  <td>{importItem.last_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4 text-sm text-gray-400">No imports yet</p>
        )}
      </section>

      <p className="mt-20">Device ID: {deviceId}</p>
    </div>
  );
}
