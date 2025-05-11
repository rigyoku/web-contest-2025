import { API } from "@/constants/api";
import { PATH } from "@/constants/path";
import { Axios } from "@/utils/client-token";
import { useEffect } from "react";
import { useAdminGlobal } from "./admin-global";

// 校验token
export const useSignInCheck = (require: boolean) => {
    const { setGlobal } = useAdminGlobal();
    useEffect(() => {
        const verify = async () => {
            try {
                const res = await Axios.post(API.ADMIN.VERIFY) as {
                    mail: string;
                    id: number;
                    username: string;
                    roles: number[];
                };
                if (require) {
                    // 认证通过, 需要登录, 存储user信息
                    setGlobal(global => ({
                        ...global,
                        user: res,
                    }));
                } else {
                    // 认证通过, 不需要登录, 跳转到App内
                    window.location.pathname = PATH.ADMIN;
                }
            } catch (error: any) {
                if (error.response?.status === 401 && require) {
                    // 认证不通过, 且需要登录, 跳转到登录页
                    window.location.pathname = PATH.SIGN_IN;
                }
            }
        }
        verify();
    }, [setGlobal, require]);
};