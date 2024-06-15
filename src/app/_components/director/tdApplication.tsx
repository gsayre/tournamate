"use client";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

export default function TDApplication({ userId }: { userId: string }) {
  const createTDApplicaiton =
    api.role.createTournamentDirectorApplication.useMutation({
      onSuccess: () => {
        toast({
          title: "Success!",
          description:
            "Your tournament director application has been submitted.",
        });
      },
      onError: () => {
        toast({
          title: "Error!",
          description:
            "There was an error submitting your tournament director application.",
          variant: "destructive",
        });
      },
    });
  const { toast } = useToast();
  return (
    <p>
      Want to be a tournament director?{" "}
      <button
        className="text-sky-500"
        onClick={() => {
          createTDApplicaiton.mutate({ userId });
        }}
      >
        Apply here
      </button>
    </p>
  );
}
