import { usePathname } from "next/navigation";

// 获取最后的路径(小项目id)
export const useLastPath = () => {
    const paths = usePathname().split('/');
    return paths[paths.length - 1];
};