
import { MetaForm } from '@/components/meta-form';
import { PATH } from '@/constants/path';
import Client from '@/utils/prisma-client';

export const dynamic = 'force-dynamic'; // 强制动态渲染
export const revalidate = 0; // 禁用缓存

export default async function Meta() {
    const meta = await Client.meta.findFirst({
        where: {
            path: PATH.HOME,
        },
    });
    return <MetaForm
        {...meta}
        path={PATH.HOME}
    ></MetaForm>;
}