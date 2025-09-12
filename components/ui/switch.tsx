'use client';
import * as React from 'react';
export function Switch({ defaultChecked }: { defaultChecked?: boolean }) {
  const [on, setOn] = React.useState(!!defaultChecked);
  return <button onClick={()=>setOn(!on)} className={"h-6 w-11 rounded-full "+(on?"bg-green-500":"bg-slate-300")} aria-pressed={on}><span className={"inline-block h-5 w-5 bg-white rounded-full translate-x-1 transition "+(on?"translate-x-5":"")} /></button>;
}
