import React from "react";

//import BlogSearchWell from "./BlogSearchWell";
import BlogCategoriesWell from "./BlogCategoriesWell";
//import BlogSideWidgetWell from "./BlogSideWidgetWell";

export default function BlogSidebar() {
  return(

    <div className="col-md-4">

        {/*<BlogSearchWell />*/}
        <BlogCategoriesWell />
        {/*<BlogSideWidgetWell />*/}

    </div>
  );
}
