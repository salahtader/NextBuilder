import React from 'react';

const Page = async ({
  params,
}: {
  params: { agencyId: string }
}) => {
    return (
        <div className="relative h-full">
            <pre>{params.agencyId}</pre>
        </div>
    );
}

export default Page;
