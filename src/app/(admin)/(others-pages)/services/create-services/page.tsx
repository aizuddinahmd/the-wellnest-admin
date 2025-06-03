import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateServicesForm from "@/components/services/CreateServicesForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Services",
  description: "this is the create services page for admin",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Services" />
      <CreateServicesForm />
    </div>
  );
}
