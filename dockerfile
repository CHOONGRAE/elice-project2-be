FROM node:lts

WORKDIR /usr/src/app

RUN npm i pm2 -g

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

# vm이 작아서 빌드가 안되면, swap 한 5g 설정후 다음 줄 주석 해제, 널널하게 세팅한거.....
# RUN export NODE_OPTIONS=--max_old_space_size=4000 && npm run build

# vm이 작아서 윗줄 주석 해제 하였다면 아랬줄은 주석 설정!
RUN npm run build

# 해당 파일들이 빌드시 안따라 가는 경우가 있어서 강제로 한번더 복사!
COPY ./src/mailer/templates ./dist/mailer/templates

EXPOSE 5000
EXPOSE 5050

ENV NODE_ENV=production

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]