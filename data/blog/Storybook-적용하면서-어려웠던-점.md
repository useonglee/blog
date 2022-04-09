---
title: "Storybook 적용하면서 어려웠던 점"
date: 2022-04-09
lastmod: "2022-04-10"
tags: ["front-end"]
draft: false
summary: "최근 프로젝트에 Storybook을 적용하면서 어려웠던 점을 기록"
layout: PostSimple
type: blog
---

<TOCInline toc={props.toc} exclude="목차" toHeading={2} />

## Storybook을 공부하고 도입한 이유

최근에 사이드 프로젝트로 npm 라이브러리를 만들어서 배포한 적이 있다. 이 라이브러리를 사용해서 컴포넌트를 감싸면 날씨, 계절 배경 효과를 줄 수 있다. 라이브러리를 유저가 사용해 볼 수 있는 페이지가 있었는데 웹 페이지에서 사용하는 컴포넌트 특성상 UI가 중요하다보니 스토리북을 사용해서 UI 컴포넌트들을 문서화를 하면 좋겠다고 생각해서 이 프로젝트에 도입을 했다.<br />
[라이브러리 documentation website 바로가기 👉](https://ppo-f-man.github.io/react-season-component-web)

그리고 스토리북을 공부해두면 현업에서도 디자이너분들과 애자일하게 개발을 할 수 있지 않을까 하는 생각에 공부한 것도 있다. UI 테스트의 중요성을 아직 깨닫진 못했지만 스토리북으로 UI 테스팅까지 쉽게 할 수 있으니 배워두면 여러모로 유용하게 사용할 것 같다. 일단은 최근 프로젝트에 필요하다고 생각했고 공부 겸 스토리북을 도입해 보았다.

스토리북은 공식문서 튜토리얼을 한 번 따라해보면서 익히고 바로 프로젝트에 도입을 했다. 그러다보니 막혔던 부분들이 있었는데 그 부분들을 중점으로 블로그에 적어보려고 한다.

## storybook에서 useState 사용하기

<center>
<img src="https://user-images.githubusercontent.com/75570915/162612445-e58cc2ff-00b9-4483-8e9a-9fc134d343e1.gif" alt="스토리북 Controller 컴포넌트 gif" width="600" loading="lazy" />
</center>

<br />
위 Controller 컴포넌트에서는 스토리북을 통해 radio 버튼에 따라 컴포넌트 배경색이 바뀌는 UI 테스트를 하고 싶었다. 그래서 스토리북 파일을 만들고 해당 컴포넌트를 스토리북에 띄웠지만 원하는대로 radio 버튼을 클릭할 때마다 색상이 바뀌지 않았다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/162612620-11339fe1-a990-4c8c-8131-f9212191a571.gif" alt="스토리북 Controller 버튼 에러 gif" width="600" loading="lazy" />
</center>

```jsx
const Template: ComponentStory<typeof TypeChecker> = (args) => (
  <TypeChecker {...args} />
);

export const Auto = Template.bind({});
```

<br />
Controller 컴포넌트는 radio 버튼을 클릭할 때마다 useState를 통해 type을 업데이트 해주고, 그에 따라 색상이 바뀌도록 설계되어있다. 그래서 다시 생각한 방법은 storybook play API를 통해 수동으로 클릭이 되어있도록 만들어 보았다.

<br />

```jsx
export const Spring = Template.bind({});
Spring.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await waitFor(async () => {
    // eslint-disable-next-line testing-library/no-wait-for-side-effects
    userEvent.click(canvas.getByText("spring"));
  });
};
Spring.decorators = [
  (story) => <Controller type={types.spring}>{story()}</Controller>,
];
```

<br />
Spring.play를 사용하면 유저의 행동을 테스트할 수 있다. play 함수 안에 로직을 보면 userEvent.click을 통해 미리 spring 버튼이 클릭되어 있도록 만들었고, decorators 함수를 통해 컴포넌트의 state값을 미리 설정해두었다. 결과는 다음과 같다.

<br />

<center>
<img src="https://user-images.githubusercontent.com/75570915/162611497-b9f4e52d-232c-4679-afac-c2338db5698f.gif" alt="스토리북 gif" width="900" loading="lazy" />
</center>

<br />
설계한대로 radio button중에 spring 버튼에 클릭이 되어 있고, 미리 넣어둔 type.spring 값에 의해 배경색도 알맞게 변경되어 있었다. 하지만 반응형으로 설계되어 있는 컴포넌트이어서 그런지, 브라우저 너비를 줄이면 안에 내용들이 사라지는 현상이 발견되었다. 그리고 다음과 같은 에러가 발생했다.

<br />

<center>
<img src="https://user-images.githubusercontent.com/75570915/162613094-7b178080-3ca1-46f3-a51d-1dc3726f97fc.png" alt="스토리북 컨트롤러 에러 gif" width="900" loading="lazy" />
</center>

<br />
당연한 결과다. spring 버튼이 없는데 spring버튼을 click하려고 하니 에러가 발생했다. 그러면 미리 유저의 동작을 설계하는 방법이 아닌 버튼을 클릭할 때마다 state값을 바꿀 수 있도록 변경하고 싶었다. 찾아보니 storybook에서도 useState를 사용할 수 있는 방법이 있었다.

그리고 스토리북에는 애드온(Addon)이라는 기능을 통해 더 편리하게 다양한 기능들을 사용할 수 있다. 그 중에서 Knobs 애드온을 사용했고 Knobs 애드온은 입력값을 통해 스토리북 화면에 바로 반영시켜줄 수 있는 애드온이다. radio button에 따라 배경화면이 바뀌는 효과를 주기위해 딱이라고 생각했다. Knobs을 사용하고 안에 useState를 통해서 업데이트된 타입을 스토리북 화면에 바로 적용시키도록 코드를 작성했다.

<br />

```jsx
// .storybook/main.js
module.exports = {
  addons: ["@storybook/addon-knobs"],
  // ..생략
};

// stories.jsx
import React from "react";
import { withKnobs } from "@storybook/addon-knobs";
import useState from "storybook-addon-state";

export default {
  component: TypeChecker,
  title: "TypeChecker",
  argTypes: {
    handleType: { action: "clicked" },
  },
  // Knobs 애드온 적용
  decorators: [withKnobs],
};

export function TypeCheckerComponent(): JSX.Element {
  // 스토리북 useState 사용
  const [type, setType] = useState("click type", "auto");
  const [width, setWidth] = useState("changes width", 500);
  const [height, setHeight] = useState("changes height", 360);

  const handleWidth = (e) => {
    setWidth(e.target.value);
  };

  const handleHeight = (e) => {
    setHeight(e.target.value);
  };

  return (
    <Controller
      type={type}
      width={width}
      height={height}
      onChangeWidth={handleWidth}
      onChangeHeight={handleHeight}
    >
      <TypeChecker handleType={(e) => setType(e.target.value)} />
    </Controller>
  );
}

TypeCheckerComponent.story = {
  name: "Default",
};
```

<br />
먼저 스토리북 설치를 하면 기본적으로 추가되는 main.js 파일에 Knobs 애드온 설정값을 추가해주었다. 그리고 스토리북 파일 내에서도 decorators 부분에 넣어주어야 정상적으로 작동한다. 스토리북 useState는 react에서 사용하는 useState와 사용방법이 비슷하다. 첫번째 인자에 이름만 설정해주고 두번째 인자에 react useState와 같이 초기값을 넣어주면 된다. 이런식으로 설정해두면 storybook에서 useState를 통해 state값을 업데이트하고 바로 반영한 결과를 볼 수 있다. 그리고 결과는 다음과 같이 잘 정상 작동했다.

<br />

<center>
<img src="https://user-images.githubusercontent.com/75570915/162616810-3ea48410-6707-47c3-ba79-0487720b5443.gif" alt="스토리북 컨트롤러 에러 gif" width="900" loading="lazy" />
</center>

<br />
<br />

## storybook에서 snapshot 찍을 때 발생한 에러

## storybook CI 환경 구축하기

## 마무리
