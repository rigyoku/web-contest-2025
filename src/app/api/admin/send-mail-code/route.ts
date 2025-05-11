import { CODE } from "@/constants/code";
import { REDIS_KEY } from "@/constants/redis-key";
import { Redis } from "@/utils/redis";
import { NextRequest } from "next/server";
import nodemailer from 'nodemailer';

// 发送重置密码的邮箱验证码接口
export const POST = async (req: NextRequest) => {
    const { mail } = await req.json();
    
    // 创建MailHog传输器
    const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 30003,
        ignoreTLS: true // MailHog不需要TLS
    });
    
    // 生成6位随机验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        await transporter.sendMail({
            from: '"竞赛管理系统" <no-reply@contest-system.com>',
            to: mail,
            subject: '密码重置验证码',
            text: `您的验证码是: ${verificationCode}`,
            html: `<p>您的验证码是: <strong>${verificationCode}</strong></p>`
        });

        // 存储验证码到Redis，设置过期时间为5分钟
        await Redis.set(`${REDIS_KEY.RESET_CODE}:${mail}`, verificationCode, 'EX', 60 * 5);

        return Response.json(CODE.SUCCESS);
    } catch (error) {
        return Response.json(CODE.ERROR, { status: 500 });
    }
}