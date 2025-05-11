import { PATH } from "@/constants/path";
import { LANG } from "@/languages/lang";
import { redirect } from "next/navigation";

export const getLang = async (params: Promise<{ language: string }>) => {
    // 获取多语言配置
    const { language } = await params;
    if (!Object.keys(LANG).includes(language)) {
        redirect(PATH.HOME);
    }
    const lang = LANG[language as keyof typeof LANG];
    return lang;
}