---
title: "P/E Ratios and S&P 500 Returns"
author: Dan Rogers
description: >
  A simple regression of S&P 500 results compared with levels of Shiller's P/E
  ratio shows that there is a strong correlation between long-term returns
  and P/E ratios.  The results are strongest at the 24-, 30-, 36-, and 42-month
  range.  At current P/E levels (28.96) the models we build actually predict
  a negative return of about 2.5% over the next couple of years.
date: 2017-08-13
image: "cnbc-chart.png"
tags: [finance, stock market]
---

## Overview

This paper examines the relationship between the Shiller P/E Ratio and future returns on the S&P 500.  It was inspired by this chart from a [CNBC article](https://www.cnbc.com/2017/07/31/theres-a-99-percent-chance-stock-market-returns-will-be-subpar-from-here.html):

![CNBC Chart](cnbc-chart.png)

My own analysis dove deeper into these results, looking at different return horizons to see where this model was most applicable. As seen in the charts below, the relationship is strongest when predict 24-month, 30-month, 36-month, and 42-month results.

![My Charts](charts.png)

The exact results of the regression along with the R-squared for each of the time horizons is shown below:

![Regression Results](regression-results.png)

At the current P/E levels of 28.96 these models would predict the following future-looking returns:

* 18-month: -4.11%
* 24-month: -3.04%
* 30-month: -2.50%
* 36-month: -1.30%
* 42-month: -1.32%

Despite being very simple, this may be one of the more important analyses I have ever done.

## Attachments

[20170813-PE-Ratios-and-SP500-Returns.pdf](20170813-PE-Ratios-and-SP500-Returns.pdf)
