### Introduction

一个高效,轻量,便捷的 react ui 库,使用 react hooks + typescript 编写,已完成 10 多个组件的编写

### Install

> 使用 npm

```
npm i planet-ui
```

> 使用 yarn

```
yarn add planet-ui
```

### Usage

1 .全部引入

```tsx
import React from 'react'
import { Button } from 'planet-ui'
import 'planet-ui/dist/planet-ui.css'

class Page extends React.Component {
  render() {
    return <Button type='primary'>黄瓜ui</Button>
  }
}
```

2 .按需引入

```ts
import Button from 'planet-ui/es/button'
import 'planet-ui/es/button/index.css'
```

3 .使用 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)

```ts
// .babelrc.js
module.exports = {
  plugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'planet-ui',
        libraryDirectory: 'es',
        style: true
      },
      'planet-ui'
    ]
  ]
}

```

### Todo:

- 剩余组件的编写
- 文档编写
