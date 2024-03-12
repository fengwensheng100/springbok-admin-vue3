import { ElLoading } from "element-plus";
// 定义⼀个请求次数的变量，⽤来记录当前页⾯总共请求的次数
let loadingRequestCount = 0;
// 初始化loading
let loadingInstance;
// 显⽰loading的函数并且记录请求次数 ++
const showLoading = () => {
  if (loadingRequestCount === 0) {
    // 全局实现loading效果，不⽤每个页⾯单独去v-loading
    // loading样式
    loadingInstance = ElLoading.service({
      lock: true,
      text: "努力加载中……",
      background: 'rgba(0, 0, 0, 0.1)'
    });
  }
  loadingRequestCount++;
};
// 隐藏loading的函数，并且记录请求次数 --
const hideLoading = () => {
  if (loadingRequestCount <= 0) return;
  loadingRequestCount--;
  if (loadingRequestCount === 0) {
    loadingInstance.close();
  }
};
export { showLoading, hideLoading };