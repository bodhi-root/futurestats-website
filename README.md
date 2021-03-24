# Futurestats Website

## Design Notes

The template used for this website was [Start Bootstrap](http://startbootstrap.com/) - [Modern Business](http://startbootstrap.com/template-overviews/modern-business/).

NOTE: They updated to Boostrap v4 (which does look beter).  To view the old v3.3.7 web site you'll need to go to the following commit in GitHub:

* https://github.com/StartBootstrap/startbootstrap-modern-business/tree/f2612d3dab6a9741d21d31fbd51a35737fbd024f

The blog portion of this was designed using the [Gatsby starter blog](https://github.com/gatsbyjs/gatsby-starter-blog).  Some modifications inspired by [this post](https://www.jerriepelser.com/blog/sorting-out-gatsby-folder-structure/) were made.

Adding tags with [this site](https://dennytek.com/blog/personal-site-with-gatsby-part-7).

## Local Testing

You can test with:

```
gatsby develop
```

## Production Build

When building for production, use the following to build and then preview the
website locally:

```
gatsby clean
gatsby build --prefix-paths
gatsby serve --prefix-paths
```

If everything looks good you can push to production with:

```
gsutil rsync -Rd public gs://futurestats-website/
```

NOTE: The ```-d``` option deletes any files in the remote storage that do not
appear locally.  Make sure you are doing this in the right destination.
