import { Folder } from "@prisma/client";
import React from "react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface FolderCardProps {
  folder: Folder;
}

export default function FolderCard({ folder }: FolderCardProps) {
  return (
    <Link href={`folders/${folder.id}`}>
      <Card className="border rounded-md hover:bg-muted/30">
        <CardHeader className="p-6 pb-2 space-y-0 items-center">
          <Image
            className="w-20"
            src="/folder.png"
            width={540}
            height={840}
            alt="FolderImg"
          />
        </CardHeader>
        <CardFooter className="justify-center text-center pb-2 overflow-hidden borde border-red-200">
          {folder.name}
        </CardFooter>
      </Card>
    </Link>
  );
}
