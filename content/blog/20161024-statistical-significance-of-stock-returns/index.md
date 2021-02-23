---
title: Statistical Significance of Stock Returns
author: Dan Rogers
description: >
  This analysis looks at whether stock returns are statistically significant
  or if they are essentially random noise.  When looking at just a year or
  two's worth of data the returns do in fact appear indistinguishable from
  random noise.  Over a five year period, more stocks meet the requirement for
  statistical significance but a large part of the market still looks like
  random noise.
date: 2016-10-24
image: "daily-returns.png"
tags: [finance, stock market]
---

## Overview

The attached paper is an examination of whether stock returns are statistically significant.  That is, if you see a stock returns 8% one year, does that really mean anything?  [Prior analysis](20161003-persistance-of-stock-returns-and-volatility/) showed that stock returns are not persistent from year to year.  This analysis goes further and suggests that stock returns from a single year are essentially indistinguishable from random noise.

## Sample Charts

The chart below shows average daily stock returns versus standard deviations for 500 stocks in 2015:

![Daily Returns](daily-returns.png)

Only 5% of these stocks had returns that were statistically significant using a p-value of 10%.  This is interesting because with p=10% we would expect 10% of the stocks to meet this criteria just due to randomness.

The chart below shows how random noise produces essentially the same plot, but with even more statistically significant results than what we see in the actual stock market:

![Random Noise](random-noise.png)

If we extend the period of time we examine, we do start to see better signs of statistical significance.  The chart below shows average daily returns versus volatility over 2-years:

![Daily Returns - Two Years](daily-returns-two-years.png)

About 12% of returns are now marked as statistically significant, and most of these are on the positive side.

If we extend the period of time to 5-years 39% of stocks now have statistically significant returns:

![Daily Returns - Five Years](daily-returns-five-years.png)

The conclusion is that returns with a single year are indistinguishable from random noise.  What looks like a good stock with an 8% return might actually just be a stock that averages 0% over the long term but which had a good year.  Over longer time horizons, solid performers start to emerge, but a large percentage of the stock market still looks essentially like random noise.

## Attachments

* [Statistical-Significance-of-Returns.pdf](20161024-Statistical-Significance-of-Returns.pdf)
