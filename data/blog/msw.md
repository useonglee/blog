---
title: 'MSW로 API 모킹하기'
date: 2022-02-22
lastmod: '2022-02-24'
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
<img src="https://user-images.githubusercontent.com/75570915/155076972-241c8add-3e68-4ee7-98ff-89c3d725fcc9.png" alt="msw 북마크 이미지" width="800" />
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
<img src="https://user-images.githubusercontent.com/75570915/155076978-794fbc28-83d4-4e00-b4c4-cf45c2b90b34.png" alt="msw 원리" width="800" />
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

  rest.post("http://localhost:5000/api/member/join", (req, res, ctx) => {
    const body = req.body;

    return res(ctx.status(200), ctx.json({ email: body?.email }));
  }),
]
```

<br />
<br />

## 인스턴스 생성

```ts
// src/mocks/browser.ts
import { setupWorker, SetupWorkerApi } from 'msw'
import { handlers } from './handlers'

export const worker: SetupWorkerApi = setupWorker(...handlers)

// src/mocks/server.ts
import { setupServer, SetupServerApi } from 'msw/node'
import { handlers } from './handlers'

export const server: SetupServerApi = setupServer(...handlers)

// src/mocks/index.ts
const mockAPI = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    const { server } = await import('./server')
    server.listen()
  } else {
    const { worker } = await import('./browser')
    worker.start()
  }
}

export default mockAPI
```

브라우저 환경에서는 `setupWorker`, 노드 환경에서는 `server`가 실행되게 해준다.

<br />
<br />

## MSW 서비스 등록하기

```
npx msw init public/ --save
```

MSW 서비스를 등록하지 않으면 mock 서비스를 실행할 수 없으니 **반드시 등록해줘야 한다.**

<br />
<br />

## MSW 사용하기

```tsx
// src/pages/index.tsx
const [allData, setAllData] = useState<dataType>([])

const executeMock = async () => {
  // 개발 환경에서만 실행되도록 환경 분기 처리를 해준다.
  if (process.env.NODE_ENV === 'development') {
    await mockAPI()
  }
}

const getData = async () => {
  await executeMock()

  const response = await axios.get('http://localhost:5000/api/data')
  setAllData(response.data)
}

useEffect(() => {
  getData()
}, [])
```

<img width="450" alt="msw get request console log value image" src="https://user-images.githubusercontent.com/75570915/155348469-8397d438-9f88-4aa6-b935-74419cf634f6.png" />

<br />

```tsx
const [email, setEmail] = useState<emailType>({})

// 중간 생략

const postData = async (reqData: emailType) => {
  await executeMock()

  const response = await axios.post(`http://localhost:5000/api/member/join`, reqData)

  setEmail(response.data)
}

useEffect(() => {
  const userLoginData = {
    email: 'useong@github.com',
    password: '123',
  }

  postData(userLoginData)
}, [])
```

<img width="500" alt="msw post request console log value image" src="https://user-images.githubusercontent.com/75570915/155349466-2fabb7bb-e68d-40ec-a2da-f776b1aa70ba.png" />

<br />
`[MSW] Mocking enabled.`가 콘솔에 찍혔다면 모킹 서비스가 정상적으로 돌아가고 있는 것이다. 그리고 mock API요청을 하면 어떤 요청을 했는지도 자세히 나온다. MSW를 간단하게 사용법만 알아 보았지만 이를 활용해 테스트 코드도 작성하며, 데이터 fetching 실패했을 때 로직까지 작성할 수 있다.

<br />
<br />

## 마무리

- 서버가 아직 API 개발이 끝나지 않았더라도 API가 존재하는 것 처럼 프론트 개발이 가능하다.
- MSW를 사용해서 mock API를 만들고 이 API로 테스트 코드 작성도 가능하다.

---

**Reference**

[https://mswjs.io/docs/#request-flow-diagram](https://mswjs.io/docs/#request-flow-diagram)<br />
[https://blog.logrocket.com/getting-started-with-mock-service-worker](https://blog.logrocket.com/getting-started-with-mock-service-worker/)
