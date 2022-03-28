---
title: "Refresh Token 어떻게 관리하고 있나요?"
date: 2022-03-28
lastmod: "2022-03-28"
tags: ["개발", "front-end"]
draft: false
summary: "Refresh Token 그리고 슬라이딩 세션(Sliding Sessions) 전략"
layout: PostSimple
type: blog
---

<TOCInline toc={props.toc} exclude="목차" toHeading={2} />

<br />

## 들어가며

취업하기 전 작년 6월 팀 프로젝트를 진행했을 때 로그인 구현을 한 적이 있었는데, 이 때 refresh token 관리에 대해서 모든 팀원이 애먹은 기억이 있다. 그 당시 token을 어떻게 효율적으로 처리해야 하는지 방법을 전혀 몰랐고, 프로젝트 기간은 막바지에 도달하고 있을 때였다. 결국 `setInterval` 함수를 사용해서 임시방편으로 해결한 기억이 있다. (이것 또한 추억이다...😭)

```js
useEffect(() => {
  // 대략 2주에 한 번 refresh token을 요청하도록 구현
  setInterval(() => {
    refreshRequest();
  }, 1500000);
}, [isLoginSuccess]);
```

팀 프로젝트가 끝나고, 이 문제를 해결하지 못한 채 취업을 했다. 그러나 회사 코드를 보고 난 후 자연스럽게 이 문제의 해결책을 알 수 있었다. 처음 입사했을 때 회사 코드를 보면서 프로젝트들을 최대한 이해를 하고 있었는데 우연히 회사 컨플루언스에서 Sliding Sessions 라는 글을 우연히 마주하게 됐고, Refesh Token과 슬라이딩 세션 전략을 같이 활용하는 방법에 대해 알게 됐다. 이후 회사 신규 프로젝트에서 이 전략을 그대로 도입했고 조금 더 효율적인 방법으로 refresh token을 관리할 수 있게 됐다.

<br />

## Refresh Token 그리고 슬라이딩 세션(Sliding Sessions) 전략

먼저 refresh token은 어떻게 쓰이는지 알아볼 필요가 있다. 사용자가 로그인을 하면 서버에서 access token을 발행해준다. 이후 사용자가 앞으로 모든 리소스 요청에 대한 행동을 access token을 통해 서버에서 인증을 받은 후 리소스에 접근을 하게 된다. 하지만 보통 access token은 만료 시간이 30분 ~ 1시간 정도로, 짧은 유효 시간을 가진다. 이때 필요한 것이 refresh token이다. refresh token는 2주에서 한달이라는 비교적 긴 유효 시간을 가진다. 그래서 access token이 만료되는 시점에 refresh token를 이용해서 access token을 다시 재발급 받는다.

그러면 왜 access token, refresh token 두 가지 토근을 활용해야 할까? 바로 토큰 탈취의 문제때문이다. JWT의 방식때문이기도 하다. 토큰을 사용자 측에서 관리하고 있으므로, access token은 비교적 짧은 유효 기간을 권장하고, access token은 오로지 refresh token으로만 재발행할 수 있게 하는 것이다.

하지만 access token과 refresh token만으로는 인증 만료 기간을 자동으로 연장시킬 수 없다. 그래서 자동으로 인증 만료 기간까지 계속 연장시키면서 로그인 상태를 지속적으로 유지시키는 방법이 바로 access token, refresh token + 슬라이딩 세션 전략이다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/160385260-76980c52-a467-491a-9ccb-7e9b4ffd6000.png" alt="슬라이딩 세션 이미지" width="700" />
</center>

access token, refresh token + 슬라이딩 세션(Sliding Sessions) 전략은 refresh token의 만료 기간을 연장시키는 전략이다. 유저가 로그인을 통해 발급받은 토큰들은 유효 기간이 지나면 그 세션은 비활성화가 된다. 이때 다시 새로운 토큰을 발급받아야 하는데 재 로그인을 통해서 발급받는 것이 아니라, 자동으로 발급받는 방식이 슬라이딩 세션을 이용한 전략이다. 위 사진을 보면 세션들이 슬라이딩 하는 것 처럼 자연스럽게 이어져가고 있는데 저런 방식을 뜻한다.

<br />

## 구현 원리

<center>
<img src="https://user-images.githubusercontent.com/75570915/160385555-d954529a-047b-4d3a-9c82-518b50eebb77.png" alt="" width="700" />
</center>

자동으로 refresh token의 만료 기간을 연장시킨다. 그러면 도대체 어떻게 재 로그인 없이 토큰을 연장시켜서 로그인 상태를 유지시킬까? access token이 만료 되는 시점으로 가보자. access token이 만료되면 refresh token을 서버에게 보내주고, access token을 재발급 받을 것이다. 이 때 서버에게 건내주었던 refresh token은 서버에서 폐기 처리하고 서버로부터 새로운 refresh token을 받는 것이다. 그러면 로그아웃될 일이 없고 로그인 상태를 지속적으로 유지할 수 있다.

<br />

## 프론트엔드에서는 어떻게 처리했는가?

프론트엔드에서는 리소스 요청 시 헤더에 access token을 서버에 보낸다. 이때 서버에서 access token이 만료되었다는 응답이 온다면 응답 처리를 하기 전에 이 네트워크 요청을 가로채서 처리해주면 된다. 이때 나오는 개념이 `axios interceptor`이다. 네트워크 요청을 가로챈 후 refresh token을 서버에게 보내면서 네트워크 재요청을 한다. 이후 응답으로 새로운 access token과 refresh token을 발급받으면 해결된다.

`axios interceptor`의 사용법은 간단하다. 그리고 공식 문서 번역판도 있어서 금방 적용할 수 있다.<br />
[axios interceptor 공식문서 번역판](https://yamoo9.github.io/axios/guide/interceptors.html)

이 다음부터는 코드 설명으로 이어진다. 간단하게 어떤식으로만 구현했는지 기록하려고 한다.

```js
// api
const createAxiosWithAuth = (baseURL, endpoint) => {
  const axiosService = axios.create({
    baseURL: `${baseURL}/${endpoint}`,
    timeout: TIMEOUT,
    headers: headers,
  });

  // 인증 관련된 모든 요청은 인터셉터 함수를 거칠 수 있게 설계했다.
  return setInterceptors(axiosService);
};

// axiosAuth.get 또는 axiosAuth.post 방식으로 API 요청을 할 수 있다.
export const axiosAuth = createAxiosWithAuth(process.env.AUTH, "auth");

// interceptor
import store from "@/app/store";

export function setInterceptors(axiosService) {
  axiosService.interceptors.request.use(
    async (config) => {
      // 요청을 보내기 전에 어떤 처리를 할 수 있다.
      // 모든 요청의 header값에 토큰값을 넣어야 할 때 사용할 수 있다.
      const authStore = store.getState().auth;
      config.headers["Authorization"] = `Bearer ${authStore.accessToken}`;
      return config;
    },
    (error) => {
      // 요청이 잘못되었을 때 에러가 컴포넌트 단으로 오기 전에 어떤 처리를 할 수 있다.
      return Promise.reject(error);
    },
  );

  axiosService.interceptors.response.use(
    (response) => {
      // 서버에 요청을 보내고 나서 응답을 받기 전에 어떤 처리를 할 수 있다.
      return response;
    },
    async (error) => {
      // 응답이 에러인 경우에 미리 전처리할 수 있다.
      const authStore = store.getState().auth;
      const {
        config,
        response: { status },
      } = error;

      // access token 만료 에러코드: 401
      if ([401].includes(status)) {
        try {
          await store.dispatch(
            postReissueToken({ refresh_token: authStore.refreshToken }),
          );
          config.headers["Authorization"] = `Bearer ${authStore.accessToken}`;
          return axiosService(config);
        } catch (error) {
          console.error(error);
        }
      }
      return Promise.reject(error);
    },
  );
  return axiosService;
}
```

axios 네트워크 요청을 보내고 401 에러가 나면(access token 만료 에러) axios.interceptor를 통해서 응답 처리 하기 전 가로챈 후 서버에게 refresh token 요청을 다시 보낸다. 이외에도 interceptor를 통해서 다른 에러 처리를 할 수 있다. 가로챈 후 refresh token의 만료 기간을 연장시킴으로써 유저가 재 로그인 할 필요없이 자동으로 로그인을 유지시킬 수 있다. 이런 방식으로 프론트엔드에서 access token, refesh token 을 활용한 슬라이딩 세션(Sliding Sessions) 전략으로 refresh token을 관리할 수 있다. 그리고 새로 발급받은 accesss token과 refresh token은 세션 스토리지로 관리하다가 서버 요청이 필요할 때마다 스토리지에서 꺼내서 서버에게 요청을 해주는 방식을 구현을 했다. 토큰을 세션 스토리지에서 관리하는 방식이 보안상 좋은 방법인지는 모르겠으나 현재는 이렇게 사용하고 있다. 토큰 관련 이슈들을 더 찾아보고 알아볼 필요가 있을 것 같다.
