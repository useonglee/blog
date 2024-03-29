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

그리고 사용자와 인터랙션이 일어났을 때 화면을 그리므로, 만약 큰 규모의 앱이라면 그려야 할 js 코드의 양이 많으므로, 유저에게 앱 자체가 무거운 느낌을 줄 수 있다.

<img src="https://user-images.githubusercontent.com/113016742/196691355-be16d227-f348-4234-9869-c214e65d5553.png" alt="CSR 렌더링 과정" width="900" loading="lazy" />

HTML 부분이 맨 처음 봤던 이미지의 빨간색 박스 부분이다. 그리고 그려야 할 js 코드들이 바로 client rendering 부분이다. 그래서 CSR의 단점은 js 코드의 양이 증가함에 따라 콘텐츠들을 처리하는 부분에 있어 지연 로드가 된다는 점이다.

CSR의 단점

- 초기 렌더링 속도가 느리다. (TTFB: Time To First Byte)
- 웹 애플리케이션 규모가 커질수록 js 코드 양이 많아지므로 앱 자체가 무거워질 수 있다.
- SEO를 활용할 수 없다. ([SEO에 TTFB도 정말 중요하다고 함](https://moz.com/blog/improving-search-rank-by-optimizing-your-time-to-first-byte))

지금까지 단점만 알아보았다. 나름 크리티컬한 단점들임에도 CSR로 구현된 수많은 페이지들이 있다. CSR의 장점은 무엇일까?

CSR은 파일을 다 받아온 후 부터는 필요한 데이터만 받아와서 사용자 인터페이스를 구사할 수 있다. 이 부분에서 사용자는 필요한 데이터만 빠르게 받아볼 수 있는 장점이 있다. 그리고 필요한 데이터만 서버에게 요청하기 때문에 서버 부하를 SSR보다 월등히 줄일 수 있다는 장점이 있다.

<br />
<br />

## SPA로 구성된 웹 앱에서 SSR이 필요한 이유

CSR 방식이 있는데, SSR이 필요한 이유는 무엇일까? 어쩌면 본인이 하고 있는 프로젝트 또는 플랫폼 사일로마다 다를 수 있겠지만, 만약 SSR을 도입한다면 SEO와 함께 첫 로딩이 중요한 플랫폼일 경우가 아닐까 싶다.

특히 컨텐츠가 주인 경우(블로그, 뉴스 등) 또는 SEO가 중요한 경우(이커머스 등)은 SSR을 고려안할 수가 없을 것이다. SEO를 통해 검색엔진을 최적화해야만 많은 잠재적 유저들에게 노출되기 쉽기 때문이다. 그리고 보안 측면에서도 SSR CSR보다 더 유리한 경우가 있다.

SSR은 React에서 `eject`를 통해 웹팩을 커스터마이징하거나(CRA로 시작했을 경우), 코드 스플리팅을 하면 어느정도 해결이 되겠지만, SSR(SSG)을 편리하게 사용할 수 있는 Next.js 프레임워크를 사용하는게 가장 좋은 방법이라고 생각한다. 이유는 SPA 기반 웹 어플리케이션에서 SSG를 기본으로 제공하며 pre-rendering과 CSR의 장점까지 활용할 수 있기 때문이다. (이외의 장점들을 더 들자면 리소스 최적화 관련해서도 더 많다.)

Next.js를 사용해보면서 느낀점은 사용자 중심 플랫폼에서 정말 극도로 효율을 나타낸다고 생각한다. 많은 장점들이 있지만 이번 블로그에서는 SSR과 관련된 내용만 다루려고 한다.

먼저 SPA(Single Page Application)는 렌더링 방식(CSR, SSR)과 같은 선상에 놓으면 안된다. 완전히 다른 개념이기 때문이다. SPA는 첫 렌더 이후 다시 HTML을 받아오지 않는다. 다만 url 변경을 통해 페이지를 이동하고 필요한 데이터만 받아온다. 그래서 CSR 방식에서 각광을 받았던 이유가 페이지를 이동할 때마다 페이지 요청을 하지 않아도 되기 때문이라고 생각한다.

그렇다면 SPA에서는 CSR만 사용하면 되는게 아닌가? 그렇지 않다. 앞으로 설명하는 내용은 Next.js가 추구하는 방향과 많이 직결되는데, 초기 렌더를 SSG 방식으로 화면을 그리고, 이후 페이지 이동은 CSR로 웹 서비스를 만드는 것이다.

<br />

### SSR

```ts
export default function MyApp({ quries }: IMyAppProps) {
  console.log(quries); // { offset: 1, limit: 24, sorter: '' }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { offset, limit, sorter } = context.query;
  const queries = JSON.parse(JSON.stringify({ offset, limit, sorter }));

  return {
    props: { queries },
  };
};
```

최근 프로젝트에서 Next.js를 통해 SSR을 구현했었는데, 그 때 구현했던 코드를 그대로 가져와 보았다. 서버 사이드에서 현재 페이지의 쿼리스트링을 가져온 후 해당 페이지 컴포넌트의 props로 쿼리스트링을 넘겨주는 코드이다. `useRouter`를 사용해서 쿼리스트링 값을 가져오게 되면 서버 사이드에서는 이 값을 활용할 수가 없어서 `getServerSideProps`을 통해 서버 사이드에서 쿼리스트링 정보를 받아온 후 React-query를 통해 서버 데이터를 원격 제어할 수 있게끔 구현을 했다. 그러면 Hydrate 과정에서도 문제없이 렌더링을 구사할 수 있다.

> Hydrate란? 서버 사이드단에서 번들링된 js 코드를 클라이언트로 보낸 후, HTML 코드와 JS 코드를 매칭 시키는 과정을 일컫는다. 즉, 빠르게 FCP를 구성한 다음 웹 화면을 구성하기 전 클라이언트 측에서 렌더링을 통해 Hydrate 과정을 거친다.

위의 코드는 간단하지만 만약 초기 렌더링에서 많은 데이터 fetching이 이루어진다면 SSR은 CSR에 비해 오히려 더 좋지 않은 성능을 보일 수 있다. Hydration 과정을 거친 SSR 방식은 FCP가 빠르다는 장점이 있지만 반대로 TTI(Time To Interactive)에 치명적인 단점이 생길 수 있다. 화면은 다 그려졌지만 막상 동작이 안하는 경우를 한 번쯤은 경험해 봤을 것이다.(경험하지 않았다면 정말 대단한 경우일 수도...)

화면이 다 그려졌지만 동작이 안한다는 것은 어쩌면 지연 로드보다 더 큰 단점이 될 수도 있다. 그래서 캐시 가능성이 높은 페이지만 SSR을 사용하게 해서 TTFB를 빠르게 가져옴과 동시에 pre-rendering처럼 동작하게 해서 TTI도 빠르게 가져가는 방식이 있다. (이러한 부분들을 next.js에서 손쉽게 할 수 있다.)

그리고 만약 해당 프로젝트를 정적 웹 호스팅한다면 `getServerSideProps` 메서드는 사용할 수 없다.

`next build` 후 `next export` 스크립트 명령어를 실행하면 바로 오류가 발생한다.

<img src="https://user-images.githubusercontent.com/75570915/196195853-8d7d8d1b-c4e5-48ea-89b4-097186c84f45.png" alt="getServerSideProps 에러 이미지" width="900" loading="lazy" />

uri와 라우팅이 관련된 페이지 렌더링방식은 `getStaticPath`와 `getStaticProps`를 같이 사용해서 SSG 방식으로 해결해 줄 수 있다.

<br />
<br />
<br />

### SSG

<img src="https://user-images.githubusercontent.com/75570915/196711374-8753088c-20e7-44ea-a529-0180b41ef8f1.png" alt="SSG 정적 웹 호스팅 과정" width="900" loading="lazy" />

위의 이미지는 Next.js로 개발한 앱을 정적 웹 호스팅 했을 때의 과정이다. Next.js의 앱은 빌드 후 스크립트 명령어 `next export`로 정적 html 파일들을 생성할 수 있고, 이 파일들을 s3 버킷에 올리면 정적 웹 호스팅을 할 수 있다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/196719745-a8b6a320-19cc-4161-8730-e4097256c815.png" alt="SSG 렌더링 과정" width="700" loading="lazy" />
</center>

<br />

그렇다면 SSG(Static Site Generators)는 어떠한 특징들을 다루고 있을까? 왜 Next.js에서는 SSG(ISR) 렌더링 방식을 강력하게 추천하고 있을까? 이 주제가 어쩌면 이 블로그의 핵심 내용이 될 수도 있겠다.

가장 중요한 포인트는 SSG는 `빌드 시점`에 앱을 모두 그린다는 점이다. 그렇기 때문에 SSR과 달리 페이지에서 HTML을 생성하지 않고, 이미 생성되어 있기 때문에 일관된 TTFB를 가져올 수 있다. 그래서 SSG는 미리 생성된 HTML을 꺼내온다고 생각하면 이해하기 쉽다.

<img src="https://user-images.githubusercontent.com/75570915/196750601-ad146e11-a68c-4535-bb0a-20e592044a70.png" alt="SSG 페이지 lighthouse 지표" width="900" loading="lazy" />

SSG로 구현한 유저 프로필 정보 조회 페이지이다. SSG로 구현하면 Lighthouse의 성능 지표는 정말 막강하다.

<br />

그러면 미리 생성된 HTML을 꺼내온다면 useEffect와 같이 마운트 이후 필요한 데이터 이외에 모든 것들은 미리 구성해놓고, 데이터가 필요할때 '데이터만' CSR 방식으로 렌더링하게 된다. 그렇다면 SSG에서도 바로 단점을 알아볼 수 있다.

데이터가 많이 필요할수록 CSR의 단점과 똑같이 화면을 인식하는데 성능이 떨어질 수도 있다. 그리고 빌드 시점에 앱을 그리기 때문에 fresh한 데이터를 보여줄 수 없다. 만약 사용자로 인해 데이터가 업데이트 되었고, 최신 데이터를 받아와야 하는 상황에서 SSG는 최신 데이터를 받아볼 수 없다. 최신 데이터를 다시 받기 위해서는 빌드를 다시 해야 한다.

<br />

<img src="https://user-images.githubusercontent.com/75570915/196722185-ec47b40a-c4c2-4d49-9d10-1dd22c7b2776.png" alt="Next.js 프로젝트 빌드 결과물" width="900" loading="lazy" />

위의 이미지는 실제 진행 중인 프로젝트의 빌드 결과물이다. 빌드 결과물을 자세히 보면 어떤 페이지들이 SSG로 동작하고 있는지 알 수 있다. SSG는 `getStaticPaths`와 `getStaticProps`를 조합해서 사용한 페이지라면 SSG 방식으로 동작한다. `getStaticPaths`를 통해 미리 생성해야 할 페이지들을 미리 받아 놓는다. 그리고 그 페이지들의 배열을 순회하며 `getStaticProps`를 통해 props들을 미리 받아 놓는다. 이러한 이유로 인해 클라이언트단에서는 이미 props가 받아져 있는 상태임을 알 수 있다.

### ISR

그렇다면 ISR(Incremental Static Regeneration)은 무엇일까? 아마 Next.js를 많이 다뤄보지 않았다면 SSG까지는 많이 들어보았을 것이다. ISR은 SSG의 단점을 보완하기 위해 나온 방식이다. SSG의 단점은 정적인 페이지를 업데이트하려면 다시 빌드를 해야 한다고 설명했었다.

그러면 빌드를 안하고 업데이트를 할 수 있는 방법은 없을까? 이러한 문제를 고안해낸 방식이 바로 ISR 렌더링 방식이다. 미리 정해둔 시간동안만 캐시된 페이지를 보여주는 것이다. 사용법은 간단하다. getStaticProps의 옵션 중에서 `revalidate`를 추가해 주면 된다.<br />
(이 개념에 대해 더 깊게 알고 싶다면 **stale-while-revalidate**에 대해 검색해 보면 좋을 것 같다.)

<br />

```ts
export async function getStaticPaths() {
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  // 이 과정을 통해 pre-render 기반으로 웹을 동작할 수 있다.
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: false };
}

export const getStaticProps = async () => {
  const res = await fetch("https://.../posts/1");
  const posts = await res.json();

  return {
    props: {
      posts,
    },
    revalidate: 60, // 60초마다 업데이트
  };
};
```

위와 같은 코드로 페이지를 구성했다면 그 페이지는 60초마다 재 빌드를 할 것이다. 그리고 나는 실제로 위와 같은 방식으로 ISR을 구현했었고, 60초마다 정기적으로 업데이트를 하도록 했다.

하지만 얼마 지나지 않아서 백엔드 개발자로부터 슬랙 알림이 울렸다... 60초마다 로그가 계속 찍히고 있다고...

<br />

<img src="https://user-images.githubusercontent.com/113016742/191691651-12a21f66-2805-4ec7-9050-53a9f612fa1d.png" alt="SSR 성능 지표" width="600" loading="lazy" />

응...? 잠만... 생각해보니 알아서 재빌드를 하니까.... 60초마다 빌드를 하면 60초마다 서버에 api 통신을 시도한다는 것인데 그게 앱이 실행 중이지 않을 때도 요청을 하는구나..? 나는 ISR이란 방식이 마치 은탄환인 것 마냥 무작정 도입을 했었다. 잘 알지도 못하고 쓰면 이러한 낭패를 보는구나.. 라는 것을 오늘 '또' 깨달았다 ..ㅎㅎ

<br />

<img src="https://user-images.githubusercontent.com/113016742/191682574-41cf308d-7cc4-4174-931c-64136b84853a.png" alt="ISR 백로그 지표" width="900" loading="lazy" />

백로그 찍힌걸 보내주셨는데, 다시 확대해서 확인해 보았다. 진짜 1분 간격으로 찍히고 있었다...ㅋㅋㅋㅋㅋㅋ 아무도 사용 안 하는데도... 이 때는 일단 임시방편으로 ISR 로직의 `getStaticProps` 메서드를 지우고 CSR 방식으로 구현했다. 하지만 ISR의 이러한 부분을 보완하고자 나온 방법이 또 있었다. 진짜 이 세상에는 천재들이 정말 많은 것 같다. (행복)

<br />

## On-demand Revalidation

> 이 기능은 Next.js 12.2.0 버전부터 지원한다.

이 방식은 ISR 방식과 비슷하지만 데이터 변경 시에만 재빌드를 하는 것이다. on-demand revalidation 방식은 `revalidation 옵션을 사용하지 않는다.` 아래 코드는 공식 문서에서 가져왔다.

```ts
// pages/api/revalidate.js

export default async function handler(req, res) {
  // 토큰 검사
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    // 재빌드할 경로명을 정확하게 입력해야한다. req의 body를 통해 받아올 수 있다.
    // 파일명이 "/blog/[slug]" 이더라도 "/blog/post-1" 처럼 입력해야한다.
    await res.revalidate("재빌드할 페이지 경로");
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
```

앞서 살펴본 ISR 방식인 revalidate 옵션을 사용하면 revalidate 의 값만큼만 캐시된 페이지를 보게 된다고 설명했다. 이 캐시를 무효화하려면 revalidate 값만큼의 시간이 경과되어야만 다시 요청을 한다.

반대로 `on-demand revalidation` 방식은 데이터 변경이 일어났을 때 재빌드를 해달라는 요청을 보내고, 페이지단에서 재빌드 요청을 받으면 재빌드를 함으로써 캐시를 갱신한다.

On-demand Revalidation을 사용하기 위해서는 Next.js 만 알고있는 토큰을 생성해서 환경변수에 저장해야한다. 해당 토큰을 사용해야 인가된 사용자만 위와 같은 url로 Next.js api에 revalidate를 요청할 수 있다.

<br />

## 놓치기 쉬운 Next.js에 대한 정보 요약

- Next.js로 만들어진 웹 페이지는 url로 접근시 pre-rendering(SSG, SSR) 된 페이지를 반환한다.<br />
- pre-rendering은 프론트엔드 서버에서 돌아가는 Next.js에서 일어난다.<br />
- 첫 요청하는 페이지에 대해서만 SSG 혹은 SSR으로 서버 사이드단에서 미리 생성해 놓은 파일을 응답하는 것이고, 그 이후부터는 router를 통해 이동하는 것은 모두 CSR이다.
- 그러므로 Link를 클릭하거나 router.push()를 통해 이동하면 CSR 방식으로 페이지를 전환한다.

<br />
<br />
<br />

### Reference

- [Rendering on the Web](https://web.dev/rendering-on-the-web/)
- [stale-while-revalidate로 최신 상태 유지](https://web.dev/stale-while-revalidate/)
- [Next.js에 대한 거의 모든 것](https://velog.io/@sj_dev_js/Next.js-%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B1%B0%EC%9D%98-%EB%AA%A8%EB%93%A0-%EA%B2%83#isr-incremental-static-regeneration)
