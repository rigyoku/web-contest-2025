import { FrontHome } from "@/components/front-home";
import { CODE } from "@/constants/code";
import { getLang } from "@/utils/lang";

export default async function RootPage({
  params,
}: Readonly<{
  params: Promise<{ language: string }>;
}>) {
  const lang = await getLang(params);
  const options = [
    {
      value: CODE.SEARCH_IN_SATATION,
      label: lang.search,
    },
    {
      value: CODE.SEARCH_BY_AI,
      label: lang.ask,
    },
  ];
  return <FrontHome lang={lang} options={options}>
    <div style={{
      color: 'var(--foreground-light)',
      fontSize: '32px',
    }}>{lang.slogan}</div>
  </FrontHome >;
}