'use client';

import { API } from '@/constants/api';
import '@ant-design/v5-patch-for-react-19';
import { GetProp, message, UploadFile } from 'antd';
import Upload, { UploadChangeParam, UploadProps } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Image from 'next/image';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const useUploadImage = ({
    target,
    defaultUrl = '',
}: {
    target?: string | null;
    defaultUrl?: string | null;
}) => {
    const [imageUrl, setImageUrl] = useState(defaultUrl);
    const [uploadImageLoading, setUploadImageLoading] = useState(false);
    // 上传按钮
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {uploadImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    // 限制文件类型和大小
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    // 上传回调
    const uploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
        // 上传完成
        if (info.file.status === 'done') {
            setImageUrl(info.file.response.url);
            setUploadImageLoading(false);
        } else if (info.file.status === 'uploading') {
            setUploadImageLoading(true);
            setImageUrl('');
        } else {
            setUploadImageLoading(false);
            setImageUrl('');
        }
    }
    return {
        imageUrl,
        setImageUrl,
        uploadComponent: (
            <Upload
                action={target || API.ADMIN.UPLOAD}
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                onChange={uploadChange}
                beforeUpload={beforeUpload}
            >
                {imageUrl ? <Image src={imageUrl} alt="avatar" width={80} height={80} /> : uploadButton}
            </Upload>
        )
    };
}