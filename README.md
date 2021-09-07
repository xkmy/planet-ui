### Introduction

一个 react ui 库,使用 react hooks + typescript

### Online demo
https://codesandbox.io/s/planet-ui-p33ym?file=/src/App.js

### Install

> 使用 npm

```
npm i @arrebol/planet-ui
```

> 使用 yarn

```
yarn add @arrebol/planet-ui
```

### Usage

1 .全部引入

```tsx
import React from 'react'
import { Button } from '@arrebol/planet-ui'
import '@arrebol/planet-ui/dist/planet-ui.css'

const App = () => {
  return <Button type='primary'>Planet Ui</Button>
}
```

2 . CSS 按需引入
planet-ui 默认支持组件的按需加载,但是 css 仍需要单独配置

- 可使用 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)

```ts
// .babelrc.js
module.exports = {
  plugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@arrebol/planet-ui',
        libraryDirectory: 'es',
        style: true
      },
      '@arrebol/planet-ui'
    ]
  ]
}
```

- 或者直接引入某一个组件的样式

```ts
import '@arrebol/planet-ui/es/Button/index.css'
```

### 现有组件

- Alert
- BackToTop
- Button
- Checkbox
- DatePicker
- Empty
- Input
- Message
- Notification
- NumberInput
- Pagination
- Progress
- Popover
- Select
- Spin
- Switch
- Table
- Tabs
- ToolTip
- TypeWrite

### Todo:

- 文档编写
