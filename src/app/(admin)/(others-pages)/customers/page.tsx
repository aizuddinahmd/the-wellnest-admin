import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "This is Customers page for The WellNest Admin Dashboard Template",
  // other metadata
};

export default function Customers() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Customers" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
