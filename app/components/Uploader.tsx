import { ReactElement, useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  onDrop: (acceptedFiles: File[]) => void;
};

export default function Uploader({ onDrop }: Props): ReactElement<Props> {
  const handleOnDrop = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleOnDrop,
  });

  return (
    <div
      className="flex justify-center items-center m-4 bg-cyan-100 p-4 min-h-[200px]"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}
