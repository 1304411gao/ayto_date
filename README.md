`git clone git@github.com:1304411gao/ayto_date.git`

`cd ayto_date`

`npm install `

`npm run build`
## options参数

| 参数名 | 描述 | 格式 | 默认值 |
| --- | --- | --- | --- |
| switchMode | 组件隐藏方式从dom中消失: remove | css隐藏: hidden | String | 'remove' |
| initDate | 初始化显示时居中的日期 | YYYY-MM-DD | 当前日期 |
| maxDate | 可选择的最大日期 | YYYY-MM-DD | 当前时间一年后 |
| minDate | 可选择的最小日期 | YYYY-MM-DD | 当前时间一年前 |
| type | 选择单日:single | 时间区间: plural | String | 'single' |
| startText | 当type为plural时，可以设定选择起始日期的文字描述 | String | '起始日期' |
| endText | 当type为plural时，可以设定选择结束日期的文字描述 | String | '结束日期' |



## 方法
- getValue 获取当前值
- hide 隐藏
- show 显示


## 回调函数
- onHideBefor: function 隐藏之前
- onShowBefor: function 显示之前


## 实例
```
let aytoDate = new AytoDate({
    type: 'plural',
    minDate: '2019-12-16',
    maxDate: '2020-05-01',
    startText: '入住',
    endText: '离店',
    switchMode: 'hidden',
    onHideBefor: function(){
        console.log(this.getValue())
    }
})
```

