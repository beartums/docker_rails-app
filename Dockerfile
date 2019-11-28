FROM starefossen/ruby-node:2-10-stretch
RUN apt-get update -qq && \
    apt-get install -y nano build-essential libpq-dev && \
    gem install bundler
RUN mkdir /project && cd project
COPY Gemfile Gemfile.lock /project/
WORKDIR /project
RUN bundle install && yarn install --check-files
COPY . /project