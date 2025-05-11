import { NextRequest, NextResponse } from "next/server";
import { LANGUAGES } from '@/constants/languages';

// 根据浏览器默认语言进行重定向
// 默认为中文
export function middleware(request: NextRequest) {
    const acceptLanguage = request.headers.get('accept-language') || 'en-US';
    const primaryLanguage = acceptLanguage.split(',')[0];
    const url = request.nextUrl.clone();
    
    for (const key in LANGUAGES) {
        if (primaryLanguage.startsWith(key)) {
            url.pathname = `/${key}`;
            return NextResponse.redirect(url);
        }
    }
    url.pathname = `/zh`;
    return NextResponse.redirect(url);
}

// 只对首页进行重定向处理
export const config = {
    matcher: [
        // Skip all internal paths (_next)
        // '/((?!_next).*)',
        // Optional: only run on root (/) URL
        '/'
    ],
}