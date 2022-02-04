# Prerequisites
Start an instance of the [CoinOS server](https://github.com/coinos/coinos-server)

    Create a new user on CoinOS app named 'coinos'
    Once user is created, click on your avatar on the top right and click on settings
    In settings, click on Auth Keys and note your JWT Token

Run the frontend dev server:

    yarn dev

Run the backend containers:

    cd server
    cp .env.sample .env
    edit the .env variable COINOS_TOKEN and set it to your JWT token from the pre-requisites step
    docker-compose up -d
