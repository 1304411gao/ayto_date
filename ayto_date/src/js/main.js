import dayjs from 'dayjs'
import $ from 'jquery'

class AytoDate {

    constructor(_options){

        this.options = _options
        this.init()
    }
    reset(){

        // 当前时间组合 YYYY-MM-DD
        this.currentDate = `${dayjs().format('YYYY')}-${dayjs().format('MM')}-${dayjs().format('DD')}`

        // 初始化居中的日期 ※
        this.initDate = this.options.initDate || this.currentDate

        // 最大时间 默认为一年后 ※
        this.maxDate = this.options.maxDate  || `${Number(dayjs().format('YYYY')) + 1}-${dayjs().format('MM')}-${dayjs().format('DD')}`

        // 最小时间 默认为一年前 ※
        this.minDate = this.options.minDate  || `${Number(dayjs().format('YYYY')) - 1}-${dayjs().format('MM')}-${dayjs().format('DD')}`
        

    }
    init(){
        console.log('init')
        this.validateOptions()
        this.reset()
        this.validateSetting()
        this.createHtmlCode()
    }
    // 是否为闰年
    isLeapYear(){
        return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)
    }
    // 是否为YYYY-MM-DD
    isYYYYMMDD(_dateStr){
        // 这里的正则并不是很严谨，如有需求再说
        let reg = /^\d{4}\-[0-1]\d\-[0-3]\d$/

        return reg.test(_dateStr)
    }
    // 验证 Options 过滤掉瞎传的日期参数
    validateOptions(){

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
    validateSetting(){

        const runCode = ()=>{
            this.initDate = `${dayjs().format('YYYY')}-${dayjs().format('MM')}-${dayjs().format('DD')}`
            this.maxDate = `${Number(dayjs().format('YYYY')) + 1}-${dayjs().format('MM')}-${dayjs().format('DD')}`
            this.minDate = `${Number(dayjs().format('YYYY')) - 1}-${dayjs().format('MM')}-${dayjs().format('DD')}`
        }

        if(dayjs(this.maxDate).valueOf() <= dayjs(this.minDate).valueOf()){
            console.error('maxDate < minDate 已重置为默认时间')
            runCode()
        }

        if(dayjs(this.initDate).valueOf() <= dayjs(this.minDate).valueOf()){
            console.error('initDate < minDate 已重置为默认时间')
            runCode()
        }

        if(dayjs(this.initDate).valueOf() > dayjs(this.maxDate).valueOf()){
            console.error('initDate > maxDate 已重置为默认时间')
            runCode()
        }
    }
    // 生成html片段
    createHtmlCode(){

        let monthTotal = dayjs(this.maxDate).diff(dayjs(this.minDate), 'month')
        console.log(monthTotal)
        // 从起始时间开始生成
        let code =
            `<div class="ayto-date-block">
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
                                html += `<p class="ayto-date-calendar-title" style="${i==0? 'display: none' : ''}">${dayjs(this.getDiffDate(this.minDate, i, 1)).format('YYYY')}年${dayjs(this.getDiffDate(this.minDate, i, 1)).format('MM')}月</p>`
                                html += ` <ul class="ayto-date-calendar">
                                            <li>1</li>
                                        </ul>`
                            }
                            return html
                        })()}
                    </div>
                </div>
            </div>`

        $('body').append(code)
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
}


let aytoDate = new AytoDate({
    maxDate: '2022-10-22'
})
console.log(aytoDate)

