// 项目中的接口
export const API = {
    FRONT: {
        VISIT: '/api/front/visit/', // 前端访问记录
        CLICK: '/api/front/click/', // 前端点击记录
        SSE_REFRESH: '/api/front/sse-refresh/', // 更新内容后通知前端刷新
    },
    ADMIN: {
        SIGN_IN: '/api/admin/sign-in/', // 登录系统
        VERIFY: '/api/admin/verify/', // 校验token
        REFRESH_TOKEN: '/api/admin/refresh-token/', // 刷新token
        SIGN_OUT: '/api/admin/sign-out/', // 登出系统
        SEND_MAIL_CODE: '/api/admin/send-mail-code/', // 发送邮件验证码
        CHECK_MAIL_CODE: '/api/admin/check-mail-code/', // 校验邮件验证码
        RESET_PASSWORD: '/api/admin/reset-password/', // 重置密码
        ROLE_NAMES: '/api/admin/role-names/', // 获取当前用户所有角色名
        UPDATE_USER_INFO: '/api/admin/update-user-info/', // 更新用户信息
        UPLOAD: '/api/admin/upload/', // 上传文件
        SSE_REFRESH: '/api/admin/sse-refresh/', // 更新内容后通知管理端刷新
        UPDATE_META: '/api/admin/update-meta/', // 更新网站元信息
        CATEGORY: '/api/admin/category/', // 类别
        ITEM: '/api/admin/item/', // 项目
        STATISTICS: '/api/admin/statistics/', // 统计
    },
}