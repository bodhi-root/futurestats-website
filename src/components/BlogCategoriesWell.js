import React from "react";
import {StaticQuery, graphql} from "gatsby";
import TagLink from "./TagLink";

/**
 * Displays a sidebar well with a list of all tags and a count
 * of how many blog entries use each tag.  This uses a StaticQuery
 * to load data.
 */
export default function BlogCategoriesWell() {
  return(
    <StaticQuery
      query={graphql`
        query {
          allMarkdownRemark(
            filter: {fields: {content: {eq: "blog"}}}
          )
          {
            nodes {
              frontmatter {
                tags
              }
            }
          }
        }
      `}
      render={function(data) {

        var tagMap = {};
        data.allMarkdownRemark.nodes.map(function(node) {
          if (node.frontmatter.tags !== undefined) {
            node.frontmatter.tags.map(function(tag) {
              if (!(tag in tagMap)) {
                tagMap[tag] = 1;
              } else {
                tagMap[tag] = tagMap[tag] + 1;
              }
            });
          }
        });

        var tagList = [];
        for (var tag in tagMap) {
          tagList.push({tag: tag, count: tagMap[tag]});
        }

        tagList.sort((a,b) => (b.count - a.count));

        const tagListLeft = [];
        const tagListRight = [];
        for (var i=0; i<tagList.length; i++) {
          if (tagListLeft.length <= tagListRight.length) {
            tagListLeft.push(tagList[i]);
          }
          else {
            tagListRight.push(tagList[i]);
          }
        }

        return(
          <div className="well blog-categories-well">
              <h4>Blog Categories</h4>
              <div className="row">
                  <div className="col-lg-6">
                      <ul className="list-unstyled">
                        {
                          tagListLeft.map((entry) => (
                            <li>
                              <TagLink tag={entry.tag}>
                              <button class="btn btn-default">
                                {entry.tag} <span class="badge">{entry.count}</span>
                              </button>
                              </TagLink>
                            </li>
                          ))
                        }
                      </ul>
                  </div>

                  <div className="col-lg-6">
                      <ul className="list-unstyled">
                        {
                          tagListRight.map((entry) => (
                            <li>
                              <TagLink tag={entry.tag}>
                              <button class="btn btn-default">
                                {entry.tag} <span class="badge">{entry.count}</span>
                              </button>
                              </TagLink>
                            </li>
                          ))
                        }
                      </ul>
                  </div>

              </div>
          </div>
        );
      }}
    />
  );
}
