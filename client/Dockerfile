# Stage 1 - the build process
FROM node:10.13.0 as build-deps

# add local user for security
RUN groupadd -r nodejs \
  && useradd -m -r -g nodejs nodejs

USER nodejs

# copy local files into container, set working directory and user
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app
COPY . /home/nodejs/app

RUN yarn install

RUN yarn build

# Stage 2 - the production environment
FROM nginx:1.14

COPY --from=build-deps /home/nodejs/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]