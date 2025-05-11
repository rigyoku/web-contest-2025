import { activeCount } from '@/app/api/front/sse-refresh/route';
import { ClickNameLog, Dashboard, VisitDayLog } from '@/components/dashboard';
import { REDIS_KEY } from '@/constants/redis-key';
import Client from '@/utils/prisma-client';
import { Redis } from '@/utils/redis';

export const dynamic = 'force-dynamic'; // 强制动态渲染
export const revalidate = 0; // 禁用缓存

export default async function Page() {
  const visitCount = (await Client.visit_history.findMany()).length;
  const lockedUserCount = (await Redis.keys(`${REDIS_KEY.LOCKED_USER}*`)).length;
  // 获取每天的访问记录
  const dailyVisits = (await Client.$queryRaw<VisitDayLog[]>`
  SELECT 
    DATE(timestamp) as date,
    COUNT(*) as count
  FROM 
    web_contest.visit_history
  WHERE 
    timestamp >= DATE_SUB(CURRENT_DATE(), INTERVAL 20 DAY)
  GROUP BY 
    DATE(timestamp)
  ORDER BY 
    date ASC
  LIMIT 20
`).map(item => ({
    date: item.date,
    count: Number(item.count)
  }));
  const clickNameLogInfo = await Client.click_history.groupBy({
    by: ['relation_id'],
    _count: {
      id: true
    },
  });
  const clickNameLog: ClickNameLog[] = [];
  for (const { relation_id, _count: { id } } of clickNameLogInfo) {
    const log = await Client.item.findFirst({
      where: {
        id: relation_id,
        deleted: 0,
      }
    });
    if (log) {
      clickNameLog.push({
        name: log.name,
        count: id,
      });
    }
  }
  return (
    <Dashboard
      visitCount={visitCount}
      activeCount={activeCount}
      lockedUserCount={lockedUserCount}
      visitDayLog={dailyVisits}
      clickNameLog={clickNameLog}
    >
    </Dashboard>
  );
}