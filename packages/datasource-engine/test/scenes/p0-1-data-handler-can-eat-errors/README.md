# 关于此场景

有些数据源的错误可以忽略（吃掉）-- 通过 dataHandler 捕获 error，只要其不重新抛出 error 而且不返回 rejected 状态的 Promise.
