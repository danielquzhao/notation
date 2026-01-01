# Use official Ruby image
FROM ruby:4.0.0-slim

# Install system dependencies including LaTeX
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    libyaml-dev \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-xetex \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install Ruby dependencies
RUN bundle install

# Copy the entire app
COPY . .

# Expose port
EXPOSE 3000

# Start the Rails server
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
