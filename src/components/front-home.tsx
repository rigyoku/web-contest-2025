'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react'
import RINGS from 'vanta/dist/vanta.rings.min'
import * as THREE from "three";
// Make sure window.THREE is defined, e.g. by including three.min.js in the document head using a <script> tag

import { Avatar, Tooltip, Card, Input, Select, Space, Spin } from 'antd';
import { LANG } from '@/languages/lang';
import { CODE } from '@/constants/code';
import Link from 'next/link';
import { ClickLog } from './click-log';
import { API } from '@/constants/api';
import axios from 'axios';
import { ClientItem } from '@/app/(front-end)/[language]/[category_id]/type';

export const FrontHome = ({ children, lang, options }: {
    children: ReactNode, lang: LANG, options: {
        value: string;
        label: ReactNode;
    }[]
}) => {
    const [vantaEffect, setVantaEffect] = useState(null)
    const myRef = useRef(null)
    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(RINGS({
                el: myRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                backgroundAlpha: 0.00,
            }))
        }
        return () => {
            if (vantaEffect) (vantaEffect as any).destroy()
        }
    }, [vantaEffect]);

    const [loading, setLoading] = useState(false);

    const [code, setCode] = useState(CODE.SEARCH_IN_SATATION);

    const [input, setInput] = useState<string>();

    const [askResult, setAskResult] = useState<string>('');

    const [searchResult, setSearchResult] = useState<ClientItem[]>();

    const onFinish = async () => {
        try {
            if (code === CODE.SEARCH_IN_SATATION) {
                setLoading(true);
                const categories = await axios.get<ClientItem[]>(API.ADMIN.ITEM, {
                    params: {
                        name: input,
                    },
                });
                setSearchResult(categories.data);
            } else if (code === CODE.SEARCH_BY_AI) {
                try {
                    setAskResult('');

                    const response = await fetch('http://localhost:11434/api/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: 'deepseek-r1:1.5b',
                            prompt: input,
                            stream: true
                        })
                    });

                    const reader = response.body?.getReader();
                    const decoder = new TextDecoder();
                    if (!reader) {
                        throw new Error('无法获取响应体的读取器');
                    }
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value);
                        try {
                            const json = JSON.parse(chunk);
                            console.log('接收到的 JSON 数据:', json);
                            setAskResult(prev => prev + (json.response || ''));
                        } catch (err) {
                            console.error('解析错误:', err);
                        }
                    }
                } catch (error: any) {
                    console.error('请求失败:', error);
                    setAskResult('请求失败: ' + error.message);
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return <div ref={myRef} style={{
        width: '80vw',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            height: '80vh',
        }}>
            {children}
            <Spin tip="Loading" spinning={loading}>
                <div style={{
                    marginTop: '24px',
                    width: '80vw',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>
                    <Space direction="horizontal" size="middle">
                        <Space.Compact style={{
                            width: '50vw',
                        }}>
                            <Select options={options} value={code} onChange={value => setCode(value)} style={{ width: '20%' }}></Select>
                            <Input.Search placeholder={lang.search} style={{
                                backgroundColor: 'var(--background-light)',
                                color: 'var(--foreground-light)',
                                borderColor: 'var(--foreground-light)',
                                width: '80%',
                            }} value={input} onChange={value => setInput(value.target.value)} onSearch={onFinish} />
                        </Space.Compact>
                    </Space>
                </div>
                {
                    code === CODE.SEARCH_IN_SATATION && <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '16px',
                            padding: '16px',
                            overflowY: 'auto',
                            marginTop: '24px',
                            maxWidth: '70vw',
                            maxHeight: '70vh',
                        }}>
                            {
                                searchResult?.map(({ id, name, description, icon, link, count }) => {
                                    return <Link href={link} key={id} target='_blank'>
                                        <ClickLog relationId={id}>
                                            <Card className="no-padding" style={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'var(--background-light)',
                                                color: 'var(--foreground-light)',
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: '10vh',
                                                }}>
                                                    <div style={{ marginRight: '8px' }}>
                                                        <Avatar src={icon || '/error-icon.png'} style={{ width: '48px', height: '48px' }} />
                                                    </div>
                                                    <div style={{ minWidth: '200px' }}>
                                                        <div>
                                                            <Tooltip title={name}>
                                                                <span style={{
                                                                    display: 'inline-block',
                                                                    fontSize: '12px',
                                                                    fontWeight: 600,
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    maxWidth: '150px'

                                                                }}>{name}</span></Tooltip>
                                                            <span style={{
                                                                fontSize: '8px',
                                                                fontWeight: 400,
                                                                marginLeft: '2px',
                                                            }}>点击量: {count}</span>
                                                        </div>
                                                        <Tooltip title={description}>
                                                            <div style={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                maxWidth: '200px'
                                                            }}>{description}</div>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </Card>
                                        </ClickLog>
                                    </Link>;
                                })
                            }
                        </div>
                    </div>
                }
                {
                    code === CODE.SEARCH_BY_AI &&
                    <div className='card'
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Card loading={askResult === ''} style={{
                            marginTop: '24px',
                            width: '50vw',
                            maxHeight: '70vh',
                            overflowY: 'auto',
                        }}>
                            {/* <Descriptions>
                                
                            </Descriptions> */}
                            {askResult}
                        </Card>
                    </div>
                }
            </Spin>
        </div>
    </div>
}