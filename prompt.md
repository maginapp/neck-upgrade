1. holiday today
2. poem
3. english

核心模块

标题区域：时间+日期+下一次节假日
内容：A: 历史上的今天 B: 诗词 C: english(word) + sentence

右上角功能：

1. 主题：暗黑模式/普通模式
2. 颈椎：普通/训练/高强度
3. 切换数据：古诗词/历史/英语

拆分App.tsx，分为组件，调整目录结构

[] todo

3. 颈椎模式支持
4. test

支持颈椎模式切换

1. 调整整模块结构，

   1. 页面核心模块包含 Header，FamousSaying，Content，始终居中展示
      1. 核心模块始终居中，内部为左右结构，左侧为Header + Content，左侧内部为上下结构，右侧为FamousSaying，
      2. 核心模块大小60vh,60vw,最小值为600px（h）,800px(w)
      3. 右侧模块想左侧旋转90deg，组成正方形
      4. Header，FamousSaying，Content这三个模块，以及在src/components中实现了
   2. 右上角为 Settings组件

2. 颈椎模介绍，核心功能是影响核心模块的旋转方向，从普通/训练/高强度三种模式，调整为增加自定义模式

   1. Normal：rotate取值 -> 核心模块随机旋转(45deg,60deg)或者(-45deg,-60deg)
   2. Training: rotate取值 -> 同普通模式，duration -> 10s
   3. Intense: rotate取值 -> 核心模块随机旋转(90deg,180deg)或者(-90deg,-80deg)
   4. Custom：支持配置：
      1. 旋转角度
      2. 自动切换时间，0为不切换
