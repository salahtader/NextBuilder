import React from "react";

export const Page = ({ params }: { params: { slug: string } }) => {
  return <p>{params.slug}</p>;
};

export default Page;
