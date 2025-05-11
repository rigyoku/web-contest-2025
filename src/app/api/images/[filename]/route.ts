import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;
    const imagePath = path.join('/', process.cwd(), 'public', 'admin-uploads', 'images', filename);
    console.log(imagePath);

    try {
        const imageBuffer = await fs.readFile(imagePath);
        const contentType = getContentType(filename);

        if (!contentType) {
            return new NextResponse('Unsupported Media Type', { status: 415 });
        }

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
            },
        });
    } catch (error) {
        console.error('Error reading image:', error);
        return new NextResponse('Not Found', { status: 404 });
    }
}

function getContentType(filename: string): string | null {
    const extension = path.extname(filename).toLowerCase();
    switch (extension) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.webp':
            return 'image/webp';
        default:
            return null;
    }
}