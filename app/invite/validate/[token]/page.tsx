import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TokenValidator } from "../../components/token-validator";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ValidateTokenPage(props: PageProps) {
  const params = await props.params;
  const { token } = params;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TokenValidator token={token} />
    </Suspense>
  );
}
