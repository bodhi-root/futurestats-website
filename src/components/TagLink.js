import React from "react";
import {Link} from "gatsby";
const _ = require("lodash");

/**
 * Builds a Link to a tag index page.  Usage:
 * <TagLink tag="tagname">...</TagLink>
 */
export default function TagLink({tag, children}) {
  const path = "/tags/" + _.kebabCase(tag) + "/";
  return(
    <Link to={path}>{children}</Link>
  );
}
