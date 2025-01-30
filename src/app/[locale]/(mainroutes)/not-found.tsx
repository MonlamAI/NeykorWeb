import Link from "next/link";
import React from "react";

const Notfound = () => {
  return (
    <div className="flex flex-col items-center w-full justify-center pt-28">
      <h1 className=" font-bold text-4xl">Notfound</h1>
      <p>the page that you are searching is not there </p>
      <Link href="/">
        {" "}
        <div className=" mt-10 border rounded-lg p-3 shadow cursor-pointer transition hover:shadow-none hover:text-gray-500 ">
          GO HOME
        </div>
      </Link>
    </div>
  );
};

export default Notfound;
