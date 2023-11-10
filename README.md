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

DATABASE_URL=

REDIS_HOST=  
REDIS_PORT=  
REDIS_PASSWORD=

MAILER_SERVICE= 
MAILER_EMAIL=
MAILER_PASSWORD=

S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET_NAME=

KAKAO_KEY=
KAKAO_SECRET=

GOOGLE_CLIENT_ID= 
GOOGLE_SECRET=

SWAGGER_USER=  
SWAGGER_PASSWORD=

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
