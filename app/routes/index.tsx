import {
  ActionFunction,
  json,
  LoaderFunction,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createRef, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { insertCsvIntoDb } from "~/uploader.server";

type LoaderFunctionData = {
  imports: any[];
};

export const loader: LoaderFunction = async ({ request }) => {
  let imports: any[] = [];
  return json<LoaderFunctionData>({ imports }, { status: 200 });
};

type ActionFunctionData = {
  message: string;
};

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 500_000_000,
      file: ({ filename }) => filename,
    }),
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  type FileWithFilepath = File & { filepath: string };

  const files = formData.getAll("files") as FileWithFilepath[];
  const deviceId = formData.get("deviceId") as string;
  const sessionId = uuidv4();

  for (const file of files) {
    const filepath: string = file.filepath;
    await insertCsvIntoDb(filepath, file.name, deviceId, sessionId);
    // validate file
    // save file to db
  }

  return json<ActionFunctionData>({ message: "Hello, world!" });
};

type ImportType = {
  created: Date;
  device_id: string;
  filename: string;
  id: string;
  session_id: string;
  updated: Date;
};

export default function Index() {
  const [deviceId, setDeviceId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [imports, setImports] = useState<ImportType[]>([]);
  const actiondata = useActionData<ActionFunctionData>();
  const formRef = createRef<HTMLFormElement>();

  useEffect(() => {
    const savedDeviceId = localStorage.getItem("deviceId");
    if (savedDeviceId) return setDeviceId(savedDeviceId);

    const newDeviceId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("deviceId", newDeviceId);
    setDeviceId(newDeviceId);
  }, []);

  useEffect(() => {
    if (!actiondata) return;
    if (formRef.current) formRef.current.reset();
    fetchImports(deviceId);
  }, [actiondata]);

  async function fetchImports(deviceIdParam: string) {
    const result = await fetch(`/api/imports/${deviceIdParam}`).then((res) => {
      if (res.ok) return res.json();
      throw new Error("Failed to fetch imports");
    });
    setImports(result.imports);
  }

  useEffect(() => {
    if (deviceId) fetchImports(deviceId);
  }, [deviceId]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    setFiles(files ? Array.from(files) : []);
  }

  const canUpload = files.length > 0;

  return (
    <div className="mx-auto mt-4 max-w-7xl text-center">
      <h1 className="font-bold text-xl text-red-400">
        All Voices CSV Uploader Code Test
      </h1>

      <Form method="post" encType="multipart/form-data" ref={formRef}>
        <section className="my-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-400"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-8/12 text-sm p-2 mx-auto text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            aria-describedby="file_input_help"
            accept="text/csv,text/plain"
            type="file"
            name="files"
            multiple
            onChange={onFileChange}
          />
          <p className="mt-1 text-sm text-gray-400" id="file_input_help">
            CSV or TXT files only
          </p>
        </section>
        <input name="deviceId" type="hidden" value={deviceId} />

        <div className="flex justify-center gap-2 mt-6">
          <button
            className="py-2 px-4 bg-red-200 rounded disabled:bg-gray-300"
            type="reset"
          >
            Reset
          </button>
          <button
            className="py-2 px-4 bg-green-400 rounded disabled:bg-gray-300"
            type="submit"
            disabled={!canUpload}
          >
            Upload Files
          </button>
        </div>
      </Form>

      <section className="mt-8">
        <h2 className="font-bold text-xl text-red-400">Imports</h2>
        {imports.length > 0 ? (
          <ul className="mt-4">
            {imports.map((importItem) => (
              <li key={importItem.id}>
                <p className="text-sm text-gray-400">
                  {importItem.filename} - {importItem.created.toString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-400">No imports yet</p>
        )}
      </section>

      <p className="mt-20">Device ID: {deviceId}</p>
    </div>
  );
}
