import { ItemsView } from "@/components/item-view";
import { PATH } from "@/constants/path";
import Client from "@/utils/prisma-client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'; // 强制动态渲染
export const revalidate = 0; // 禁用缓存

export default async function Items({ params }: Readonly<{
    params: Promise<{ language: string, category_id: string }>;
}>) {
    const { category_id } = await params;
    const items = await Client.item.findMany({
        where: {
            category_id: parseInt(category_id),
            deleted: 0,
        },
    });
    const category = await Client.category.findUnique({
        where: {
            id: parseInt(category_id),
            deleted: 0,
        },
    });
    if (!category) {
        redirect(PATH.FRONT_CATEGORY);
    }
    return (
        <ItemsView items={items} category={category}></ItemsView>
    )
}