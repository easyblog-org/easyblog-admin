import {ElLoading} from 'element-plus'

let loading = null

export const openLoading = (options = {
    text: "加载中"
}) => {
    const text = options.text
    loading = ElLoading.service({
        lock: true,
        text: text,
    })
}
export const closeLoading = () => {
    loading && loading.close()
}
