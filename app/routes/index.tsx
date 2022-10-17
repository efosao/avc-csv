import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function Index() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
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
    console.log({ files });
  }

  const canUpload = files.length > 0;

  return (
    <div className="mx-auto mt-4 max-w-7xl text-center">
      <h1 className="font-bold text-xl text-red-400">
        All Voices CSV Uploader Code Test
      </h1>

      <Form method="post" encType="multipart/form-data">
        <label
          className="block mb-2 text-sm font-medium text-gray-400"
          htmlFor="file_input"
        >
          Upload file
        </label>
        <input
          className="block w-full text-sm p-2 mx-2 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
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

        <div className="flex justify-center gap-2 mt-4">
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
