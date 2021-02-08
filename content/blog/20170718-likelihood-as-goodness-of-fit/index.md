---
title: Likelihood as Goodness-of-Fit Metric
author: Dan Rogers
description: >
  Average log-likelihood is a good way to measure how well distributions fit
  a set of data. Using the average (instead of the raw log-likelihood corrects
  for errors in the more commonly used BIC and AIC measures. It also has an
  intuitive meaning that is explained in this paper.
date: 2017-07-18
image: "preview.png"
tags: [math, finance]
---

Lately, I’ve been wondering if it might be more profitable to model the distribution of stock returns rather than to produce individual point forecasts for expected returns.  The distribution of returns can be used to price options and to look for opportunities where the upside and downside potential of a stock is not correctly captured by the price of these options in the market.

Fitting different distributions to sample data is relatively simple.  There is a whole R library (fitdistrplus) to do it.  However, what is the best way to measure and compare different distributions?  The Chi-Squared distribution was introduced in college for this purpose, but the method of bucketing samples into groups is not at all appealing.  Akaike’s Information Criterion (AIC) can be used for measuring goodness-of-fit, but I have long been irritated by the way this metric changes as we change the number of observations used.  The Kolmogorov-Smirnov statistic is also an option, but while this is fun to say, I don’t know enough about it to really apply it.

The most appealing method is to use either the AIC, BIC, or even just the straight Likelihood function (upon which both of these are based) to measure goodness-of-fit.  The paper below presents a basic introduction describing how to do this and how to normalize the metric to account for changes in sample size.  It also shows how the AIC and BIC are related to this metric.  Indeed, these can be normalized to account for the number of observations used in fitting the distribution.  Each of these methods adds a penalty for the number of parameters in the model, and this penalty will vary with the number of observations, but as the sample size increases, the effect of the parameter penalties become negligible.  In the extreme, the AIC and BIC are in fact identical to just using the likelihood metric by itself.

Finally, this paper presents a way to intuitively understand and visualize the “average likelihood” metric.  Once this is understood, maximizing the likelihood function (or minimizing the AIC and BIC) is comparable to a forecast problem where we are trying to minimize the residual squared error.

I didn’t mean to write 5 pages when I started this, but it proved rather interesting.  Now, I have to get on to the hard part of actually fitting some distributions and putting some of this theory into practice!

## Attachment

* [Likelihood as a Goodness of Fit Metric.docx](Likelihood-as-a-Goodness-of-Fit-Metric.docx)
