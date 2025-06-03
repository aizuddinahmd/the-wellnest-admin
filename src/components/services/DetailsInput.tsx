"use client";
import React from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";

export default function DefaultInputs() {
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
    <ComponentCard title="Service Details">
      <div className="space-y-6">
        <div>
          <Label>Name</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Description</Label>
          <Input type="text" placeholder="Enter description" />
        </div>
        <div>
          <Label>Category</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Select an option"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
