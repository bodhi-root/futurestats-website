---
title: "Building a Forecast API in Python+R"
author: Dan Rogers
description: >
  Walks through the details of creating a web API in Python that invokes
  a forecasting function in R.  The web API is written in Flask with gunicorn
  used for production scaling and containerized using docker.
date: 2020-03-03
image: "preview.png"
tags: ["software development", "flask", "python", "r", "docker", "gunicorn"]
---

## Intro

Ever since reading [this article](http://www.unofficialgoogledatascience.com/2017/04/our-quest-for-robust-time-series.html) from Google's "Unofficial Data Science Blog" I've wanted to build a simple time series API.  Nothing too fancy... just an API that takes a univariate time series and returns a forecast.  I have some decent time series code already written in R, and I decided to try to expose this through a Python Flask web app.  This page will document my learnings.

## Flask API Basics

I started by writing a basic Flask API app.  This wasn't too tricky.  I created a single endpoint named "/forecast/api/v1/forecast" which consumes the following JSON message:

```
{
  "x": [1, 2, 0, 2.5, ...],
  "h": 28,
  "freq": 7
}
```

and returns a response:

```
{
  "forecast": [...]
}
```

In the request message "x" is the time series to predict, "h" is the forecast horizon, and "freq" is the frequency for seasonal data.  (I'm still debating whether to keep "freq" in there.  I don't like it, and would rather specify "monthly", "hourly", "daily" and let the algorithm search for seasonal patterns.)

For the first pass at this, I just returned a forecast that was all 1's.  The Flask code to accomplish this is:

___File: src/app.py___

```
from flask import Flask, jsonify, request, make_response
import werkzeug.exceptions as exceptions

app = Flask(__name__)

@app.errorhandler(exceptions.HTTPException)
def on_exception(e):
    """Handles all werkzeug exceptions by returning a simple JSON object
    with the error message"""
    return make_response(jsonify({'error': e.description}), e.code)

@app.route('/forecast/api/v1/forecast', methods=['POST'])
def get_tasks():

    x = None
    h = 3
    freq = 1

    if not request.json:
        raise exceptions.BadRequest("Request missing JSON body")
    if 'x' not in request.json:
        raise exceptions.BadRequest("JSON request missing required property 'x'")
    else:
        x = request.json['x']

    # optional properties:
    if 'h' in request.json:
        h = int(request.json['h'])
    if 'freq' in request.json:
        freq = int(request.json['freq'])

    forecast = [1] * h
    return jsonify({
            'forecast': forecast
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
```

The only tricky parts of this were:

* The 'on_exception' method I setup to handle exceptions (using the werkzeug.exceptions library).  This was necessary since the default Flask app returns HTML pages on errors, and we'd prefer an API to return JSON.  The code above returns a simple JSON message on errors along with the appropriate HTTP error code.
* The change in "app.run()" to set "host" to "0.0.0.0".  This wasn't setup this way in most of the online docs, but it turned out to be necessary if I run my app from inside docker.

Speaking of docker, here's the Dockerfile and Python requirements file that build a container for this app:

___File: Dockerfile___

```
FROM python:3.7-alpine

COPY requirements.txt /
RUN pip install -r /requirements.txt

COPY src/ /app/src
WORKDIR /app

CMD ["python", "-m", "src.app"]
```

___File: requirements.txt___

```
flask==1.0.2
Werkzeug==1.0.0
```

I can run this container locally with:

___File: run.bat___

```
set WORK_DIR=C:\Users\dr21060\Documents\Workspace\Futurestats\forecast-api

docker run --rm -it ^
  -p 5000:5000 ^
  --entrypoint /bin/sh ^
  --mount "type=bind,source=%WORK_DIR%,target=/app,consistency=consistent" ^
  -w /app ^
  forecast-api:1.0
```

and then in the container run:

```
python -m src.app
```

Then I can hit the endpoint with:

___File: test.sh___

```
curl -i \
  -H "Content-Type: application/json" \
  -X POST \
  -d @test.json \
  http://localhost:5000/forecast/api/v1/forecast
```

and the sample message:

___File: test.json___

```
{
  "x": [1, 2, 3, 2, 3, 2, 2.5, 7]
}
```

So far, we're off to a good start!  The next steps will be to:

1. Run the Flask app through "gunicorn" (since Flask is not supposed to be used by itself in production)
2. Call out to R to generate the forecast

Both of these will introduce complexity over the simple Flask app in Python, so I wanted to document what I have so far.

## Flask with gunicorn

Flask is not intended to be run as a production app server.  In fact, if you try to do it, it will print an error telling you it should not be used this way.  In Python, your web app program is separated from your web app server in a similar manner to how Java where the servlet API defines an application interface that can be run on multiple types of web server.  The equivalent Python spec is WSGI (web server gateway interface).  gunicorn is a frequently-used server for these purposes.

Understanding why Flask is not a great production app and why gunicorn is will help us when we write programs (especially in the next section when we integrate with R).  A Flask app is designed to only handle one request at a time and to run in a single-threaded environment (like most Python apps).  This design might seem too basic and limiting at first, but this is where gunicorn comes in.  gunicorn takes on the task of running multiple worker processes that can handle much larger request volume.  In order to this it just needs a "handle" to the Python web app that it needs to run.  All of the complicated multi-threading or multi-processor support can then be handled by gunicorn outside of your Flask app - giving you much less to worry about.  As we will see when we start integrating with R, not having to worry about multi-threading or resource contention within our Flask app is actually a great thing.

In order to add gunicorn to our app we first need to add the WSGI "handle" that gunicorn will run.  This is a simple file that looks like:

___File: wsgi.py___

```
from src.app import app

if __name__ == "__main__":
    app.run()
```

This is the basic web app program that gunicorn can then run in parallel in a multi-process architecture.  We add gunicorn simply by updating our requirements.txt file:

```
requirements.txt
flask==1.0.2
Werkzeug==1.0.0
gunicorn==20.0.4
```

and then updating the Dockerfile to:

```
FROM python:3.7-alpine

COPY requirements.txt /
RUN pip install -r /requirements.txt

COPY src/ /app/src
COPY wsgi.py /app/    # <- don't forget copy over the new file

WORKDIR /app

CMD gunicorn -w 1 --bind 0.0.0.0:5000 wsgi:app
```

The gunicorn command specifies 1 worker process ("-w 1).  This can be increased in production to support larger workloads, but since we don't know where our container will run, we can't really set that here.  The "--bind" parameter listens to port 5000 and "wsgi:app" indicates that we should load the "wsgi.py" file and run the app named "app" inside there.

> NOTE: The gunicorn docs recommend setting the number of workers to "2n + 1" where "n" is the number of processors on your machine.  They emphasize that you should not set this to the number of concurrent requests you want to support.  Having too many workers (as compared to your CPUs) could actually slow down your server.  The recommended setting of "2n + 1" running on multiple CPUs should be able to handle thousands of requests per second.

## Calling R from Python

The "rpy2" library can be used to call R from Python.  This proved a little tricky to setup and use, but eventually it worked.  I began with an R script named "m4_baselines.R".  This contains a simple function:

```
f_ses <- function(x, h) {
  ...
}
```

"x" is a time series object and "h" is the forecast horizon.  On my laptop, I was able to initialize rpy2, source this file, and call this function with:

```
import os
os.environ["R_HOME"] = "C:\\Program Files\\R\\R-3.5.2"
os.environ["R_LIBS"] = "C:\\Users\\dr21060\\Documents\\R\\win-library\\3.5"

import rpy2.robjects as robjects
R = robjects.r
R.source('R/m4_baselines.R')

v_forecast = R('f_ses(ts(c(1,2,3,2,3,2,1,3,2.5), frequency=1), h=28)')
forecast = list(v_forecast)
```

According to the rpy2 docs, I should be able to call this with:

```
x = [1,2,3,2,3,2,1,3,2.5]
freq = 1
h = 28

x_ts = R.ts(x, frequency=1)
v_forecast = R.f_ses(x_ts)
```

However, this threw an error.  Instead of messing with it for too long, I decided to just pass in the vector as text.  The more generic version of the earlier code looked like this:

```
x = [1,2,3,2,3,2,1,3, 2.5]
freq = 1
h = 28

x_txt = "c(" + ",".join([str(elem) for elem in x]) + ")"
r_code = 'f_ses(ts({}, frequency={}), h={})'.format(
        x_txt,
        freq,
        h)

v_forecast = R(r_code)
forecast = list(v_forecast)
```

This code could be plugged straight into our Python function in the Flask app to produce a forecast.

The next thing to do was setup our Docker container to not only install rpy2 (version 2.9.4) but to also install R and the libraries needed by our script (in this case just "forecast").  After playing around with a few different docker options, I ended up using the "python:3.7-buster" base image for Python and installing R into this.  (This proved to be easier than starting with the Ubuntu 16.04 image we typically use and having to install both Python and R.)  The new Dockerfile looked like this:

___File: Dockerfile___

```
FROM python:3.7-buster

### Base R ####################################################################

RUN echo "Installing R Base..." \
  && apt update \
  && apt install -y software-properties-common \
  && apt-key adv \
     --keyserver keys.gnupg.net \
     --recv-key 'E19F5F87128899B192B1A2C2AD5F960A256A04AF' \
  && add-apt-repository \
     'deb http://cloud.r-project.org/bin/linux/debian buster-cran35/' \
  && apt update \
  && apt install -y r-base

### App Dependencies ##########################################################

RUN echo "Installing system dependencies for 'forecast'..." \
  && apt install -y --no-install-recommends \
     libcurl4-openssl-dev

COPY install.R /
RUN echo "Installing R packages..." \
  && Rscript /install.R

COPY requirements.txt /
RUN pip install -r /requirements.txt

### App Code ##################################################################

COPY src/    /app/src
COPY R/      /app/R
COPY wsgi.py /app/

WORKDIR /app

CMD gunicorn -w 1 --bind 0.0.0.0:5000 wsgi:app
```

The "install.R" script referenced in the Dockerfile is a file we've used in other projects to install R libraries and exit with a non-zero exit code in the event of failure (so that the Docker build fails too).  In this case it is simply:

___File: install.R___

```
install <- function(pkgs, ...) {
  install.packages(pkgs, ...)

  for (pkg in pkgs) {
    if (!require(pkg, character.only=TRUE)) {
      cat(paste0("Error installing package: ", pkg, "\n"))
      quit(save="no", status=100)
    }
  }
}

install("forecast")
```

This was about it.  Now we just needed to put our rpy2 code into our Flask app.  The one thing we did have to change was the location of R to point to its location in the docker container.  We added lines at the beginning of the "app.py" code file to define R_HOME and R_LIBS appropriately for the docker container.  In hindsight it would probably have been better to set these in the Dockerfile and pass them in to the Python code, but we can save that improvement for another time.

For completeness, the new "app.py" code file is below:

___File: app.py___

```
from flask import Flask, jsonify, request, make_response
import werkzeug.exceptions as exceptions

import os
os.environ["R_HOME"] = "/usr/lib/R"
os.environ["R_LIBS"] = "/usr/local/lib/R/site-library"

import rpy2.robjects as robjects
R = robjects.r
R.source('R/m4_baselines.R')

app = Flask(__name__)

@app.errorhandler(exceptions.HTTPException)
def on_exception(e):
    """Handles all werkzeug exceptions by returning a simple JSON object
    with the error message"""
    return make_response(jsonify({'error': e.description}), e.code)

@app.route('/forecast/api/v1/forecast', methods=['POST'])
def get_tasks():

    x = None
    h = 3
    freq = 1

    if not request.json:
        raise exceptions.BadRequest("Request missing JSON body")
    if 'x' not in request.json:
        raise exceptions.BadRequest("JSON request missing required property 'x'")
    else:
        x = request.json['x']

    # optional properties:
    if 'h' in request.json:
        h = int(request.json['h'])
    if 'freq' in request.json:
        freq = int(request.json['freq'])

    x_txt = "c(" + ",".join([str(elem) for elem in x]) + ")"
    r_code = 'f_ses(ts({}, frequency={}), h={})'.format(
            x_txt,
            freq,
            h)

    v_forecast = R(r_code)
    forecast = list(v_forecast)

    return jsonify({
            'forecast': forecast
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
```

It probably would have been better to set "R_HOME" and "R_LIBS" in the docker container rather than in our code, but since our code is written specifically to be deployed in this Docker container I wasn't too worried about it.

## Links

* https://www.digitalocean.com/community/tutorials/how-to-install-r-on-debian-10
