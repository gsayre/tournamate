"use client";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function PartnerSearch({ children }: { children: React.ReactNode }) {
  const searchParam = useSearchParams();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { replace } = useRouter();
    const handleSearch = useDebouncedCallback((namePartial: string) => {
        const params = new URLSearchParams(searchParam);
        if (namePartial) {
          params.set("name", namePartial);
        }
        replace(`${pathname}?${params.toString()}`);
      }, 200);

  return (
    <div className="flex flex-row gap-4">
      <Input
        type="text"
        placeholder="Partner name..."
        onChangeCapture={(e) =>
          handleSearch(e.currentTarget.value)
        }
        className="ml-2 w-36 p-2"
        defaultValue={searchParam.get("name")?.toString()}
      />
      {children}
    </div>
  );
}