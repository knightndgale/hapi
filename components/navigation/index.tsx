import { getMe } from "@/requests/auth.request";
import { Header } from "./_components/header";
import { User } from "@/types/schema/User.schema";

export async function Navigation() {
  const me = await getMe();

  return <Header user={me.success && "data" in me ? (me.data as User) : undefined} />;
}
