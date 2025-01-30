import React from "react";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  return <div>Hi there bro, the dynamic segment is: {params.id}</div>;
};

export default Page;
