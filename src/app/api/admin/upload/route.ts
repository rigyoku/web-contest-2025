import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { CODE } from '@/constants/code';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ code: CODE.ERROR }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 存储文件的路径，这里将文件保存在项目的 public/admin-uploads/images 目录下
        const uploadDir = path.join(process.cwd(), 'public', 'admin-uploads', 'images');
        const fileExtension = path.extname(file.name);
        const filename = `${Date.now()}${fileExtension}`;
        const filePath = path.join(uploadDir, filename);

        // 确保 admin-uploads/ 目录存在
        try {
            await writeFile(filePath, buffer);
            console.log(`文件已成功保存至: ${filePath}`);
            return NextResponse.json({ code: CODE.SUCCESS, url: `/api/images/${filename}` });
        } catch (error) {
            console.error('保存文件失败:', error);
            return NextResponse.json({ code: CODE.ERROR }, { status: 500 });
        }
    } catch (error) {
        console.error('处理文件上传请求失败:', error);
        return NextResponse.json({ code: CODE.ERROR }, { status: 500 });
    }
}