"use client";

import React from "react";
import JobListingPage from "./JobListingPage";
import { Navbar } from "@/components/General/Navbar";
import { useColors } from "@/components/General/(Color Manager)/useColors";

const JobsV1 = () => {

    const Colors = useColors();
  return (
      <div className="flex-1">
        <JobListingPage />
      </div>
  );
};

export default JobsV1;