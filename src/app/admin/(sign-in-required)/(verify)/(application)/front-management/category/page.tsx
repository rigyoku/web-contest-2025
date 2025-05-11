import { CategoryTable } from "@/components/category-table";
import Client from "@/utils/prisma-client";

export const dynamic = 'force-dynamic'; // 强制动态渲染
export const revalidate = 0; // 禁用缓存

export default async function Category() {
    const categories = await Client.category.findMany({
        where: {
            deleted: 0,
        },
    });
    return <CategoryTable categories={categories}></CategoryTable>;
}