---
title: 'MSW로 API 모킹하기'
date: 2022-02-22
lastmod: '2021-02-22'
tags: ['개발', 'front-end']
draft: false
summary: '서버가 아직 API 개발중이라면? MSW로 API 모킹하기!!'
layout: PostSimple
type: blog
---

<TOCInline toc={props.toc} exclude="목차" toHeading={2} />

<br />
<br />

<center>
<img src="https://user-images.githubusercontent.com/75570915/155076972-241c8add-3e68-4ee7-98ff-89c3d725fcc9.png" alt="msw" width="800px" />
</center>

<br />
<br />

## 서버 API가 개발 중이라면?

실무에서 프론트 개발을 해야 하는데 서버 API가 아직 개발 중인 경우가 있다. 이럴때 당황하지 않고 MSW를 사용해서 백엔드 디펜던시 없이 우아하게 개발을 해보자.

MSW는 가상 서버를 만들어서 실제 API 요청을 하는 것 처럼 개발을 할 수 있게 도와주는 라이브러리이다. 심지어 사용법까지 매우 간단해서 프론트 개발을 할 때 정말 요긴하게 잘 쓰고 있다. 그리고 노드 환경과 브라우저 환경을 지원하기 때문에 MSW를 통해 테스트 작업 또는 지금 하고자 하는 서버 API 모킹 작업까지 할 수 있다.

<br />
<br />

## MSW 원리

<center>
<img src="https://user-images.githubusercontent.com/75570915/155076978-794fbc28-83d4-4e00-b4c4-cf45c2b90b34.png" alt="msw" width="800px" />
</center>

<br />
<br />

먼저 브라우저 환경에서 MSW를 알아보자.

**브라우저 환경**에서는 Request Handler를 등록하고 mock 서버에 API를 요청하면 MSW는 Service Worker API를 통해 해당 네트워크 요청을 가로채서 mock 응답(Mocked response)을 내려준다.

이러한 원리 때문에 MSW를 사용하면 프론트 개발을 할 때 `data fetching` 코드는 mock 사용 여부와 상관없이 똑같이 작성할 수 있다.

즉, 실제 API를 요청하는 코드와 mock 서버 API 요청하는 로직을 똑같이 작성해도 된다. 그리고 데이터를 요청하는 엔드 포인트만 서버 API 개발이 완료되었을 때 수정해주면 된다. **그래서 실제 API가 있는 것 처럼 개발을 할 수 있다.**

Service Worker는 브라우저가 아닌 환경에서는 돌아가지 않기 때문에 MSW가 자체적으로 node-request-interceptor 라이브러리를 통해 native http, htpps, XMLHttpRequest 모듈을 확장해서 **노드 환경**도 지원한다. 때문에 MSW를 테스트 목적으로도 사용할 수 있다.

> tip: MSW를 사용해서 mock API를 만들고 동시에 테스트도 할 수 있다.

<br />
<br />

## MSW 설치

```
npm i -D msw
or
yarn add -D msw
```

<br />
<br />

## Mock Handler 정의

```ts
// src/mocks/handler.ts

import { rest } from 'msw'

export const handlers = [
  rest.get('http://localhost:5000/api/data', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, data: '1' },
        { id: 2, data: '2' },
      ])
    )
  })

  rest.post('http://localhost:5000/api/2/data', (req, res, ctx) => {
    const page = req.body.page;

    return res(
      ctx.status(200),
      ctx.json([
        { id: 2, page: page, data: "2" },
      ])
    )
  }),
]
```

<br />
<br />

## 인스턴스 생성

```ts
// src/mocks/browser.ts
import { setupWorker, SetupWorkerApi } from 'msw';
import { handlers } from './handlers';

export const worker: SetupWorkerApi = setupWorker(...handlers);

// src/mocks/server.ts
import { setupServer, SetupServerApi } from 'msw/node';
import { handlers } from './handlers';

export const server: SetupServerApi = setupServer(...handlers);

// src/mocks/index.ts
const mockAPI = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();
  } else {
    const { worker } = await import('./browser');
    worker.start();
  }
};

export default mockAPI;
```

<br />
<br />

## MSW 서비스 등록하기

```
npx msw init public/ --save
```

<br />
<br />

## MSW 사용하기

```tsx
// src/pages/index.tsx
const [allData, setAllData] = useState([]);
const [pageData, setPageData] = useState([]);
const PAGE = '2';

const executeMock = async () => {
  if (process.env.NODE_ENV === 'development') {
    await mockAPI();
  }
};

const getData = async () => {
  await executeMock();

  const response = await axios.get('http://localhost:5000/api/data');
  setAllData(response.data);
};

const postData = async (page: string) => {
  await executeMock();

  const response = await axios.post(
    `http://localhost:5000/api/${PAGE}/data`,
    page,
  );
  setPageData(response.data);
};

useEffect(() => {
  getData();
  postData(PAGE);
}, []);
```

---

**Reference**

[https://mswjs.io/docs/#request-flow-diagram](https://mswjs.io/docs/#request-flow-diagram)<br />
[https://blog.logrocket.com/getting-started-with-mock-service-worker](https://blog.logrocket.com/getting-started-with-mock-service-worker/)
