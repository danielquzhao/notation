# Use official Ruby image
FROM ruby:4.0.0-slim

# Install system dependencies including LaTeX
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    libyaml-dev \
    texlive-full \
    texlive-latex-extra \
    && rm -rf /var/lib/apt/lists/*

# Update LaTeX package manager and install required packages
# RUN tlmgr update --self && \
#     tlmgr install tcolorbox pgf etoolbox environ trimspaces amsmath xcolor geometry

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
