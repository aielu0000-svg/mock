import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';

export function RequiredRemaining({ count }: { count: number }) {
  return (
    <Alert
      className="fixed right-0 top-[260px] z-[60] hidden w-[260px] border-[#f8d98f] bg-[#fff7de] p-0 shadow-[0_2px_6px_rgba(0,0,0,.12)] lg:block"
      aria-live="polite"
    >
      <AlertDescription className="bg-[#ea5a60] px-4 py-[14px] pl-[22px] text-white [clip-path:polygon(12%_0,100%_0,100%_100%,12%_100%,0_50%)]">
        <p className="mb-[10px] text-xs font-extrabold leading-[1.55]">必須事項をご記入の上、<br />次ページへお進みください。</p>
        <div className="flex items-baseline gap-[10px]">
          <span className="text-base font-black tracking-[.02em]">残り必須項目</span>
          <span className="text-[46px] font-black leading-none text-yellow-300">{count}</span>
          <span className="text-lg font-black">件</span>
        </div>
      </AlertDescription>
    </Alert>
  );
}
