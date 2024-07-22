"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
    <nav className="absolute w-full p-4 md:p-6 shadow-md bg-gray-900 text-gray-200 border-b-blue-950 border-b-[1px]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-2 items-center">
          <Image
            src="/shadowconnect.png"
            alt="shadowconnect"
            width={30}
            height={30}
            className="object-cover"
          />
          <Link href="/" passHref>
            <span className="text-3xl font-bold mb-4 md:mb-0 cursor-pointer text-white hover:text-blue-500 font-serif">
              ShadowConnect
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <span className="text-blue-300 text-lg">
                Welcome, {user.username}
              </span>
              {!inDashboard && (
                <Link
                  href={`/dashboard/${user.username}`}
                  className="w-full font-semibold md:w-auto bg-blue-500 text-gray-900 hover:bg-blue-600 rounded-md py-2 px-4 text-base"
                >
                  Dashboard
                </Link>
              )}
              <Button
                onClick={() => signOut()}
                className="w-full font-semibold md:w-auto border-none bg-red-500 text-white hover:bg-red-600 rounded-md py-2 px-4 text-base"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="w-full font-semibold md:w-auto bg-red-500 text-white hover:bg-red-600 rounded-md py-2 px-4 text-base"
              >
                Sign up
              </Link>
              <Link
                href="/signin"
                className="w-full font-semibold md:w-auto bg-blue-500 text-gray-900 hover:bg-blue-600 rounded-md py-2 px-4 text-base"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
