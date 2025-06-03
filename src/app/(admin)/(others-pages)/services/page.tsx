import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ServicesCard } from "@/components/services/ServicesCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Services",
  description: "this is the services page for admin",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Services" />
      <ServicesCard />
    </div>
  );
}
