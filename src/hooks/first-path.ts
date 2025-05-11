import { usePathname } from "next/navigation";

// 获取第一节路径(当前语言)
export const useFirstPath = () => {
    const paths = usePathname().split('/');
    if (paths.length === 1) {
        return 'en';
    }
    return paths[1];
};