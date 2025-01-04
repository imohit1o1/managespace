import { Button } from "@/components/ui/button";
import { IconType } from "react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

type DialogProps = {
  open?: boolean;
  setOpen?: () => void;
  trigger?: React.ReactNode;
  isBtn?: boolean;
  icon?: IconType;
  btnTitle?: string;
  dialogIcon?: IconType | string;
  dialogSize?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  children: React.ReactNode;
};

const DialogWrapper = ({
  open,
  setOpen,
  trigger,
  isBtn,
  btnTitle,
  icon: Icon,
  dialogIcon: DialogIcon,
  dialogSize,
  dialogTitle,
  dialogDescription,
  children,
}: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ||
          (isBtn ? (
            <Button
              variant="outline"
              className="flex items-center gap-2 text-foreground"
            >
              {Icon && <Icon size={18} />}

              {btnTitle}
            </Button>
          ) : null)}
      </DialogTrigger>

      <DialogContent className={dialogSize}>
        <DialogHeader>
          {DialogIcon && typeof DialogIcon === "string" ? (
            // If DialogIcon is a string (image URL), render an image
            <div className="flex justify-center items-center">
              <Image
                className="w-20"
                src={DialogIcon}
                width={540}
                height={840}
                alt="FolderImg"
              />
            </div>
          ) : DialogIcon ? (
            // If DialogIcon is an IconType (a React component), render the icon
            <div className="flex justify-center items-center">
              <DialogIcon size={80} className="text-yellow-400" />
            </div>
          ) : null}
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogWrapper;
