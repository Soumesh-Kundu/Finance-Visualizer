import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Ring } from "ldrs/react";
import 'ldrs/react/Ring.css'
export default function ConfirmationBox({
  children,
  onConfirm,
}: {
  children: React.ReactNode;
  onConfirm: () => Promise<any>;
}) {
  const [isLoading, setLoading] = useState(false);
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);
  async function handleClick() {
    setLoading(true);
    await onConfirm();
    dialogCloseRef.current?.click();
    setLoading(false);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm px-8 py-5">
        <DialogTitle hidden>Are you sure?</DialogTitle>
        <div className="flex flex-col gap-4 items-center">
          <p className=" text-gray-600 font-medium text-center">
            Are you sure you want to delete this transaction?
          </p>
          <div className="flex gap-2">
            <Button disabled={isLoading} variant="destructive" onClick={handleClick} className="w-20">
              {isLoading ? (
                <Ring
                  speed={2}
                  size={25}
                  stroke={2}
                  bgOpacity={0}
                  color="white"
                />
              ) : (
                "Delete"
              )}
            </Button>
            <DialogClose disabled={isLoading} ref={dialogCloseRef} asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
