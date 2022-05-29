---
title: "git squash"
date: 2022-05-28
lastmod: "2022-05-28"
tags: ["git"]
draft: false
summary: "여러 commit 로그 하나로 묶기!"
layout: PostSimple
type: blog
---

<TOCInline toc={props.toc} exclude="목차" toHeading={2} />

<br />
<br />

<center>
<img src="https://user-images.githubusercontent.com/75570915/170821175-54756cfc-be9e-4c59-aa77-fd4d3d050e55.png" alt="git 대표 이미지" width="600" />
</center>

<br />

## git squah를 쓰게 된 배경

나는 커밋을 남길 때 개발 작업 내역을 세세하게 기록하려고 하는 습관이 있다. 그러다보니 git commit 로그들이 무수히 많다. commit 단위가 작을 수록 commit들을 하나씩 확인하기도 편하고, 사내에서 팀원들과 코드 리뷰하기에도 편하다고 생각했다.

하지만 이건 언제까지나 git 레포지토리를 혼자 썼을 때 이야기다. 만약 git 레포지토리를 다른 팀원들과 같이 쓰면서 개발을 하고 있는 상황이라면? 그러면 다른 팀원은 커밋 로그를 확인할 때마다 무수히 많은 나의 커밋 로그들을 때문에 스크롤을 계속 내려야만 하는 상황이 온다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/170822133-1a189385-8df2-44a4-b6bd-bb0c89f5c66e.png" alt="사내 git commit log" width="900" loading="lazy" />
</center>

얼마전 나의 커밋로그를 확인해 봤는데.. 정말 무수히 많았다. 심지어 스크롤을 내리면 더 있었다. 팀원이 자신의 커밋을 확인하기 위해 저 수 많은 커밋들을 지나친 후에 찾고 있었다고 생각하니 매우 끔찍했다.

그래서 나는 이러한 문제들을 해결하고자 git squash 전략을 사내에 도입했다. git squash를 사용하면 저 무수히 많은 커밋들을 로컬에서 하나로 묶은 후 push를 하는 전략이다. 사실 squash라는 git 명령어는 없고, interactive rebase를 활용하는 전략인데 vi 에디터에서 squash 라는 단어를 사용해서 git squash라는 이름이 탄생한 것 같다.

<br />

## 사용법

이제 본격적으로 어떻게 사용했는지 실제 경험을 바탕으로 기록해 보려고 한다. 사용법에 이야기하기에 앞서 작업했던 내용들을 커밋해주자.

<center>
<img src="https://user-images.githubusercontent.com/75570915/170824486-10ae45a2-f1b2-4fb2-b0ff-3ef27b6a46f2.png" alt="터미널에서 작업 내용 commit한 이미지 " width="900" loading="lazy" />
</center>

이렇게 상세하게 커밋을 완료한 이후에 이제 이 커밋들을 하나로 묶어줄건데 만약 몇 개의 커밋을 했는지 확인해 주고 싶으면 다음 명령어를 사용하면 된다.

```
git log --pretty=oneline
```

위의 명령어를 터미널에 입력하면 아래 사진처럼 마지막 PR 이후의 커밋 로그를 한 줄씩 확인할 수 있다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/170821255-d21d5d26-d67f-4de3-96c4-6b59c8665656.png" alt="git commit log 한 줄로 확인한 이미지" width="900" loading="lazy" />
</center>

<br />
<br />

나는 현재 커밋을 5개했고, 이제 이 5개의 커밋들을 로컬에서 하나로 묶어서 push를 날려줄 생각이다. git rebase를 통해 git squash를 시작해보자! 터미널에서 아래 명령어를 입력해준다.

```
git rebase -i HEAD~5
```

이렇게 명령어를 입력하면 아래 이미지처럼 vi 에디터로 넘어가게 된다. 그러면 각 커밋들 앞에 pick이라고 써있는데, 맨 위의 commit만 pick으로 남겨두고 나머지는 `squash`로 바꿔줄 예정이다. 그러면 pick 커밋이 이제 대표 커밋이 되고, 커밋 로그에 pick 커밋이 제일 앞에 나타내게 된다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/170821256-98e8a968-06a1-487f-b505-df547561f0c3.png" alt="git -i rebase 후 vi 에디터에 진입한 이미지" width="600" loading="lazy" />
</center>

<br />
<br />

vi 에디터로 넘어왔다면 `i`를 입력해서 insert 모드에 진입하자. 그리고 맨 위의 커밋을 제외하고 나머지 커밋을 `squash`로 변경해주면 된다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/170821258-c6a396a9-b822-4504-808a-04fb4d810a98.png" alt="git commit log 한 줄로 확인한 이미지" width="900" loading="lazy" />
</center>

하나씩 다 squash로 바꿔주고 있는 모습이다. 그러면 아래 이미지처럼 맨 위의 commit을 제외하고 나머지 커밋들 앞에는 `squash`가 있으면 된다. 아래 이미지처럼!

<center>
<img src="https://user-images.githubusercontent.com/75570915/170821259-7809d5bf-d55e-4ff7-80a9-e910bed43cfd.png" alt="git squash 전략을 사용한 vi 에디터 이미지" width="900" loading="lazy" />
</center>

그리고 vi 에디터의 insert 모드를 종료해주기 위해 `esc 키`를 눌러준다. 그 다음 `:wq`를 입력하면 vi 에디터를 저장하고 종료하게 된다. 하지만 interactive rebase에서 squash를 설정하고 저장 후 종료하면 이제 rewrite하는 화면으로 전환하게 된다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/170821260-39655789-cce5-43fa-afd9-658fe8d63f4e.png" alt="vi 에디터 커밋 메시지 rewrite 모드" width="600" loading="lazy" />
</center>

<br />

여기서 commit message를 rewrite할 수 있다. 그리고 나는 첫번째 커밋(pick commit)의 메시지를 수정해 주었다. 만약 수정하고 싶지 않으면 vi 에디터를 저장하고 종료하면 된다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/170823920-93859527-edb4-4b87-8f11-b3565b433b14.png" alt="vi 에디터 커밋 메시지 rewrite 모드에서 커밋 메시지 수정" width="600" loading="lazy" />
</center>

<br />

혹시나 만약 vi 에디터에서 `실수로 잘못눌렀거나 에러가 생겼다면` 에디터 종류 후 아래 명령어로 git rebase를 취소하고 다시 처음부터 진행하면 된다!

```
git rebase --abort
```

<br />
<br />

커밋 메시지 rewrite 부분까지 다 끝마치고 저장 후 vi에디터를 종료했다면 해당 커밋을 push해주면 된다!

<center>
<img src="https://user-images.githubusercontent.com/75570915/170850351-c90aed2f-a46e-45ce-af1f-eea44ad2186c.png" alt="git rebase 완료 후 push" width="900" loading="lazy" />
</center>

<br />
<br />

성공적으로 push를 했으면 이제 PR을 올리고 내 커밋 log가 어떻게 기록되어 있는지 확인해보자.

<center>
<img src="https://user-images.githubusercontent.com/75570915/170850552-fbafe334-79e4-42b9-93d8-89a94e70b9c7.png" alt="bitbucket 커밋 로그" width="900" loading="lazy" />
</center>

PR을 올리고 커밋 내역을 확인해보니 한 줄로 기록되어 있는 것을 확인할 수 있었다.

<br />
<br />
<br />

## 글을 마치며

그동안 나는 커밋을 상세하게 남겨 놓으면 언제든 해당 작업 내용을 확인하기 쉬워서 장기적으로 좋다고 생각했다. 하지만 팀원과 레포지토리를 같이 쓰고 있는 상황에서 내 커밋 로그만 무수히 많이 찍히고 있는 상황이라면.. 팀원은 단지 자신의 커밋 로그를 찾는데에도 많은 시간을 할애할 가능성이 높다.

이러한 부분들을 방지하고자 git squash 전략을 도입해 보았는데 현재 매우 만족하고 있고, 팀원들도 만족하고 있는 상황이다. (이전 커밋 로그들이 너무 심각하게 많았었나보다.. 지금은 git graph가 많이 개선되어 있는 상황이다.)

단순히 커밋 로그를 무수히 많이 남긴다고 해서 일을 열심히 하는 것처럼 보인다거나, 개발을 엄청 잘한다거나 그런건 없다. 커밋 메시지도 결국엔 협업을 하고 있다는 과정이라고 생각하고, 우리 팀이 더 좋은 개발 문화를 만들어 나가기 위한 하나의 수단이라고도 생각한다. 그렇기 때문에 커밋 로그를 한 줄로 묶으면서 서로의 커밋 메시지를 쉽게 확인할 수 있게 해주는 git squash 전략을 앞으로도 쭉 사용할 계획이다.
