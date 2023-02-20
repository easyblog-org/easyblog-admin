/**
 * 格式化时间
 * @param timestamp  时间戳
 * @param pattern    时间样式
 * @returns {string}
 */
export function formatDateTime(timestamp, pattern='yyyy-MM-dd HH:mm:ss') {
    if (timestamp != null) {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const mon = (date.getMonth() + 1 + '').padStart(2, '0')
        const day = (date.getDate() + '').padStart(2, '0')
        const hour = (date.getHours()  + '').padStart(2, '0')
        const min = (date.getMinutes()  + '').padStart(2, '0')
        const sec = (date.getSeconds()  + '').padStart(2, '0')

        if (pattern === 'yyyy-MM-dd HH:mm:ss') {
            return `${year}-${mon}-${day} ${hour}:${min}:${sec}`
        } else if (pattern === 'yyyy-MM-dd HH:mm') {
            return `${year}-${mon}-${day} ${hour}:${min}`
        } else if (pattern === 'yyyy-MM-dd HH') {
            return `${year}-${mon}-${day} ${hour}`
        } else if (pattern === 'yyyy-MM-dd') {
            return `${year}-${mon}-${day}`
        } else if (pattern === 'yyyy-MM') {
            return `${year}-${mon}`
        } else if (pattern === 'yyyy') {
            return `${year}`
        } else if (pattern === 'HH:mm:ss') {
            return `${hour}:${min}:${sec}`
        }
    }
    return ''
}