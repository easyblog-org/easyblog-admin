/**
 * 函数功能：给定参数对数组进行分组并排序
 * @param {Object} array [需要排序的数组]
 * @param {Object} f [该函数参数用于返回用于分组排序的对象]
 */
export default function groupBy(array: [], f: Function) {
    const groups = {};
    array.forEach(function (o) { //注意这里必须是forEach 大写
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    });
}