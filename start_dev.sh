#!/bin/bash

sudo MONGOHQ_URL="mongo://localhost:27017/test?autoreconnect=true" google2id="264229871307.apps.googleusercontent.com" google2secret="Ml_2qittzM6hVJD-XyfkUKsb" ENV="dev" PORT=80 foreman start