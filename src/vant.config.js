import { Empty, Icon, Skeleton, Toast } from 'vant'

const vants = [Empty, Icon, Skeleton, Toast]

export default {
    /**
     * Vue.use 方法会自动调用install函数
     * Install Vant Component plugin
     * @param Vue
     */
    install(Vue) {
        vants.forEach(Component => {
            Vue.use(Component)
        })
    }

}