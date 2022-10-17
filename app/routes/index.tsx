import {
  ActionFunction,
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";

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

  const files = formData.getAll("files") as File[];
  const deviceId = formData.get("deviceId") as string;

  for (const file of files) {
    console.log(file.name, deviceId); // csv upload handler here
  }

  return json({ message: "Hello, world!" });
};

export default function Index() {
  const [deviceId, setDeviceId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

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

  return (
    <div className="mx-auto mt-4 max-w-7xl text-center">
      <h1 className="font-bold text-xl text-red-400">
        All Voices CSV Uploader Code Test
      </h1>

      <Form method="post" encType="multipart/form-data">
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

      <p className="mt-20">Device ID: {deviceId}</p>
    </div>
  );
}
