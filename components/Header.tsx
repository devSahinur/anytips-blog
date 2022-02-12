import Link from "next/link";
import React from "react";

function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            className="w-44 object-contain cursor-pointer"
            src="https://i.ibb.co/5s8cBwL/anytips-logo-black.png"
            alt=""
          />
        </Link>
        <div className="hidden md:inline-flex items-center space-x-5">
          <h3 className="cursor-pointer">About</h3>
          <h3 className="cursor-pointer">Contact</h3>
          <h3 className="text-white cursor-pointer bg-green-600 px-4 py-1 rounded-full">
            Follow
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-green-600">
        <h3 className="cursor-pointer">Sign In</h3>
        <h3 className="border px-4 py-1 rounded-full border-green-600 hover:bg-green-600 hover:text-white cursor-pointer">
          Get Started
        </h3>
      </div>
    </header>
  );
}

export default Header;
