#aytoDate

## options参数

** 所传时间格式皆为YYYY-MM **
1. initDate: 初始化居中的日期 默认为当天
2. maxDate: 最大时间 默认为当前时间一年后
3. minDate: 最小时间 默认为当前时间一年前
4. type: 'single'选择单天 'plural'选择时间区间 默认为单天
5. startText: 起始日期 默认为 "起始日期"
6. endText: 结束日期 默认为 "结束日期"
7. switchMode: 'remove' | 'hidden' 默认 'remove', 如果实例化数量较少建议使用hidden

## 方法
- getValue 获取当前值
- hide 隐藏
- show 显示


## 回调函数
- onHideBefor: function 隐藏之前
- onShowBefor: function 显示之前


