"use client";
import { useToast } from '@/components/ui/use-toast';
import React from 'react';

const Page =  ({
  params,
}: {
  params: { agencyId: string }
}) => {
  const {toast} = useToast();
  const handleToast = ()=>{
    toast({
      title: "Message",
    });
  }
    return (
        <div className="relative h-full">
            <pre>{params.agencyId}</pre>
            <button onClick={handleToast}>Toast</button>
        </div>
    );
}

export default Page;
