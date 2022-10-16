import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";

import Uploader from "~/components/Uploader";

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

  function onDrop(acceptedFiles: File[]) {
    console.log(acceptedFiles);
    setFiles(acceptedFiles);
  }

  function resetFiles() {
    setFiles([]);
  }

  const filesToUpload = files.map((file) => (
    <div key={file.name}>{file.name}</div>
  ));

  const canUpload = filesToUpload.length > 0;

  return (
    <div className="mx-auto mt-4 max-w-7xl text-center">
      <h1 className="font-bold text-xl text-red-400">
        All Voices CSV Uploader Code Test
      </h1>

      {canUpload && (
        <div className="mt-4">
          <h2 className="font-bold text-lg text-red-400">Files to upload</h2>
          <div className="mt-2">{filesToUpload}</div>
        </div>
      )}

      <Form>
        {!canUpload && <Uploader onDrop={onDrop} />}

        <div className="flex justify-center gap-2 mt-4">
          <button
            className="py-2 px-4 bg-red-200 rounded disabled:bg-gray-300"
            type="button"
            onClick={resetFiles}
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
