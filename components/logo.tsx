import Image from "next/image";
import { ActionTooltip } from "@/components/action-tooltip";

const Logo = () => {
  return (
    <ActionTooltip label="SyncUp" side="right">
      <div className="rounded-full flex items-center justify-center overflow-hidden h-[48px] w-[48px]">
        <Image
          src={process.env.NEXT_PUBLIC_LOGO_URL || ''}
          alt="SyncUp"
          width={100} 
          height={100}
          className="rounded-full object-cover scale-[2.7]" 
          priority
        />
      </div>
    </ActionTooltip>
  );
};
export default Logo;
