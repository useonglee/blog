---
title: "자바스크립트 Number & Math & Date & RegExp 정리"
date: 2022-05-23
lastmod: "2022-05-23"
tags: ["javascript", "study"]
draft: false
summary: "자바스크립트 딥다이브 28장 Number, 29장 Math, 31장 RegExp 정리"
layout: PostSimple
type: blog
---

<TOCInline toc={props.toc} exclude="목차" toHeading={2} />

### 들어가며

현재 모던 자바스크립트 Deep Dive 책 완전 정복을 목표로 스터디를 하고 있다. 스터디 분들과 번갈아가며 맡은 내용에 대해 발표를 진행한다. 그 중에서 모던 자바스크립트 28장, 29장, 31장 발표를 맡았으며 발표 자료에 쓰기 위해 책을 읽고 정리한 글이다.

## 28장 Number

자바스크립트 표준 빌트인 객체인 Number 객체는 생성자 함수 객체다. 따라서 new 연산자와 함께 호출하여 Number 인스턴스를 생성할 수 있다. 그리고 생성자 함수에 인수를 전달하지 않으면 `[[NumberData]]` 내부 슬롯에 0을 할당한 Number 객체를 생성한다.

```js
const numInstance = new Number();
console.log(numImstance);
// Number {0}
// [[PrimitiveValue]]: 0
```

위의 콘솔 결과를 보면 브라우저에서 접근할 수 없는 `[[PrimitiveValue]]` 프로퍼티가 보이는데, 이는 `[[NumberData]]` 내부 슬롯을 가리킨다.

그리고 인수 값으로 숫자를 전달하면 숫자를 할당한 Number 객체를 생성하고, 숫자가 아니어도 숫자로 강제 타입 변환을 한다.

```js
const num10 = new Number(10);
const numString10 = new Number("10");

console.log(num10);
// Number {10}
// [[PrimitiveValue]]: 10

console.log(numString10);
// Number {10}
// [[PrimitiveValue]]: 10

// 만약 불리언타입을 넣었다면?
Number(true); // 1
Number(false); // 0
```

<br />

### Number.EPSILON

ES6에서 도입된 Number.EPSILON은 1과 1보다 큰 숫자 중에서 가장 작은 숫자와의 차이와 같다. 아래 예제와 같이 **부동소수점 산술 연산은 정확한 결과를 기대하기 어렵다.**

부동소수점 산술 연산을 하게되는 이유는 자바스크립트 숫자 타입의 값이 IEEE 754의 부동소수점 표현 형식 중 배정밀도 64비트 부동소수점 형식을 따르기 때문이다. C나 자바의 경우, 정수와 실수를 구분해서 int, long, float, double 등과 같은 타입으로 정수와 실수를 구분해서 사용하지만, 자바스크립트의 경우 모든 수를 실수로 처리하기 때문에 하나의 숫자 타입만 존재한다.

그러면 이러한 오차를 잡기 위해 EPSILON이 어떤 역할을 하는지 알아보자.

```js
0.1 + 0.2; // -> 0.30000000000000004
0.1 + 0.2 === 0.3; // false
```

Number.EPSILON은 부동소수점으로 인해 발생하는 오차를 해결하기 위해 사용한다.

```js
function isEqual(a, b) {
  // a와 b를 뺀 값의 절대값이 Number.EPSILON보다 작으면 같은 수로 인정한다.
  return Math.abs(a - b) < Number.EPSILON;
}

isEqual(0.1 + 0.2, 0.3); // -> true
```

<br />

### Number.MAX_VALUE

자바스크립트에서 표현할 수 있는 가장 큰 양수값이며, Number.MAX_VALUE보다 큰 숫자는 Infinity다.

```js
Number.MAX_VALUE; // -> 1.7976931348623157e+308
Infinity > Number.MAX_VALUE;
```

<br />

### Number.MIN_VALUE

자바스크립트에서 표현할 수 있는 가장 작은 값이며, 보다 작은 수는 0이다.

```js
Number.MIN_VALUE; // -> 5e-324
Number.MIN_VALUE > 0; // -> true
```

<br />

### Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER

자바스크립트에서 \*\*안전하게 표현할 수 있는 가장 큰 정수값과 가장 작은 정수값이다.

```js
Number.MAX_SAFE_INTEGER; // -> 9007199254740991
Number.MIN_SAFE_INTEGER; // -> -9007199254740991
```

<br />

### Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY

양의 무한대 또는 음의 무한대를 나타낸다.

```js
Number.POSITIVE_INFINITY; // -> Infinity
Number.NEGATIVE_INFINITY; // -> -Infinity
```

<br />

### Number.NaN

NaN은 숫자가 아님(Not-a-Number)을 나타내는 숫자값이다. === window.NaN과 같다.

```js
Number.nan; // -> NaN
```

<br />

### Number.isFinite

isFinite는 인수로 전달받은 값이 유한수(Infinity 또는 -Infinity)인지 검사하고 불리언 값으로 반환한다.

```js
Number.isFinite(0); // true
Number.isFinite(Number.MAX_VALUE); // true

Number.isFinite(Infinity); // false
Number.isFinite(NaN); // false
```

하지만 Number 메서드가 아닌 `isFinite` 함수는 암묵적 타입변환을 하지 않아서 다음과 같은 결과를 가져온다.

```js
Number.isFinite(null); // -> false

// null은 타입변환을 하면 0이 됨
isFinite(null); // -> true
```

<br />

### Number.isInteger

인수로 전달된 값이 정수인지 검사해서 불리언 값으로 반환한다.

```js
Number.isInteger(0); // -> true
Number.isInteger(0.5); // -> false, 정수가 아님
Number.isInteger("123"); // -> false, 암묵적 타입변환 안함
```

<br />

### Number.isNaN

인수로 전달된 값이 NaN인지 검사해서 불리언 값으로 반환한다.

```js
Number.isNaN(NaN); // -> true
isNaN(undefined); // -> true
// undefined는 NaN으로 암묵적 타입변환, 여기서 undefined는 NaN이 됨
// undefined 암묵적 타입변환은 Numbe r메서드가 아닌 isNaN에서만 가능
```

<br />

### Number.isSafeInteger

안전한 정수인지 검사해서 불리언 값으로 반환한다. 안전한 정수값은 -(253 -1)과 253 -1 사이의 정수값이다.

```js
Number.isSafeInteger(1000000000000000); // -> true
Number.isSafeInteger(1000000000000001); // -> false
Number.isSafeInteger(0.5); // -> false
```

<br />

### Number.prototype.toExponential

지수 표기법으로 변환하여 문자열로 반환한다.

```js
(77.1234).toExponential(); // '7.71234e+1'
77.toExponential() // Uncaught SyntaxError: Invalid or unexpected token
```

### Number.prototype.toFixed

숫자를 반올림하여 문자열로 반환한다.

```js
(12.6789).toFixed(); // -> "13"

// 소수점 이하 1자릿수 유효, 나머지 반올림
(12.6789).toFixed(1); // -> "12.7"
```

### Number.prototype.toPrecision

인수로 전달받은 전체 자릿수로 표현할 수 없는 경우 지수 표기법으로 결과를 반환한다.

```js
(12.34).toPrecision(); // -> "12.34"
(12.34).toPrecision(1); // -> "1e+1"
(12.34).toPrecision(2); // -> "12"
```

<br />
<br />

## 29장 Math

### Math.PI

```js
Math.PI; // -> .141592653589793
```

<br />

### Math.abs

인수로 전달된 숫자의 절대값을 반환한다.

```js
Math.abs(-1); // -> 1
Math.abs("-1"); // -> 1
Math.abs(""); // -> 0
Math.abs(NaN); // -> 0
Math.abs({}); // -> NaN
Math.abs(undefined); // -> NaN
Math.abs("string"); // -> NaN
```

<br />

### Math.round

소수점 이하를 반올림한 정수를 반환한다.

```js
Math.round(1.4); // -> 1
Math.round(1.6); // -> 2
Math.round(); // -> NaN
```

<br />

### Math.ceil

소수점 이하를 올림한 정수를 반환한다.

```js
Math.ceil(1.4); // -> 2
Math.ceil(1.6); // -> 2
Math.ceil(); // -> NaN
```

<br />

### Math.floor

소수점 이하를 내림한 정수를 반환한다.

```js
Math.floor(1.4); // -> 1
Math.floor(1.6); // -> 1
Math.floor(); // -> NaN
```

<br />

### Math.sqrt

인수로 전달된 숫자의 제곱근을 반환한다.

```js
Math.sqrt(9); // -> 3
Math.sqrt(-9); // -> NaN
Math.sqrt(2); // -> 1.4142135623730951
Math.sqrt(); // -> NaN
```

<br />

### Math.random

0에서 1미만의 임의 난수를 반환한다. 0은 포함되지만 1은 포함되지 않는다.

```js
Math.random(); // 0에서 1 미만의 랜덤 실수

const random = Math.floor(Math.random() * 10 + 1);
console.log(random); // 1에서 10 범위의 정수

// Math.random() * 10를 통해 1의 자리수를 반환하게 만든다.
// 0도 포함이 되니 +1을 해준다.
// 최대로 높은 난수는 9.9이며, Math.floor로 정수를 만들어준다.
```

<br />

### Math.pow

첫번째 인수를 밑, 두번째 인수를 지수로 거듭제곱한 결과를 반환한다.

```js
Math.pow(2, 8); // -> 256
```

<br />

### Math.max, Math.min

전달받은 인수 중에서 가장 큰 수 또는 가장 작은 수를 반환한다. 전달받지 못하면 -Infinity, Infinity를 반환한다.

```js
Math.max(1, 2, 3); // -> 3
Math.min(1, 2, 3); // -> 1

Math.max(); // -> -Infinity
Math.min(); // -> Infinity

// 배열에서는 스프레드 문법 사용을 해야한다.
Math.max(...[1, 2, 3]); // -> 3
Math.min(...[1, 2, 3]); // -> 1
```

<br />
<br />

## 30장 Date

표준 빌트인 객체 Date는 날짜와 시간을 위한 메서드를 제공하는 빌트인 객체이면서 생성자 함수이다. 기술적인 표기에서는 UTC(협정 세계시)가 사용되며, KST(한국 표준시)는 UTC에 9시간을 더한 시간이다. 즉, UTC 00:00 AM은 KST 09:00 AM이다. 그리고 Date 생성자 함수로 생성한 Date 객체는 기본적으로 현재 날짜와 시간을 나타내는 정수값을 가진다.

Date 생성자 함수에 숫자 타입의 인수를 전달하면 1970년 1월 1일 00:00:00 (UTC)을 기점으로 인수로 전달된 밀리초만큼 경과한 날짜와 시간을 나타내는 Date 객체를 반환한다.

```js
new Date();
// Wed May 25 2022 22:05:58 GMT+0900 (한국 표준시)

new Date(0);
// Thu Jan 01 1970 09:00:00 GMT+0900 (한국 표준시)
```

<br />

### new Date(dateString)

Date 생성자 함수에 날짜와 시간을 나타내는 문자열을 인수로 전달하면 해당 날짜의 Date 객체를 반환한다.

```js
new Date("Wed May, 25 2022 22:05:58");
// Wed May 25 2022 22:05:58 GMT+0900 (한국 표준시)
```

<br />

### Date 메서드

```js
// 1970년 1월 1일 00:00:00 (UTC) 기점으로 현재까지 경과한 밀리초 반환
Date.now();
// 1653484840938

// 객체의 연도를 나타내는 정수를 반환
new Date("2022/05/25").getFullYear(); // '2022'
```

<br />

### Date set\*

Date 객체에 연도, 월, 일, 시간, 분, 초 단위를 설정할 수 있다.

```js
const today = new Date();

// 연도 지정
today.setFullYear(2022);
today.getFullYear(); // 2022

// 월/일 지정
today.setMonth(5, 25); // 5월 25일
today.getMonth(); // 5

// 날짜 지정
today.setDate(1);
today.getDate(); // 1

// 시간 지정
today.setHours(22);
today.getHours();

// 분 지정
today.setMinutes(30);
today.getMinutes(); // 30
```

<br />

### Date.prototype.toISOString

ISO 8601 형식으로 Date 객체의 날짜와 시간을 표현한 문자열을 반환한다. 그리고 보통 서버에서 데이터를 받을 때 주로 `created_at`이란 키 값으로 시간 데이터를 받는데, 이 때도 ISO 8601 형식으로 받는다.

```js
const today = new Date("2022/5/25/19:49");

today.toISOString(); // '2022-05-25T10:49:00.000Z'

today.toISOString().slice(0, 10); // 2022-05-25
today.toISOString().slice(0, 10).replace(/-/g); // 20220525
```

하지만 이 형식은 utc 기준이므로 현재 시간보다 -9시간을 한 시간으로 표시해준다. 그리고 사용자가 보기 좋은 시간으로 표시하려면 매번 자바스크립트 메서드를 활용해야 하는데 이러한 부분들을 매번 한다고 생각하면 정말 귀찮은 일이다. 그래서 실제로 나는 다음과 같은 유틸 함수를 만들어서 사용하고 있다. 서버에서 받은 값들을 아래 유틸함수를 통해 가공 후 사용하고 있다. dayjs는 라이브러리이므로 따로 설치해주어야 한다.

```js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function dateFormatter(date: string) {
  return dayjs.utc(date).local().format("YYYY.MM.DD HH:mm");
}

const today = dateFormatter("2022-05-27T06:10:32");

console.log(today); // 2022.05.27 15:10
```

<br />

### Date를 활용한 시계 예제

```js
(function printNow() {
  const today = new Date();

  const dayNames = [
    "(일요일)",
    "(월요일)",
    "(화요일)",
    "(수요일)",
    "(목요일)",
    "(금요일)",
    "(토요일)",
  ];

  // getDay 메서드는 해당 요일(0 ~ 6)을 나타내는 정수를 반환한다.
  const day = dayNames[today.getDay()];

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const hour = today.getHours();
  const minute = today.getMinutes();
  const second = today.getSecond();
  const ampm = hour >= 12 ? "PM" : "AM";

  // 12시간제로 변경
  hour %= 12;
  hour = hour || 12;

  // 10 미만인 분과 초를 2자리로 변경
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;

  const now = `${year}년 ${month}월 ${date}일 ${day} ${hour}:${minute}:${second} ${ampm}`;

  console.log(now);

  // 1초마다 prinNow 함수를 재귀 호출한다.
  setTimeout(printNow, 1000);
})();
```

<br />
<br />

## 31장 RegExp (정규 표현식)

정규 표현식은 일정한 패턴을 가진 문자열의 집합을 표현하기 위해 사용한다. 자바스크립트의 고유 문법은 아니며, 대부분의 프로그래밍 언어와 에디터에 내장되어 있다.

```js
// 휴대폰 번호 정규식
const phoneNumber = "010-1234-567팔";
const regExp = /^\d{3}-\d{4}-\d{4}$/;

// test 매칭함수를 사용해서 설정해놓은 패턴과 맞는지 검사할 수 있다.
reqExp.test(phoneNumber); // -> false
```

정규 표현식을 생성하는 리터럴은 다음과 같다.

<center>
<img src="https://user-images.githubusercontent.com/75570915/169816428-6ef1646c-a40a-4dc7-8826-6aa06b338842.png" alt="정규 표현식 리터럴" width="500" loading="lazy" />
</center>

정규 표현식 리터럴을 사용해서 생성한다면 다음과 같이 만들 수 있다.

```js
const helloWorld = "My name is Ayaan";

// 패턴: Ayaan
// 플래그: i (i는 대소문자를 구별하지 않고 검색하겠다는 뜻)
const regexp = /Ayaan/i;
regexp.test(helloWorld); // -> true
```

<br />

### RegExp.prototype.match

정규 표현식의 패턴을 검색하여 매칭 결과를 배열로 반환한다.

```js
const helloWorld = "My name is Ayaan";
const regexp = /Ayaan/;

helloWorld.match(regexp);
// ['Ayaan', index: 11, input: 'My name is Ayaan', groups: undefined]
```

<br />

### 플래그

| 플래그 | 의미        | 설명                                                |
| ------ | ----------- | --------------------------------------------------- |
| i      | Ignore case | 대소문자를 구분하지 않고 패턴 검색                  |
| g      | Global      | 대상 문자열 내에서 패턴과 일치하는 문자열 전부 검색 |
| m      | Multi line  | 문자열의 행이 바뀌더라도 패턴 검색                  |

<br />

```js
const helloWorld = "Ayaan, Hello~! Ayaan";

helloWorld.match(/Ayaan/i);
// ['Ayaan', index: 0, input: 'Ayaan, Hello~! Ayaan', groups: undefined]

helloWorld.match(/Ayaan/g);
// ['Ayaan', 'Ayaan']

helloWorld.match(/Ayaan/gi);
// 대소문자 가리지 않으면서 패턴과 일치하는 문자열 전부 검색
// ['Ayaan', 'Ayaan']
```

<br />

### 임의의 문자열 검색

다음 예시는 문자의 내용과 상관없이 3자리 문자열과 매치한다.

```js
const target = "Is This all there is?";
const regExp = /.../g;

target.match(regExp);
// ['Is ', 'Thi', 's a', 'll ', 'the', 're ', 'is?']
```

<br />

### 반복 검색

```js
const target = "A AA B AAA";

// A가 최소 1번에서 2번 반복되는 전역 검색 패턴
const regExp = /A{1,2}/g;
target.match(regExp);
// ['A', 'AA']

// A가 최소 2번이상 반복되는 전역 검색 패턴
const regExp = /A{2,}/g;
target.match(regExp);
// ['AA', 'AAA']

// A가 최소 1번이상 반복되는 전역 검색 패턴
const regExp = /A+/g;
target.match(regExp);
// ['A', 'AA', 'AAA']
```

```js
// 0 ~ 9 반복 검색
const target = "A B 12 33333";
const regexp_01 = /[0-9,]+/g;
const regexp_02 = /[\d,]+/g;

target.match(regexp_01); // -> ['12', '33333']
target.match(regexp_02); // -> ['12', '33333']

// a ~ z 반복 검색
const target = "A B 12 AB aB 88";
const regexp_01 = /[A-Za-z]+/g;

target.match(regexp_01); // -> ['A', 'B', 'AB', 'aB']
```

```js
// 0 ~ 9가 아닌 문자또는 ','가 한 번 이상 반복되는 문자열 전역 검색
const target = "A B 12,34 AABB";
const regexp = /[\D,]+/g;

target.match(regexp); // -> ['A B ', ',', ' AABB']
```

```js
// a ~ z / A ~ Z 검색
const target = "A B 12,34 AABB _$@%!";
const regexp_01 = /[\w,]+/g;
const regexp_02 = /[\W,]+/g;

// \w와 \W는 반대로 동작한다.
target.match(regexp_01); // -> ['A', 'B', '12,34', 'AABB', '_']
target.match(regexp_02); // -> [' ', ' ', ',', ' ', ' ', '$@%!']
```

<br />

### NOT 검색

```js
// [...] 안의 '^'는 부정을 의미, [...] 바깥은 시작을 의미
const target = "A B C 0 1 2";
const regexp = /[^0-9]+/g;

// 숫자를 제외한 전역 검색
target.match(regexp); // ['A', 'B', 'C']
```

<br />

### 시작 위치로 검색

```js
const blog = "https://www.useonglee.dev";
const regexp = /^https/;

regexp.test(blog); // true
```

<br />

### 마지막 위치로 검색

```js
const blog = "https://www.useonglee.dev";
const regexp = /dev$/;

regexp.test(blog); // true
```

<br />

### 특정 단어로 시작하는지 검사

```js
const blog = "https://www.useonglee.dev";

// 아래 두개의 rexexq는 같은 뜻이다.
// ^은 시작을 의미
// ?앞에 있는 's'가 최대 한 번 이상 반복되는지 체크
// 'http://' 또는 'https://'로 시작하는지 검색
const regexp_01 = /^https?:\/\//;
const regexp_02 = /^(http|https):\/\//;

regexp_01.test(blog); // true
regexp_02.test(blog); // true
```

<br />

### 하나 이상의 공백으로 시작하는지 검사

```js
// '\s'는 여러 가지 공백 문자(스페이스, 탭)를 의미하며, [\t\r\n\v\f]와 같은 의미이다.

const target = " Hi !";

/^[\s]+/.test(target); // true
```

<br />

### 아이디로 사용 가능한지 검사

```js
const id = "ayaan0830";

// 알파벳 대소문자 또는 숫자로 시작하고 끝나며, 4 ~ 10자리인지 검사
/^[A-Za-z0-9]{4, 10}$/.test(id); // true
```

<br />

### 특수문자 포함 여부 검사

```js
const target = "abc#123@@";

/[^A-Za-z0-9]/gi.test(target); // true

// 특수문자 선택적 검사
/[\{\}\?\.\#\@]/gi.test(target); // -> true
```

<br />

### 정규 표현식 연습 사이트

- https://regexr.com
- https://regex101.com
