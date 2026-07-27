import GlobalStoreProvider from "@/components/ui/Application/GlobalStoreProvider";
import Footer from "@/components/ui/Application/website/Footer";
import Header from "@/components/ui/Application/website/Header";
import MobileBottomNav from "@/components/ui/Application/website/MobileBottomNav";

import { Jost } from "next/font/google";
import React from "react";
import { ToastContainer } from "react-toastify";

// Import MetaPixel
import MetaPixel from "@/lib/MetaPixel";
import { connectDB } from "@/lib/databaseconnection";
import FBTrackingSetting from "@/models/FbTrackingSetting.model";
import LiveOrderWidget from "@/components/ui/Application/website/LiveOrderWidget";

const jost = Jost({
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jost",
});

const Layout = async ({ children }) => {
  await connectDB();

  let settings = await FBTrackingSetting.findOne().lean();

  if (!settings) {
    const newSettings = await FBTrackingSetting.create({
      meta: {
        enabled: true,
        pixelId: "",
        accessToken: "",
        testEventCode: "",
      },
    });

    settings = JSON.parse(JSON.stringify(newSettings));
  }

  const plainSettings = JSON.parse(JSON.stringify(settings));

  return (
    <GlobalStoreProvider>
      <div className={jost.className}>
        <MetaPixel settings={plainSettings} />

        <Header />

        <main>{children}</main>

        {/* Live Order Floating Widget */}
        <LiveOrderWidget />

        <ToastContainer position="top-right" autoClose={3000} newestOnTop />

        <Footer />

        <MobileBottomNav />
      </div>
    </GlobalStoreProvider>
  );
};

export default Layout;
