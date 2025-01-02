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

type DialogProps = {
  open?: boolean;
  setOpen?: () => void;
  trigger?: React.ReactNode;
  isBtn?: boolean;
  icon?: IconType;
  btnTitle?: string;
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

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>

          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogWrapper;
