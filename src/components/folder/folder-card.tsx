import { Folder } from "@prisma/client";
import React from "react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import UpdateFolder from "./update-folder";
import DeleteFolder from "./delete-folder";

interface FolderCardProps {
  folder: Folder;
}

export default function FolderCard({ folder }: FolderCardProps) {
  return (
    <Card className="border-none hover:border rounded-md hover:bg-muted/30 group relative">
      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <UpdateFolder notesFolder={folder} />
        <DeleteFolder folderId={folder.id} />
      </div>
      <Link href={`folders/${folder.id}`} className="block">
        <CardHeader className="p-6 pb-2 space-y-0 items-center">
          <Image
            className="w-20"
            src="/folder.png"
            width={540}
            height={840}
            alt="FolderImg"
          />
        </CardHeader>
        <CardFooter className="justify-center text-center pb-2 overflow-hidden">
          {folder.name}
        </CardFooter>
      </Link>
    </Card>
  );
}
