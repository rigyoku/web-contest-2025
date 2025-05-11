'use client';

import { useState, useCallback, useEffect } from "react";

const updateCss = (isDark: boolean) => {
    document.querySelector<HTMLElement>(':root')?.style.setProperty('--foreground-light', isDark ? '#f5f5f5' : 'rgb(40, 42, 45)');
    document.querySelector<HTMLElement>(':root')?.style.setProperty('--foreground-weight', isDark ? '#bdbdbd' : 'rgb(34, 35, 37)');
    document.querySelector<HTMLElement>(':root')?.style.setProperty('--background-light', isDark ? '#1e1e1e' : 'rgb(249, 249, 249)');
    document.querySelector<HTMLElement>(':root')?.style.setProperty('--background-weight', isDark ? '#121212' : 'rgb(218, 219, 221)');
    document.querySelector<HTMLElement>(':root')?.style.setProperty('--icon-background', isDark ? '#bdbdbd' : 'transparent');
}

// 黑夜模式组件
export const DarkSwitch = () => {
    const [dark, setDark] = useState(false);
    const onClick = useCallback(() => {
        setDark(dark => {
            localStorage.setItem('dark', JSON.stringify(!dark));
            updateCss(!dark);
            return !dark;
        });
    }, [setDark]);
    // 初始化时, 先从localstorage中读取dark的值
    // 并设置监听, 当用户更改系统主题时, 更新dark的值, 并保存到localstorage中
    // 同时, 当组件卸载时, 移除监听
    useEffect(() => {
        setDark(localStorage.getItem('dark') === 'true');
        updateCss(localStorage.getItem('dark') === 'true');
        const mqList = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = (event: MediaQueryListEvent) => {
            setDark(() => {
                localStorage.setItem('dark', JSON.stringify(event.matches));
                updateCss(event.matches);
                return event.matches;
            });
        }
        mqList.addEventListener('change', listener);
        return () => {
            mqList.removeEventListener('change', listener);
        }
    }, [setDark]);

    return <div style={{
        display: 'inline-block',
        fontSize: '24px',
        marginRight: '16px',
    }} onClick={onClick}>{dark ? '🌘' : '☀️'}</div>;
}