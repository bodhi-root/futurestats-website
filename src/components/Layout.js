import React from "react";
import MainNavBar from "./MainNavBar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div>
      <MainNavBar />
      {children}
      <Footer />
    </div>
  )
}
