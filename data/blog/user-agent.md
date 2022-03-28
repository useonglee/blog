---
title: 'User Agent'
date: 2022-03-16
lastmod: '2022-03-16'
tags: ['웹뷰', 'front-end']
draft: false
summary: '웹뷰를 처음 개발하면서 만난 user agent'
layout: PostSimple
type: blog
---

<TOCInline toc={props.toc} exclude="목차" toHeading={2} />

<br />

## 어떤 일이 있었는가?

회사에서 신규 서비스에 대한 로그인 인증 관련 개발을 하고 있었는데 현재 내가 개발하고 있는 이 웹이 웹뷰로 들어간다는 사실을 알게 되었다. 당시 웹뷰 개발에 대한 경험이 아예 무지했던 상황이라 그래서 나는 뭘 하면 되는거지..? 라는 생각이 가득했었다.

현재 회사 앱 서비스는 유니티로 돌아가고 있었고, 로그인 부분만 웹뷰 구현 방식으로 결정된 것이었다. 이후 로그인 관련 기능을 다 구현하고 웹뷰로 넘어가야 하는 상황이 왔다. 그래서 웹뷰는 여기서 이제 뭘 어떻게 하면 되는건지 웹 파트장인 제프에게 물어봤고, 제프는 나에게 먼저 `user agent`에 대해서 공부를 해보면 좋겠다고 말씀해주셨다. 그 때 처음 `user agent`라는 친구를 알게 되었다..!!

## 그러면 웹뷰(Web view)는 뭔데?

<center>
<img src="https://user-images.githubusercontent.com/75570915/160322558-436c48c0-82d6-49f2-97dd-a06bb54a2995.png" alt="web view 썸네일 이미지" width="900" />
</center>

웹뷰(Web view)는 쉽게 표현하면 앱 내에 웹 브라우저를 넣는 것이다. 앱 내에 웹 브라우저를 넣는 방식을 사내에서는 iframe으로 유니티 클라이언트용 웹 페에지를 wrapping하는 방식으로 하기로 결정되었다.

그러면 결국 앱 쪽에서 iframe으로 웹을 감싼다면 웹 파트에서는 무엇을 우려하면 되겠는가? 앱 쪽에서 요구사항이 있었다. 로그인/회원가입 후에 MPLAT이라는 `user agent name`으로만 앱에 접근이 가능하도록 만들어 달라는 것이었다. 그래서 시작된 구글링과 user agent에 대한 공부..

<br />

## User Agent란?

User Agent는 현재 자신이 접속해 있는 **웹 브라우저의 정보** 또는 **어떤 OS를 쓰고 있는지에 대한 정보**를 의미한다.<br/>
[User Agent - MDN](https://developer.mozilla.org/ko/docs/Glossary/User_agent)

우리는 웹 사이트에 접속하게 되면 브라우저는 서버에게 HTTP 요청을 하게 되는데, 이때 User Agent를 알리는 정보가 HTTP 헤더에 담겨 있다. 이 부분은 개발자 도구를 열면 바로 확인할 수 있다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/160327540-b61d637c-eaeb-482c-bb3d-e177964c6906.png" alt="개발자 도구 user agent" width="900" />
</center>

그런데 문득 이런 생각이 났다. 개발자 도구의 User Agent를 통해 브라우저 정보를 알았는데, 왜 브라우저 정보를 알아야 할까? 어떤 이슈가 있었길래 이러한 것들이 나왔을까.. 의문이 들었고 바로 찾아보았다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/160328537-f0d71754-7572-43c7-b227-63be8258fbb7.png" alt="개발자 도구 user agent" width="900" />
</center>

이 궁금증은 웹 브라우저의 역사를 통해 알 수 있었다. 과거에는 웹 브라우저가 자체 엔진을 사용했었지만, 현재는 상황이 많이 달라졌다. 구글/크롬이 압도적인 점유율 1위를 차지하면서 다른 브라우저들이 크롬을 따라가기로 결정한다. <br />
[웹 브라우저 점유율 확인하기 👉 statcounter.com](https://gs.statcounter.com/)

그래서 현재는 애플/Safari를 제외한 대부분이 크롬/블링크 기반의 엔진을 사용하고 있다. User Agent는 과거에 여러 웹 브라우저에서 동일한 서비스를 제공하기 위해 만들어졌다. (결국 크로스 브라우징의 해결 차원에서 만들어졌다는 뜻인 것 같다.)

브라우저마다 엔진이 다 다르니, 이를 파악하고 각 브라우저에 맞게 최적화를 시키는 것이 주된 목적으로 보인다. 하지만 현재는 과거와 달리 브라우저의 엔진이 대부분 같아졌다.

현대 웹 브라우저에서 User Agent는 웹 브라우저의 종류보다는 접속한 컴퓨터의 OS 정보 또는 모바일 디바이스인지 구분 짓는 용도로 많이 활용하고 있다.

정리하자면 과거에는 모든 웹브라우저에게 동일한 서비스를 제공하기 위해 브라우저를 확인하는 용도로 썼으나, 대부분 동일한 엔진을 사용하는 현대는 OS 정보 또는 모바일 디바이스의 구분 용도로 사용하고 있다.

## 나는 어떻게 사용했는가? (feat. ua-parser-js)

실제 프로덕션에서 현재 구현 방식을 그대로 사용할지는 미지수이지만 현재 어떻게 사용하고 있는지를 적어보려고 한다.

먼저 구체적인 앱의 요구사항을 설명하면, 사용자가 인증 서버에서 로그인을 하면 얻게 되는 토큰 정보(access_token, refresh_token)를 유니티 클라이언트로 보내주어야 하는 작업이 필요했다.

그래서 토큰값을 return 받을 수 있는 JS 함수를 구현하고 외부 스크립트로 노출 시킬 계획이었다. 그러면 앱(유니티)쪽에서 노출된 스크립트를 받고 `getTokens` 함수를 실행하면 토큰 정보를 받을 수 있게 설계했다.

여기서 모든 브라우저에서 JS 스크립트를 노출시키는 방식이 아니라 `User Agent name`이 MPLAT인 경우에만 JS 스크립트를 노출되도록 구현했다. 이유는 앱 쪽에서 **MPLAT/0.5.0**이라는 사용자 에이전트로 접근 예정이기 때문이다. 웹뷰에서는 사용자 에이전트가 MPLAT이면 JS 스크립트를 노출할 수 있도록 구현하면 되는게 전부이다.

아래 코드를 보면 아마 더 이해가 쉬울 것 같다. (참고: Next.js 환경에서 구현)

### 라이브러리 설치

```
$npm i ua-parser-js @types/ua-parser-js
```

[ua-parser-js 공식문서](https://github.com/faisalman/ua-parser-js)

### 구현 방식

```js
// 로직: User Agent가 MPLAT 이면 JS 스크립트를 노출
import UAParser from 'ua-parser-js';
import Script from 'next/script';

function Components () {
    const [myUA, setMyUA] = useState<string>('');

    useEffect(() => {
        // UAParser 파싱된 데이터에서 원하는 정보를 가져오기 위해 extensions를 설정
        const myOwnListOfBrowsers = [
            [/(MPLAT)\/([\w.]+)/i],
            [UAParser.BROWSER.NAME, UAParser.BROWSER.VERSION],
        ];
        const MyParser = new UAParser({ browser: myOwnListOfBrowsers });

        setMyUA(MyParser.getBrowger().name);
    }, []);

    return (
        //... 생략
        // ua의 이름이 'MPLAT' 인 경우에만 JS 스크립트 노출
       {myUA === 'MPLAT' && <Script src="/js/getTokens.js" />}
    )
}

// console.log(MyParser.getBrowger())
// {name: 'MPLAT', version: '0.5.0', major: '0'}

// 위에서 name 값만 가져와 스크립트 노출 분기 처리를 해주었다.
```

<img src="slackcomment" src="https://user-images.githubusercontent.com/75570915/160331659-666bfde9-d9de-4247-9e2f-da70560acb72.png" alt="슬랙 커멘트 이미지" width="400" />

앱 쪽에서 정상적으로 작동한다는 스레드를 확인했고 해당 이슈를 마무리 할 수 있었다..!

## User Agent 로컬에서 테스트하기

유니티 클라이언트에서도 잘 되는 것을 확인했지만, 배포 전에 로컬에서 완벽히 테스트가 끝나야만 앱 쪽에 잘 되는지 확인 요청을 할 수 있기 때문에 로컬 테스트가 필요했다. 나는 두 가지 테스트 방법으로 진행했었다.

### 1. UA switcher 플러그인 사용하기

UA switcher는 확장 프로그램으로 크롬 웹 스토어에서 설치할 수 있다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/160332940-7f5aeda1-ca44-437c-bdb5-c00655368d84.png" alt="UA switcher 이미지" width="700" />
</center>

설치를 하게 되면 웹 오른쪽 상단 확장 프로그램쪽에 아이콘이 생기고 거기서 설정 및 원하는 브라우저 또는 모바일 화면과 UA 스위칭이 가능하다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/160333204-bc9cff74-0bda-43da-9e9a-91ecfc429e4b.png" alt="UA switcher 이미지" width="700" />
</center>

### 2. ua-agent-js 옵션값 활용하기

```js
// 첫번째 인자값에 UAstring 옵션을 넣어줄 수 있다.
// 위 구현 로직에서 인자값만 추가해 보았다.
const MyParser = new UAParser('MPLAT/0.5.0', { browser: myOwnListOfBrowsers })

// console.log(myParser.getResult());
/**
browser: {name: 'MPLAT', version: '0.5.0', major: '0'}
cpu: {architecture: undefined}
device: {vendor: undefined, model: undefined, type: undefined}
engine: {name: undefined, version: undefined}
os: {name: undefined, version: undefined}
ua: "MPLAT/0.5.0"
**/
```

ua 네임값을 활용할 수 있지만 브라우저나 모바일 화면까지 활용할 수는 없었다. 오늘 설명한 로직처럼 ua 네임값만 필요하다면 위 코드처럼 활용하는 것이 간단한 것 같다.

## navigator.userAgent

나는 원하는 UA값을 넣고 테스트하기 위해 라이브러리를 사용했지만 js navigator 내장함수에 userAgent가 있다. 해당 메서드를 사용해서 간단하게 OS 정보를 얻는 방법도 있다.<br />
[Navigator.userAgent - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent)

## 마치며

많은 대형 서비스들 중에 웹뷰로 돌아가는 것들이 많이 있다고 들었다. 웹 브라우저가 앱에서 돌아가게 하기 위해 웹앱 개발자들의 많은 노력이 담겨 있다고 생각한다. 오늘 나도 사내에서 개발을 통해 웹뷰라는 것을 알게 되었다. 나는 간단하게 사용자 에이전트에 대해서만 배우게 됐지만, 웹뷰로 개발을 한다면 더 다양한 서비스와 더 재밌는 개발을 할 수도 있겠다는 생각이 들었다.
