import { useFirstPath } from "@/hooks/first-path";
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import Link from "next/link";
import { LANGUAGES } from "@/constants/languages";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// 多语言组件
export const Languages = () => {
    const path = usePathname();
    const language = useFirstPath() as keyof typeof LANGUAGES;

    const [selectItems, setSelectItems] = useState<MenuProps['items']>();

    // 列表中, 排除当前语言
    useEffect(() => {
        const items = [];
        for (const key in LANGUAGES) {
            const itemKey = key as keyof typeof LANGUAGES;
            if (itemKey !== language) {
                const targetPath = path.replace(`/${language}`, `/${itemKey}`);
                items.push({
                    key: itemKey,
                    label: (
                        <Link href={targetPath}>
                            {LANGUAGES[itemKey]}
                        </Link>
                    ),
                });
            }
        }
        setSelectItems(items);
    }, [setSelectItems, path, language]);

    return (
        <div style={{
            display: 'inline-block',
            height: '64px',
        }}>
            <Dropdown menu={{ items: selectItems }}>
                <Space>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <span style={{
                            display: 'inline-block',
                            width: '24px',
                            height: '24px',
                            maskImage: "url('/language.svg')",
                            color: 'rgb(78, 78, 78)',
                            backgroundColor: 'rgb(78, 78, 78)',
                            marginRight: '4px',
                            marginLeft: '4px',
                        }}></span>
                        {LANGUAGES[language]}
                    </div>
                    <DownOutlined />
                </Space>
            </Dropdown>
        </div>
    )
}