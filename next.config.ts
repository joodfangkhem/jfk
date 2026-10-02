import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // จุดนี้เคยใช้รหัส WEI-GEN ซึ่งเป็นชื่อที่ตำราใช้กับ GV-2 คนละจุดกัน
      // เปลี่ยนเป็น wei-jie ตามตำราแล้ว URL เดิมถูก Google เก็บไว้ จึงต้องส่งต่อ
      { source: "/points/wei-gen", destination: "/points/wei-jie", permanent: true },
      { source: "/en/points/wei-gen", destination: "/en/points/wei-jie", permanent: true },
    ];
  },
};

export default nextConfig;
