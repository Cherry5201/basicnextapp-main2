"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getUserRoles } from "./actions";

interface ButtonGuardWrapperProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

// GLOBAL CACHE
let cachedRoles: string[] | null = null;
let rolesPromise: Promise<string[]> | null = null;

export default function ButtonGuardWrapper({ children, requiredRoles = [] }: ButtonGuardWrapperProps) {
  const { data: session, isPending } = useSession();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      setChecking(false);
      return;
    }

    const checkAuthorization = async () => {
      try {

        // if roles already fetched
        if (cachedRoles) {
          authorize(cachedRoles);
          return;
        }

        // if request already running
        if (!rolesPromise) {
          rolesPromise = getUserRoles(session.user.id);
        }

        const roles = await rolesPromise;
        cachedRoles = roles;

        authorize(roles);

      } catch (error) {
        console.error("Failed to check authorization:", error);
      } finally {
        setChecking(false);
      }
    };

    const authorize = (roles: string[]) => {
      if (requiredRoles.length === 0) {
        setIsAuthorized(true);
        return;
      }

      const hasAnyRole = requiredRoles.some(role => roles.includes(role));

      if (hasAnyRole) {
        setIsAuthorized(true);
      }
    };

    checkAuthorization();

  }, [session, isPending, requiredRoles]);

  if (isPending || checking || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
