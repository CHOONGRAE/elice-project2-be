## Description

엘리스 SW5기 최종 프로젝트 11팀 당장손민수  
백엔드 입니다. api명세는 swagger를 이용하여 작성하였습니다.

실행후 localhost:{PORT}/api-docs 로 접속시 확인 할 수 있습니다.  
http 접근 보안을 걸어 놓았습니다.  
기본 ID/PWD 는  
ID: thief  
PWD: sonminsu  
입니다.

## 환경변수 - 엘리스 제공 vm 닫히면 지울거에요

PORT=5000  
SOCKET_PORT=5050  
HOST=http://localhost

DATABASE_URL=postgresql://sonminsu:rhlehthsalstn@146.56.143.108:5432/thief

REDIS_HOST=146.56.143.108  
REDIS_PORT=6389  
REDIS_PASSWORD=rhlehthsalstn

MAILER_SERVICE=gmail  
MAILER_EMAIL=theif.minsu.son@gmail.com  
MAILER_PASSWORD=yzweczjnquicpaon

S3_REGION=ap-northeast-2
S3_ACCESS_KEY=AKIARFYLOEWQTEKEWOVQ
S3_SECRET_KEY=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
S3_BUCKET_NAME=thief-sonminsu-bucket

KAKAO_KEY=447f662d5d88aea44db745ae6b5214ca
KAKAO_SECRET=BdgaJU6VYdQhc29ntWk9mqMxAKByN3la

GOOGLE_CLIENT_ID=107582580282-juunfb5j33sqrm5fmvaevgo4t1lkco25.apps.googleusercontent.com  
GOOGLE_SECRET=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

SWAGGER_USER=thief  
SWAGGER_PASSWORD=sonminsu

## Installation

```bash
# development
$ npm ci

# deploy as docker
$ sudo docker build -t {name} .
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

Elice SW5 Project2 Team11.

Nest is [MIT licensed](LICENSE).
