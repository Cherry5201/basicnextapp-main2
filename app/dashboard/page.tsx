import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-gray-900">
      
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Welcome Home
      </h1>

      {/* BUTTONS SECTION */}
      <div className="flex gap-4">
        
        <Link href="/uom">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            UOM
          </button>
        </Link>

        <Link href="/testcategories">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Categories
          </button>
        </Link>

        <Link href="/medicaltests">
          <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Medical Tests
          </button>
        </Link>

      </div>
    </div>
  );
}