"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function PartnerInviteForm({ name }: { name: string }) {
      const searchParam = useSearchParams();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((namePartial: string) => {
    const params = new URLSearchParams(searchParam);
    if (namePartial) {
      params.set("name", namePartial);
    } else {
      params.delete("name");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 200);
    return (
        <Dialog>
            <DialogTrigger asChild>
              <Button>Register</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  Register
                </DialogTitle>
                <DialogDescription>
                  Find your partner and sign up for the tournament
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Partner name..."
                  onChangeCapture={(e) => handleSearch(e.currentTarget.value)}
                  className="pb-2"
                  defaultValue={searchParam.get("name")?.toString()}
                />
              </div>
            </DialogContent>
          </Dialog>
    )
}