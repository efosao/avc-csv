import { useEffect, useState } from "react";

export default function Index() {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const savedDeviceId = localStorage.getItem("deviceId");
    if (savedDeviceId) return setDeviceId(savedDeviceId);

    const newDeviceId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("deviceId", newDeviceId);
    setDeviceId(newDeviceId);
  }, []);

  return (
    <div className="mx-auto mt-16 max-w-7xl text-center">
      <h1>Hello World</h1>
      <p>Device ID: {deviceId}</p>
    </div>
  );
}
