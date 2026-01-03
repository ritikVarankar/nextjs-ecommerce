import Image from "next/image";
import React from "react";
import { FilePath } from "@/lib/ExportFiles";

function Loading() {
  return (
    <div className="h-full w-auto flex justify-center items-start mt-12">
      <Image src={FilePath.loading} height={80} width={80} alt="Loading" />
    </div>
  );
}

export default Loading;
