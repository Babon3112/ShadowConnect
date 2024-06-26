"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  const pathname = usePathname();
  const isAuthPage = [
    "/signin",
    "/signup",
    "/verify",
    "/forgotPassword",
    "/sendForgotPasswordEmail",
  ].some((path) => pathname.startsWith(path));
  const inDashboard = pathname.startsWith("/dashboard");

  if (isAuthPage) return null;

  return (
    <nav className="absolute w-full p-4 md:p-6 shadow-md bg-[#1A1A2E] text-[#E0E0E0]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" passHref>
          <span className="text-2xl font-bold mb-4 md:mb-0 cursor-pointer hover:text-[#5D5FEF]">
            ShadowConnect
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <span className="text-[#A5A6F6] text-lg">
                Welcome, {user.username || user.email}
              </span>
              {!inDashboard && (
                <Link
                  href="/dashboard"
                  className="w-full font-semibold md:w-auto bg-[#5D5FEF] text-[#121212] hover:bg-[#4B4BCB] rounded-md py-2 px-4"
                >
                  Dashboard
                </Link>
              )}
              <Button
                onClick={() => signOut()}
                className="w-full font-bold md:w-auto border-none bg-[#5D5FEF] text-[#121212] hover:bg-[#4B4BCB] rounded-md py-2 px-4"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/signin">
              <Button
                className="w-full font-bold md:w-auto border-none bg-[#5D5FEF] text-[#121212] hover:bg-[#4B4BCB] rounded-md py-2 px-4"
                variant="outline"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
