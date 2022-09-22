---
title: "CSR / SSR with Next.js"
date: 2022-09-21
lastmod: "2022-09-21"
tags: ["front-end", "Next.Js", "개발"]
draft: false
summary: "CSR과 SSR 방식이 Next.js에서 어떻게 사용되는지 살펴보자"
layout: PostSimple
type: blog
canonicalUrl: ""
---

<TOCInline toc={props.toc} exclude="목차" toHeading={2} />

<br />

## 들어가며

이번 블로그 글에서는 CSR(Client Side Rendering)과 SSR(Server Side Rendering) 방식이 각각 어떤 특징을 가지고 있는지 알아보며, 현재 회사에서도 사용중인 프레임워크 Next.js를 사용하면서 경험했던 부분들을 기록해 보려고 한다.

먼저 렌더링에 대해서 알아보자. 렌더링이란 링크를 통해 접속한 **웹 페이지를 실시간으로 그려내는 과정**을 말한다. 여기서 실시간이라는 표현을 사용했는데, 그 이유는 미리 만들어진 것을 가져오기 보다는 렌더링 엔진을 통해 번들링된 리소스들을 실시간으로 파싱해서 웹 페이지를 그리기 때문이다.

그렇다면 CSR과 SSR은 무엇일까? SPA 웹 개발을 필히 듣게 되는데, 웹 페이지의 렌더링 방식이며 단순히 클라이언트에서 렌더링을 할 것이냐 서버에서 렌더링할 것이냐로 볼 수 있다. 즉 웹 서버에서 HTML 파일을 받을 때 렌더가 준비된 파일이냐 아니냐로 나눌 수 있다. 하지만 웹 앱에 적용했을 때 CSR과 SSR 각각의 특징들을 살펴 본다면 결코 단순한 차이가 아님을 알 수 있다.

<br />
<br />

## CSR과 CSR의 장점

<img src="https://user-images.githubusercontent.com/113016742/191511937-b605574d-8edf-4949-b1b2-0b203fc7c5d2.png" alt="CSR 렌더링 방식 다이어그램" width="900" loading="lazy" />

먼저 CSR에 대해서 알아보자. CSR은 클라이언트단에서 화면을 구성하는 방식으로, 서버로부터 렌더 준비가 안된 HTML 파일을 받게 된다. 즉 빈 껍데기 파일을 받게 된다. 이후 화면 구성에 필요한 번들링된 JS 파일 전부를 다운로드 받고, 화면을 그리게 된다.

<br />

> Tip: 클라이언트 측에서 화면을 그리는 과정은 개발자 도구 > 성능 탭에서 체크할 수 있다.
> Tip: 개발자 도구 > LightHouse 는 성능 지표 뿐만 아니라 웹 표준 접근성, 권장사항까지 잘 적용이 되어있나 확인할 수 있다.

아래 이미지는 최근에 진행했던 프로젝트 중 CSR로 돌아가는 화면이다. 이미지를 살펴보면 처음 렌더링 타임에 빈 HTML을 가져오고, 이후에 화면을 그리는 모습을 확인할 수 있다.

<img src="https://user-images.githubusercontent.com/113016742/191654674-addb7c64-5ff1-4be7-b939-550ffa3a56a0.png" alt="CSR 렌더링 과정" width="900" loading="lazy" />

<br />
참고로 저 흰 화면은 우리가 React 프로젝트를 처음 시작할 때 항상 보는

```js
// indext.html
<div id="root"></div>;

// src/_app.tsx
ReactDOM.render(<App />, document.getElementById("root"));
```

과 같다.

이제 빈 껍데기를 받아왔을 때 단점을 알 수 있다. 클라이언트단에서 모든 리소스를 다운받고 화면을 그리다보니 초기 렌더링이 느릴 수 밖에 없다. 그리고 클라이언트단에서 화면을 구성하게 되면 구글 검색엔진 봇이 JS 파일을 인식할 수 없기 때문에 빈 HTML 파일을 읽어드리게 되고, 이러한 과정은 SEO 문제로도 직결될 수 있다.

CSR의 단점

- 초기 렌더링 속도가 느리다. (TTFP)
- SEO를 활용할 수 없다.

지금까지 단점만 알아보았다. 나름 크리티컬한 단점들임에도 CSR로 구현된 수많은 페이지들이 있다. CSR의 장점은 무엇일까?

CSR은 파일을 다 받아온 후 부터는 필요한 데이터만 받아와서 사용자 인터페이스를 구사할 수 있다. 이 부분에서 사용자는 필요한 데이터만 빠르게 받아볼 수 있는 장점이 있다. 그리고 필요한 데이터만 서버에게 요청하기 때문에 서버 부하를 SSR보다 월등히 줄일 수 있다는 장점이 있다.

<br />
<br />

## SPA로 구성된 웹 앱에서 SSR이 필요한 이유

CSR 방식이 있는데, SSR이 필요한 이유는 무엇일까? 어쩌면 본인이 하고 있는 프로젝트 또는 플랫폼 사일로마다 다를 수 있겠지만, 만약 SSR을 도입한다면 SEO와 함께 첫 로딩이 중요한 플랫폼일 경우가 아닐까 싶다.

특히 컨텐츠가 주인 경우(블로그, 뉴스 등) 또는 SEO가 중요한 경우(이커머스 등)은 SSR을 고려안할 수가 없을 것이다. SEO를 통해 검색엔진을 최적화해야만 많은 잠재적 유저들에게 노출되기 쉽기 때문이다. 그리고 보안 측면에서도 SSR CSR보다 더 유리한 경우가 있다.

SSR은 React에서 `eject`를 통해 웹팩을 커스터마이징하거나(CRA로 시작했을 경우), 코드 스플리팅을 하면 어느정도 해결이 되겠지만, SSR(SSG)을 편리하게 사용할 수 있는 Next.js 프레임워크를 사용하는게 가장 좋은 방법이라고 생각한다. 이유는 SPA 기반 웹 어플리케이션에서 SSG를 기본으로 제공하며 pre-rendering과 CSR의 장점까지 활용할 수 있기 때문이다. (이외의 장점들을 더 들자면 리소스 최적화 관련해서도 더 많다.)

Next.js를 사용해보면서 느낀점은 사용자 중심 플랫폼에서 정말 극도로 효율을 나타낸다고 생각한다. 많은 장점들이 있지만 이번 블로그에서는 SSR과 관련된 내용만 다루려고 한다.

먼저 SPA(Single Page Application)는 렌더링 방식(CSR, SSR)과 같은 선상에 놓으면 안된다. 완전히 다른 개념이기 때문이다. SPA는 첫 렌더 이후 다시 HTML을 받아오지 않는다. 다만 url 변경을 통해 페이지를 이동하고 필요한 데이터만 받아온다. 그래서 CSR 방식에서 각광을 받았던 이유가 페이지를 이동할 때마다 페이지 요청을 하지 않아도 되기 떄문이라고 생각한다.

그렇다면 SPA에서는 CSR만 사용하면 되는게 아닌가? 그렇지 않다. 앞으로 설명하는 내용은 Next.js가 추구하는 방향과 많이 직결되는데, 초기 렌더를 SSG 방식으로 화면을 그리고, 이후 페이지 이동은 CSR로 웹 서비스를 만드는 것이다.

<br />

### SSR

<img src="https://user-images.githubusercontent.com/113016742/191682595-7e96ebe4-42d7-41d1-bf04-e9df022e954f.png" alt="SSR 성능 지표" width="900" loading="lazy" />

```ts
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { offset, limit, sorter } = context.query;
  const queries = JSON.parse(JSON.stringify({ offset, limit, sorter }));

  return {
    props: { queries },
  };
};
```

최근 프로젝트에서 Next.js를 통해 SSR을 구현했었는데, 그 때 구현했던 코드를 그대로 가져와 보았다. 먼저 이 프로젝트는 React-query를 통해 data fetching을 한다. 그리고 SSR을 구현한 이유는, Next.js의 Hydrate 과정에서 React-query를 통해 데이터를 가져올 때 쿼리스트링의 정보를 통해 서버와 통신한다.

하지만 `useRouter`를 사용해서 쿼리스트링 값을 가져오게 되면 서버에서는 이 값을 활용할 수가 없어서 `getServerSideProps`을 통해 서버 사이드에서 쿼리스트링 정보를 받아온 후 데이터 페칭을 하게 한 후 무리없이

<br />

### SSG

<img src="https://user-images.githubusercontent.com/113016742/191687558-710557ca-eb87-43b4-aa80-b673f093a7b2.jpeg" alt="SSR 성능 지표" width="900" loading="lazy" />

<br />

### ISR

<img src="https://user-images.githubusercontent.com/113016742/191682574-41cf308d-7cc4-4174-931c-64136b84853a.png" alt="SSR 성능 지표" width="900" loading="lazy" />

<br />

위의 이미지는 실제로 내가 사이드 프로젝트에서 ISR을 사용했을 때, 백로그에 찍힌 화면이다. SSG의 단점을 극복하고자 무작정 ISR을 도입했더니 위와 같은 현상이 일어났다.

```ts
export const getStaticProps = async () => {
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  return {
    props: {
      posts,
    },
    revalidate: 60,
  };
};
```

<br />
<br />

## Next.js 프로젝트를 실행했을 때 실행되는 코드들

-
