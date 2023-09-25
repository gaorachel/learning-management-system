import React from "react";
import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      height={130}
      width={130}
      style={{ height: "auto", width: "auto" }}
      alt="logo"
      src="/logo.svg"
      priority={false}
    />
  );
};
