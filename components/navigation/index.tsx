import { getMe } from "@/requests/auth.request";
import { Header } from "./_components/header";
import { User } from "@/types/schema/User.schema";

/**
 * Asynchronously renders the navigation header with the current user information if available.
 *
 * Passes the authenticated user to the {@link Header} component if user data is successfully fetched; otherwise, passes {@link undefined}.
 */
export async function Navigation() {
  const me = await getMe();

  return <Header user={me.success && "data" in me ? (me.data as User) : undefined} />;
}
