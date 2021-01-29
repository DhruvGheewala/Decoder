############################################################
# Dockerfile to build sandbox for executing user code
# Based on Ubuntu
############################################################

FROM chug/ubuntu14.04x64

RUN apt-get update

# Languages
RUN apt-get install -y gcc
RUN apt-get install -y g++

# prepare for Java download
RUN apt-get install -y python-software-properties
RUN apt-get install -y software-properties-common

# grab oracle java (auto accept licence)
RUN add-apt-repository -y ppa:webupd8team/java
RUN apt-get update
RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN apt-get install -y oracle-java8-installer

# Node
RUN apt-get install -y npm
RUN apt-get install -y nodejs
# RUN npm install -g underscore request express jade shelljs passport http sys jquery lodash async mocha moment connect validator restify ejs ws co when helmet wrench brain mustache should backbone forever  debug && export NODE_PATH=/usr/local/lib/node_modules/

RUN npm install
RUN npm run server