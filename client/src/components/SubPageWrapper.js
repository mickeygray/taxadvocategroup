import React from "react";
import { useParams } from "react-router-dom";
import subPageData from "../data/subPageData";
import SubPage from "./SubPage";

const SubPageWrapper = () => {
  const { category, slug } = useParams();
  const pageKey = `${category}/${slug}`;

  const pageData = subPageData[pageKey];

  // If page data is not found, return a 404 page
  if (!pageData) {
    return (
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>Page Not Found</h1>
    );
  }

  return <SubPage {...pageData} />;
};

export default SubPageWrapper;
