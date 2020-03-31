import dayjs from 'dayjs'
import $ from 'jquery'

class AytoDate {

    constructor(_options){

        this.el = _options.el
        this.options = _options
        this.type = _options.type
        // 所有li的date属性
        this.allDay = []
        this.value = ''
        this.valueTest = ''
        this.node = null
        this.monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        // 重置
        this.reset = ()=>{

            // 当前时间组合 YYYY-MM-DD
            this.currentDate = `${dayjs().format('YYYY')}-${dayjs().format('MM')}-${dayjs().format('DD')}`

            // 初始化居中的日期 ※
            this.initDate = this.options.initDate || this.currentDate

            // 最大时间 默认为一年后 ※
            this.maxDate = this.options.maxDate  || `${Number(dayjs().format('YYYY')) + 1}-${dayjs().format('MM')}-${dayjs().format('DD')}`

            // 最小时间 默认为一年前 ※
            this.minDate = this.options.minDate  || `${Number(dayjs().format('YYYY')) - 1}-${dayjs().format('MM')}-${dayjs().format('DD')}`

            // 标记起始日期
            this.startText = this.options.startText || '起始日期'
            // 标记结束日期
            this.endText = this.options.endText || '结束日期'

            this.onHideBefor = this.options.onHideBefor || null
            this.onShowBefor = this.options.onShowBefor || null
            this.onSave = this.options.onSave || null
            this.onInit = this.options.onInit || null

            // 选择单天 还是 时间区间 默认为单天呢
            this.isSingle = true

            if(_options.type == 'single'){
                this.isSingle = true
                this.value = this.options.value || ''
                this.valueTest = ''
            }else if(_options.type == 'plural'){
                this.isSingle = false
                this.value = this.options.value || []
                this.valueTest = []
            }
        }
        // 初始化
        this.init = ()=>{
            this.validateOptions()
            this.reset()
            this.validateSetting()
            this.createHtmlCode()
            if(this.onInit){
                this.onInit()
            }
        }

        // 验证 Options 过滤掉瞎传的日期参数
        this.validateOptions = ()=>{

            if(this.options.initDate && !this.isYYYYMMDD(this.options.initDate)){
                console.error('initDate参数格式错误 已重置为默认时间')
                this.options.initDate = undefined
            }
            if(this.options.maxDate && !this.isYYYYMMDD(this.options.maxDate)){
                console.error('maxDate参数格式错误 已重置为默认时间')
                this.options.maxDate = undefined
            }
            if(this.options.minDate && !this.isYYYYMMDD(this.options.minDate)){
                console.error('minDate参数格式错误 已重置为默认时间')
                this.options.minDate = undefined
            }
        }
        // 验证时间设置错误情况
        this.validateSetting = ()=>{

            const runCode = ()=>{
                this.initDate = `${dayjs().format('YYYY')}-${dayjs().format('MM')}-${dayjs().format('DD')}`
                this.maxDate = `${Number(dayjs().format('YYYY')) + 1}-${dayjs().format('MM')}-${dayjs().format('DD')}`
                this.minDate = `${Number(dayjs().format('YYYY')) - 1}-${dayjs().format('MM')}-${dayjs().format('DD')}`
            }

            if(dayjs(this.maxDate).valueOf() <= dayjs(this.minDate).valueOf()){
                console.error('maxDate < minDate 已重置为默认时间')
                runCode()
            }

            if(dayjs(this.initDate).valueOf() < dayjs(this.minDate).valueOf()){
                console.error('initDate < minDate 已重置为默认时间')
                runCode()
            }

            if(dayjs(this.initDate).valueOf() > dayjs(this.maxDate).valueOf()){
                console.error('initDate > maxDate 已重置为默认时间')
                runCode()
            }
        }
        // 生成html片段
        this.createHtmlCode = ()=>{
            let stamp = this.getRandom()
            this.stamp = stamp
            let monthTotal = dayjs(this.maxDate).diff(dayjs(this.minDate), 'month')

            // 从起始时间开始生成
            let code =
                `<div class="ayto-date-block" id="ayto-date-${this.stamp}">
                <i class="fa fa-fw fa-close ayto-date-close"></i>
                <div class="ayto-date-header">
                    <div class="ayto-date-title">选择日期</div>
                    <ul class="ayto-date-weeks">
                        <li>日</li>
                        <li>一</li>
                        <li>二</li>
                        <li>三</li>
                        <li>四</li>
                        <li>五</li>
                        <li>六</li>
                    </ul>
                </div>
                <div class="ayto-date-content">
                    <p class="ayto-date-content-title">${dayjs(this.minDate).format('YYYY')}年${dayjs(this.minDate).format('MM')}月</p>
                    <div class="ayto-date-calendar-list">
                        ${(()=>{
                            let html = ``
                            for(var i = 0; i <= monthTotal; i++){
                                let cYear = dayjs(this.getDiffDate(this.minDate, i, 1)).format('YYYY')
                                let cMonth = dayjs(this.getDiffDate(this.minDate, i, 1)).format('MM')
                                html += `<p class="ayto-date-calendar-title" style="${i==0? 'display: none' : ''}">${cYear}年${cMonth}月</p>`
                                
                                // 这里要传入参数 告诉insertDateNumber当前处于起始月还是结束月 还是什么都不是
                                let type = ''
                                if(i == 0){
                                    type = 'start'
                                }else if(i == monthTotal){
                                    type = 'end'
                                }
                                html += ` <ul class="ayto-date-calendar" data-date="${cYear}年${cMonth}月">${this.insertDateNumber(cYear, cMonth, type)}</ul>`
                            }
                            return html
                        })()}
                    </div>
                </div>
                <div class="ayto-date-bottom-line"><button class="ayto-date-sumbit">确定</button></div>
            </div>`

            this.htmlCode = code

            if(this.options.switchMode == 'hidden'){
                this.appendHtmlCode()
            }
        }

        this.appendHtmlCode = ()=>{
            $('body').append(this.htmlCode)

            this.node = $('#ayto-date-' + this.stamp)
            this.bindScroll()
            this.bindClick()
            this.active()
        }

        this.insertDateNumber = (_year, _month, _type) => {

            // 计算得出该月总天数
            // 自定义的算法
            let isLeapYear = this.isLeapYear(_year)
            isLeapYear? this.monthDays[1] = 29 : this.monthDays[1] = 28
            let dayNum = this.monthDays[Number(_month - 1)]
            // dayjs的方法
            let dayNum1 = dayjs(_year+'-'+_month).daysInMonth()

            let html = ``

            // mindate 和 maxdate的D
            let startDayNum = Number(dayjs(this.minDate).format('D'))
            let endDayNum = Number(dayjs(this.maxDate).format('D'))

            // 还想知道这个月的第一天是周几呢
            let oneNumber = Number(dayjs(_year+'-'+_month).format('d'))
            // 如果是起始月 那就得重新计算这个值
            if(_type == 'start'){
                oneNumber = Number(dayjs(this.minDate).format('d'))
            }

            // ah 如果不是周日 就要根据oneNumber添加空白li
            for(var i = 0; i < oneNumber; i++){
                html +=`<li class="ayto-blank-li" data-type="blank"></li>`
                this.allDay.push(undefined)
            }

            // 根据该月天数添加数值
            for(var i = 0; i < dayNum1; i++){
                // 在第一个月与最后一个月时，在阈值之外的日期要被干掉！
                if(_type == 'start' && i+1 < startDayNum){
                    continue
                }
                if(_type == 'end' && i+1 > endDayNum){
                    break
                }
                html +=`<li data-date="${_year+'-'+_month+'-'+(i+1 < 10? '0'+(i+1) : i+1)}"><span>${i+1}</span></li>`
                this.allDay.push(_year+'-'+_month+'-'+(i+1 < 10? '0'+(i+1) : i+1))
            }
            return html
        }
        this.bindScroll = ()=>{
            let bol = true
            let $calendars = this.node.find('.ayto-date-calendar')
            let calendarTopArray = []
            $calendars.each(function(){
                calendarTopArray.push($(this).position().top)
            })
            let self = this
            this.node.find('.ayto-date-calendar-list').on('scroll', function(e){
                if(bol){
                    bol = false

                    let scrollTop = $(this).scrollTop()
                    for(var i = 0; i < calendarTopArray.length; i++){

                        // 判断当前在哪里哦
                        // 如果当前大于最后一个了

                        if(scrollTop >= calendarTopArray[calendarTopArray.length - 1] || scrollTop >= calendarTopArray[i] && scrollTop < calendarTopArray[i+1]){

                            let title = $calendars.eq(i).data('date')

                            self.node.find('.ayto-date-content-title').text(title)
                        }
                    }

                    setTimeout(()=>{
                        bol = true
                    },20)
                }

            })
        }
        this.bindClick = () => {
            let self = this
            let $li = this.node.find('.ayto-date-calendar').children('li')
            $li.on('click', function(){
                if($(this).hasClass('ayto-blank-li')){
                    return false
                }

                let date = $(this).data('date')
                // 是否为单选
                if(self.isSingle){
                    self.value = date
                }else{
                    if(self.value.length == 0){
                        self.value.push(date)
                    }else if(self.value.length == 1){
                        // 判断第二个时间484比第二个靠前 如果靠前就清空
                        if(dayjs(date).valueOf() <= dayjs(self.value[0]).valueOf()){
                            self.value = []
                        }
                        self.value.push(date)

                    }else if(self.value.length == 2){
                        self.value = []
                        self.value.push(date)
                    }
                }
                self.markData()
                self.setSaveBtnType()
            })

            this.node.children('.ayto-date-close').on('click', () => {
                this.hide()
            })
            this.node.find('.ayto-date-sumbit').on('click', () => {
                this.save()
            })
            this.node.on('touchstart', (e) => {
                e.stopPropagation()
            })
            $(document).on('touchstart', (e) => {

                if(this.node.length && this.node.hasClass('ayto-date-block-show')){
                    this.hide()
                }
            })
            $(this.el).on('touchstart', (e) =>{
                e.stopPropagation()
                this.show()
            })
        }
        // 标记所选日期 (性能也许不好 看下面的方法)
        this.markDateBack = () => {
            let self = this
            let $li = this.node.find('.ayto-date-calendar').children('li')
            $li.removeClass('ayto-start-date ayto-end-date ayto-mark-date')
            // 是否为单选
            if(this.isSingle){

            }else{
                let startIndex = null
                for(var i = 0; i < $li.length; i++){

                    if(!$li.eq(i).data('date')){
                        continue
                    }

                    // 这是开始日期
                    if(this.value[0] == $li.eq(i).data('date')){

                        $li.eq(i).addClass('ayto-start-date')
                        startIndex = i
                    }
                    // 这是结束日期
                    if(this.value[1] == $li.eq(i).data('date')){

                        $li.eq(i).addClass('ayto-end-date')
                        break
                    }
                    // 这是中间的日期
                    if(startIndex != null && i > startIndex && this.value.length >= 2){
                        $li.eq(i).addClass('ayto-mark-date')
                    }
                }
            }
        }
        this.markData = () => {
            let $li = this.node.find('.ayto-date-calendar').children('li')
            $li.removeClass('ayto-start-date ayto-end-date ayto-mark-date').children('strong').remove()
            // 是否为单选
            if(this.isSingle){
                if(this.value == ''){
                    return false
                }
                let index = this.allDay.indexOf(this.value)
                $li.eq(index).addClass('ayto-mark-date')
            }else{
                if(this.value.length == 0){
                    return false
                }
                let startIndex = null, endIndex = null
                startIndex = this.allDay.indexOf(this.value[0])
                $li.eq(startIndex).addClass('ayto-start-date').append(`<strong>${this.startText}</strong>`)
                if(this.value.length >= 2){
                    endIndex = this.allDay.indexOf(this.value[1])
                    $li.eq(endIndex).addClass('ayto-end-date').append(`<strong>${this.endText}</strong>`)
                }

                for(var i = 0; i < $li.length; i++){
                    // 这是结束日期
                    if(this.value[1] == $li.eq(i).data('date')){
                        break
                    }
                    if(startIndex != null && i > startIndex && this.value.length >= 2){
                        $li.eq(i).addClass('ayto-mark-date')
                    }
                }
            }
        }
        // 控制确定按钮的状态
        this.setSaveBtnType = () => {

            if(self.isSingle){
                this.value.length != ''? this.node.find('.ayto-date-sumbit').removeClass('disable') : this.node.find('.ayto-date-sumbit').addClass('disable')
            }else{
                this.value.length == 2? this.node.find('.ayto-date-sumbit').removeClass('disable') : this.node.find('.ayto-date-sumbit').addClass('disable')
            }

        }
        // 定位到标记的位置
        this.active = () => {
            let $li = this.node.find('.ayto-date-calendar').children('li')
            let top = 0
            let index = 0
            if(this.value == [] || this.value == ''){
                index = this.allDay.indexOf(this.initDate)
                top = $li.eq(index).position().top
            }else{
                if(typeof this.value == 'string'){
                    index = this.allDay.indexOf(this.value)
                }else{
                    index = this.allDay.indexOf(this.value[0])
                }
                top = $li.eq(index).position().top
            }

            this.node.find('.ayto-date-calendar-list').scrollTop(top)
        }

        this.init()
    }

    // 原型链

    // 是否为闰年
    isLeapYear(year){
        return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)
    }
    // 是否为YYYY-MM-DD
    isYYYYMMDD(_dateStr){
        // 这里的正则并不是很严谨，如有需求再说
        let reg = /^\d{4}\-[0-1]\d\-[0-3]\d$/

        return reg.test(_dateStr)
    }

    // 获取相差月份日期的 YYYY-MM-DD
    getDiffDate(_date, _num, _direction){

        let YYYY = Number(dayjs(_date).format('YYYY'))
        let MM = Number(dayjs(_date).format('MM'))
        let DD = dayjs(_date).format('DD')

        // 要改变的月份
        let testNum = _num * _direction

        let addYear = parseInt(testNum / 12)
        let addMonth = testNum % 12

        // 如果月份相加大于12 年份进1 月份-12
        if(MM + addMonth > 12){
            addYear++
            addMonth = addMonth - 12
        }
        YYYY += addYear
        MM += addMonth

        return `${YYYY}-${MM < 10? '0'+MM : MM}-${DD}`
    }
    getRandom(){
        return Math.floor((Math.random()*100000)+1).toString() + new Date().getTime()
    }
    getValue(){
        return this.value
    }
    getDiffDay(){
        if(this.value.length >= 2){
            return dayjs(this.value[1]).diff(dayjs(this.value[0]),'day')
        }else{
            return '-'
        }


    }
    hide(){
        let v = JSON.parse(JSON.stringify(this.valueTest))
        this.value = this.valueTest
        if(this.onHideBefor){
            this.onHideBefor()
        }
        if(this.options.switchMode == 'hidden'){
            this.node.removeClass('ayto-date-block-show')
        }else{
            this.node.removeClass('ayto-date-block-show')
            this.node.remove()
            this.node = null
        }
    }
    save(){
        // 保存时要判断是否正确
        if(this.type == 'plural'){
            if(this.value.length != 2){
                return false
            }
        }else if(this.type == 'single'){
            if(this.value == ''){
                return false
            }
        }
        if(this.onSave){
            this.onSave()
        }
        if(this.options.switchMode == 'hidden'){
            this.node.removeClass('ayto-date-block-show')
        }else{
            this.node.removeClass('ayto-date-block-show')
            this.node.remove()
            this.node = null
        }
    }
    show(){
        let v = JSON.parse(JSON.stringify(this.value))
        this.valueTest = v
        this.setSaveBtnType()
        this.markData()
        if(this.options.switchMode == 'hidden'){
            if(this.onShowBefor){
                this.onShowBefor()
            }
            this.node.addClass('ayto-date-block-show')
        }else{
            if(this.node != null){
                return false
            }
            if(this.onShowBefor){
                this.onShowBefor()
            }
            this.appendHtmlCode()
            this.markData()
            this.node.addClass('ayto-date-block-show')
        }
    }

}

export default AytoDate
