"use client";

import { useState } from "react";

export default function EncryptPage() {
  const [status, setStatus] = useState(null);

  const startEncryption = async () => {
    await fetch("/api/encrypt/start", { method: "POST" });
    // 정기적으로 상태 체크 시작
  };

  return (
    <div>
      <div>EncryptPage</div>
      {status && <div>Status: {status}</div>}
    </div>
  );
}
